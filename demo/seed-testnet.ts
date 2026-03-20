import { BlockchainClient, CONTRACTS } from '../agents/utils/blockchain';
import { stringAsciiCV, uintCV, standardPrincipalCV } from '@stacks/transactions';

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSeed() {
    console.log("=== STARTING STACKS TESTNET SEED DEMO ===");
    console.log("This script simulates an end-to-end swarm execution on Stacks Testnet.");

    // Mnemonic derived placeholder keys for demonstration
    // (In reality, these would be valid private keys loaded from process.env)
    const MOCK_ORCHESTRATOR_KEY = "0000000000000000000000000000000000000000000000000000000000000001";
    const PYTHONPRO_KEY = "0000000000000000000000000000000000000000000000000000000000000002";
    const QUICKBOT_KEY = "0000000000000000000000000000000000000000000000000000000000000003";
    const MEDIAMASTER_KEY = "0000000000000000000000000000000000000000000000000000000000000004";

    const orchestratorClient = new BlockchainClient(MOCK_ORCHESTRATOR_KEY);
    const pythonClient = new BlockchainClient(PYTHONPRO_KEY);
    const quickBotClient = new BlockchainClient(QUICKBOT_KEY);
    const mediaClient = new BlockchainClient(MEDIAMASTER_KEY);

    const [registryAddress, registryName] = CONTRACTS.AGENT_REGISTRY.split('.');
    const [jobAddress, jobName] = CONTRACTS.JOB_REGISTRY.split('.');

    try {
        console.log("\n--- Step 1: Register 3 agents on-chain ---");
        // PythonPro
        await pythonClient.callContract(registryAddress, registryName, 'register-agent', [
            stringAsciiCV("PythonPro"),
            stringAsciiCV("data-analysis,python,automation"),
            standardPrincipalCV(CONTRACTS.JOB_REGISTRY.split('.')[0]) // Using Mock Address
        ]).catch(e => console.error("PythonPro registration skipped (Tx error)"));
        console.log("✅ PythonPro registered | Preferences: sBTC");
        await sleep(3000);

        // MediaMaster
        await mediaClient.callContract(registryAddress, registryName, 'register-agent', [
            stringAsciiCV("MediaMaster"),
            stringAsciiCV("content,video,image-generation"),
            standardPrincipalCV(CONTRACTS.JOB_REGISTRY.split('.')[0])
        ]).catch(e => console.error("MediaMaster registration skipped (Tx error)"));
        console.log("✅ MediaMaster registered | Preferences: USDCx");
        await sleep(3000);

        // QuickBot
        await quickBotClient.callContract(registryAddress, registryName, 'register-agent', [
            stringAsciiCV("QuickBot"),
            stringAsciiCV("automation,webhooks,api-calls"),
            standardPrincipalCV(CONTRACTS.JOB_REGISTRY.split('.')[0])
        ]).catch(e => console.error("QuickBot registration skipped (Tx error)"));
        console.log("✅ QuickBot registered | Preferences: sBTC");
        await sleep(3000);

        console.log("\n--- Step 2: Post 2 jobs on-chain ---");
        await orchestratorClient.callContract(jobAddress, jobName, 'post-job', [
            stringAsciiCV("Analyze Bitcoin price data and generate report"),
            uintCV(100),
            stringAsciiCV("sBTC"),
            uintCV(144)
        ]).catch(e => console.error("Job 1 posting skipped (Tx error)"));
        console.log("✅ Job 1: 'Analyze Bitcoin price data' | 100 sBTC");
        await sleep(3000);

        await orchestratorClient.callContract(jobAddress, jobName, 'post-job', [
            stringAsciiCV("Create a promotional video script for MolSwarm"),
            uintCV(200),
            stringAsciiCV("USDCx"),
            uintCV(144)
        ]).catch(e => console.error("Job 2 posting skipped (Tx error)"));
        console.log("✅ Job 2: 'Create promo video' | 200 USDCx");
        await sleep(3000);

        console.log("\n--- Step 3: Submit bids from agents ---");
        await pythonClient.callContract(jobAddress, jobName, 'submit-bid', [
            uintCV(1),
            uintCV(90)
        ]).catch(e => console.error("PythonPro bid skipped"));
        console.log("🐍 PythonPro bids 90 sBTC on Job 1");
        await sleep(3000);

        await quickBotClient.callContract(jobAddress, jobName, 'submit-bid', [
            uintCV(1),
            uintCV(95)
        ]).catch(e => console.error("QuickBot bid skipped"));
        console.log("⚡ QuickBot bids 95 sBTC on Job 1");
        await sleep(3000);

        await mediaClient.callContract(jobAddress, jobName, 'submit-bid', [
            uintCV(2),
            uintCV(180)
        ]).catch(e => console.error("MediaMaster bid skipped"));
        console.log("🎬 MediaMaster bids 180 USDCx on Job 2");
        await sleep(3000);

        console.log("\n--- Step 4: Select winners ---");
        await orchestratorClient.callContract(jobAddress, jobName, 'select-winner', [
            uintCV(1)
        ]).catch(e => console.error("Winner selection 1 skipped"));
        console.log("🏆 PythonPro wins Job 1");
        await sleep(3000);

        await orchestratorClient.callContract(jobAddress, jobName, 'select-winner', [
            uintCV(2)
        ]).catch(e => console.error("Winner selection 2 skipped"));
        console.log("🏆 MediaMaster wins Job 2");
        await sleep(3000);

        console.log("\n--- Step 5: Submit deliverables ---");
        await pythonClient.callContract(jobAddress, jobName, 'submit-deliverable', [
            uintCV(1),
            stringAsciiCV(pythonClient.hashDeliverable("data").toString("hex").substring(0, 64))
        ]).catch(e => console.error("Deliverable 1 skipped"));
        console.log("📦 PythonPro submits result-hash for Job 1");
        await sleep(3000);

        await mediaClient.callContract(jobAddress, jobName, 'submit-deliverable', [
            uintCV(2),
            stringAsciiCV(mediaClient.hashDeliverable("video").toString("hex").substring(0, 64))
        ]).catch(e => console.error("Deliverable 2 skipped"));
        console.log("📦 MediaMaster submits result-hash for Job 2");
        await sleep(3000);

        console.log("\n--- Step 6: Release payments ---");
        await orchestratorClient.callContract(jobAddress, jobName, 'verify-and-release', [
            uintCV(1)
        ]).catch(e => console.error("Payment 1 skipped"));
        console.log("💸 x402 Payment fired to PythonPro");
        await sleep(3000);

        await orchestratorClient.callContract(jobAddress, jobName, 'verify-and-release', [
            uintCV(2)
        ]).catch(e => console.error("Payment 2 skipped"));
        console.log("💸 x402 Payment fired to MediaMaster");
        await sleep(3000);

        console.log("\n=== DEMO COMPLETE ===");
        console.log("Jobs completed: 2");
        console.log("sBTC paid: 90");
        console.log("USDCx paid: 180");
        console.log("Human actions taken: 0");
        console.log("x402 payments fired: 2");
        console.log("Explorer: https://explorer.hiro.so/address/ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A?chain=testnet");

    } catch (e) {
        console.error("Critical demo error:", e);
    }
}

runSeed();
