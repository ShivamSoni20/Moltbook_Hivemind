import { Transaction } from '@mysten/sui/transactions';
import { SuiWrapper } from './sui-client.js';

async function main() {
    console.log("Creating new dummy jobs as Agent MediaMaster...");
    // MediaMaster acts as the Client/Poster
    const poster = process.env.AGENT_MEDIA_KEY!;
    const client = new SuiWrapper(poster);

    const jobs = [
        {
            desc: "Write API Documentation for DeFi Protocol",
            budget: 0.12,
            deadline: Date.now() + 86400000
        },
        {
            desc: "Optimize smart contract for gas usage",
            budget: 0.08,
            deadline: Date.now() + (2 * 86400000)
        }
    ];

    for (const job of jobs) {
        console.log(`Posting job: ${job.desc} for ${job.budget} SUI`);
        try {
            const res = await client.postJob(job.budget, job.desc, job.deadline);
            console.log(`✅ Posted! Digest: ${res.digest}`);
        } catch (e: any) {
            console.error(`❌ Failed:`, e.message);
        }
    }
}
main().catch(console.error);
