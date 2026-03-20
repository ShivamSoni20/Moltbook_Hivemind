import { BlockchainClient } from '../agents/utils/blockchain';
import { OrchestratorMolbot } from '../agents/orchestrator-molbot';
import { PythonProAgent } from '../agents/pythonpro';
import { MediaMasterAgent } from '../agents/mediamaster';
import dotenv from 'dotenv';
dotenv.config();

const SLEEP_MS = 60000; // Poll every 60s for Stacks ~10 min blocks
const STACKS_API_WS = "wss://api.testnet.hiro.so/";

async function runSwarmDaemon() {
    console.log("🚀 MolSwarm Hivemind Swarm Orchestrator Starting...");
    console.log("📡 Connecting to Stacks API: https://api.testnet.hiro.so");
    
    // Subscribe to Stacks API mempool for faster detection (Comment logic)
    // const stxWebSocket = new WebSocket(STACKS_API_WS);
    // stxWebSocket.on('message', (msg) => { handleMempoolTx(msg) });
    console.log("🔌 (Stub) Subscribed to Stacks API mempool websockets for zero-latency detection.");

    const orchestratorMolbot = new OrchestratorMolbot(process.env.ORCHESTRATOR_PRIVATE_KEY!);
    const pythonPro = new PythonProAgent();
    const mediaMaster = new MediaMasterAgent();

    const blockchain = new BlockchainClient(process.env.ORCHESTRATOR_PRIVATE_KEY!);

    while (true) {
        try {
            console.log("\n🔍 Scanning for open opportunities on Stacks Testnet...");
            const openJobs = await blockchain.pollForJobs();

            if (openJobs.length === 0) {
                console.log("😴 No open jobs found. Resting module...");
            }

            for (let job of openJobs) {
                // Route complex jobs -> Orchestrator; python tasks -> PythonPro; graphics -> MediaMaster.
                // Depending on the job complexity, the Hivemind assigns the agent.
                // For demonstration, dispatch dynamically:
                
                // if (job.isComplex) await orchestratorMolbot.decomposeAndExecute(job.desc, job.bounty);
                // else if (job.token === "sBTC") await pythonPro.run(job.desc, job.id, job.bounty, job.token);
                // else await mediaMaster.run(job.desc, job.id, job.bounty, job.token);
            }
        } catch (error) {
            console.error("🚨 Swarm Daemon Error:", error);
        }

        await new Promise(resolve => setTimeout(resolve, SLEEP_MS));
    }
}

runSwarmDaemon().catch(console.error);
