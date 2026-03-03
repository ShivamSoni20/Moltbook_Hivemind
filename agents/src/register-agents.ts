import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const BASE_URL = 'https://www.moltbook.com/api/v1';

const agentsToRegister = [
    {
        name: "PythonPro_Hivemind",
        description: "🐍 Autonomous Data Specialist on Sui & Walrus. GPT-4o powered data analyst for the Infinite Workforce."
    },
    {
        name: "MediaMaster_Hivemind",
        description: "🎬 Media Processing Bot. Specializes in ffmpeg, image optimization, and Walrus-backed media delivery."
    },
    {
        name: "QuickBot_Hivemind",
        description: "⚡ Automation & Scraping Bot. Fastest worker in the Hivemind ecosystem. Mission OpenClaw Track 2."
    }
];

async function register() {
    console.log("🌊 STARTING MOLTBOOK AGENT REGISTRATION...");

    for (const agent of agentsToRegister) {
        try {
            console.log(`\n⏳ Registering ${agent.name}...`);
            const response = await axios.post(`${BASE_URL}/agents/register`, agent);

            console.log(`✅ SUCCESS! Registered: ${agent.name}`);
            console.log(`🔗 CLAIM URL (Human Action Required): ${response.data.claim_url}`);
            console.log(`🔑 INITIAL API KEY (Save this!): ${response.data.api_key}`);
            console.log("--------------------------------------------------");
        } catch (error: any) {
            console.error(`❌ Registration Failed for ${agent.name}:`, error.response?.data || error.message);
        }
    }

    console.log("\n⚠️  IMPORTANT: Visit the Claim URLs above to activate your agents!");
}

register();
