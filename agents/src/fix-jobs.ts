import { SuiWrapper } from './sui-client.js';
import { WalrusClient } from './walrus-client.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function main() {
    // Use PythonPro agent key (different from poster key)
    const agentKey = process.env.AGENT_PYTHON_KEY!;
    const sui = new SuiWrapper(agentKey);
    const walrus = new WalrusClient();

    console.log('Agent wallet:', sui.getWalletAddress());
    console.log('Fetching ALL jobs (not just open)...');

    // Get all job events
    const packageId = process.env.PACKAGE_ID!;

    // Use the internal client to query
    const events = await (sui as any).client.queryEvents({
        query: { MoveEventType: `${packageId}::escrow::JobPosted` }
    });

    const jobIds = events.data.map((e: any) => (e.parsedJson as any).job_id);
    console.log(`Found ${jobIds.length} total jobs:`, jobIds);

    if (jobIds.length === 0) {
        console.log('No jobs found at all!');
        return;
    }

    const objects = await (sui as any).client.multiGetObjects({
        ids: jobIds,
        options: { showContent: true }
    });

    for (const obj of objects) {
        const fields = (obj.data?.content as any)?.fields;
        if (!fields) continue;
        const id = obj.data.objectId;
        const status = fields.status;
        const worker = fields.worker?.fields?.vec?.[0] || 'none';
        const deliverable = fields.deliverable_hash?.fields?.vec?.[0] || 'none';
        const payment = parseInt(fields.payment?.fields?.balance || '0') / 1_000_000_000;
        console.log(`\nJob: ${id}`);
        console.log(`  Desc: ${fields.description}`);
        console.log(`  Status: ${status} (0=Open, 1=InProgress, 2=Delivered, 3=Completed)`);
        console.log(`  Payment: ${payment} SUI`);
        console.log(`  Worker: ${worker}`);
        console.log(`  Deliverable: ${deliverable}`);

        // If job is OPEN (status 0), accept it, do work, upload to walrus, submit
        if (status === 0) {
            console.log(`\n>>> ACCEPTING job ${id}...`);
            try {
                const acceptResult = await sui.acceptJob(id);
                console.log(`✅ Accepted! Digest: ${acceptResult.digest}`);

                // Upload deliverable to Walrus
                const workOutput = {
                    agent: 'PythonPro',
                    timestamp: new Date().toISOString(),
                    job_id: id,
                    description: fields.description,
                    deliverable: `Autonomous completion of: ${fields.description}`,
                };
                console.log('>>> Uploading to Walrus...');
                const blobId = await walrus.uploadJson(workOutput);
                console.log(`✅ Walrus Blob: ${blobId}`);

                // Submit work
                console.log('>>> Submitting work on-chain...');
                const submitResult = await sui.submitWork(id, blobId);
                console.log(`✅ Work submitted! Digest: ${submitResult.digest}`);
            } catch (e: any) {
                console.error(`❌ Error processing job: ${e.message}`);
            }
        }
    }

    console.log('\n✅ Done! Refresh the frontend to see updated data.');
}

main().catch(console.error);
