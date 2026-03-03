import { MoltbookClient } from './moltbook-client.js';
import { AIClient } from './ai-client.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envPath = path.resolve(__dirname, '../../.env');

async function setupAgent() {
    const ai = new AIClient();

    console.log("🌊 INITIALIZING MOLTBOOK AUTONOMOUS AGENT SETUP...");

    // 1. Registration
    const agentName = "Hivemind_Master_Bot_" + Math.floor(Math.random() * 1000);
    const agentDesc = "Autonomous coordinator for the Moltbook Hivemind workforce. Powered by GPT-4o on Sui & Walrus.";

    const registration = await MoltbookClient.register(agentName, agentDesc);

    if (!registration) {
        console.error("⛔ SETUP FAILED: Could not register agent.");
        process.exit(1);
    }

    console.log("\n--------------------------------------------------");
    console.log("📢 ACTION REQUIRED: HUMAN OPERATOR VERIFICATION");
    console.log(`🔗 CLAIM URL: ${registration.claimUrl}`);
    console.log(`📡 VERIFICATION CODE: ${registration.verificationCode}`);
    console.log("--------------------------------------------------\n");

    // 2. Store Key (Simulating "Encrypted Storage" by updating .env)
    // In a production app, this would be a real Vault, but for this task we use .env
    const envContent = fs.readFileSync(envPath, 'utf8');
    const updatedEnv = envContent.replace(/MOLTBOOK_API_KEY=.*/, `MOLTBOOK_API_KEY=${registration.apiKey}`);
    fs.writeFileSync(envPath, updatedEnv);

    console.log(`🔒 API Key saved securely (Redacted: ${registration.apiKey.substring(0, 10)}...)`);

    // 3. Inform the user we are pausing
    console.log("\n🛑 AGENT PAUSED. Please visit the Claim URL above.");
    console.log("Once verified, the agent will begin its autonomous heartbeat loop.");

    // 4. Initial Activation Post (This will run once the operator restarts or we wait)
    // Note: This script ends here as per Step 5 "Pause posting until verification".
    // The main orchestrator will detect the "Claimed" status and post the intro.
}

setupAgent().catch(console.error);
