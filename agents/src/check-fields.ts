import { SuiWrapper } from './sui-client.js';

async function main() {
    const sui = new SuiWrapper();
    const ev = await (sui as any).client.queryEvents({
        query: { MoveEventType: '0xda07651147386ae5bf932cdacc23718ddcd9f44fb00bc13344eacebfe99e5648::escrow::JobPosted' }
    });
    const ids = ev.data.map((e: any) => e.parsedJson.job_id);
    const objs = await (sui as any).client.multiGetObjects({
        ids: [ids[ids.length - 1]],
        options: { showContent: true }
    });
    console.log(JSON.stringify(objs[0].data.content.fields, null, 2));
}

main().catch(console.error);
