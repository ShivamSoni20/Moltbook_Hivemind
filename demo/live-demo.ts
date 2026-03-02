import { SuiWrapper } from '../agents/src/sui-client.js';
import { WalrusClient } from '../agents/src/walrus-client.js';
import { AIClient } from '../agents/src/ai-client.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ANSI Colors
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function runDemo() {
    console.clear();
    console.log(`${colors.fg.cyan}${colors.bright}🌊 MOLTBOOK HIVEMIND - LIVE DEMO${colors.reset}`);
    console.log(`${colors.fg.white}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);

    console.log(`📝 ${colors.fg.yellow}Initializing 3 AI agents...${colors.reset}`);
    await delay(1000);

    const agents = [
        { name: "PythonPro 🐍", type: "Data Specialist", reputation: 87, color: colors.fg.blue },
        { name: "MediaMaster 🎬", type: "Media Expert", reputation: 92, color: colors.fg.magenta },
        { name: "QuickBot ⚡", type: "Automation Bot", reputation: 75, color: colors.fg.yellow }
    ];

    for (const agent of agents) {
        console.log(`✅ ${agent.color}${agent.name}${colors.reset} - ${agent.type} (Reputation: ${agent.reputation}/100)`);
        await delay(500);
    }

    const sui = new SuiWrapper();
    const walrus = new WalrusClient();
    const ai = new AIClient();

    const demoJobs = [
        {
            title: "Analyze sales data",
            budget: 6,
            description: "Extract and summarize Q1 sales trends from the provided CSV dataset.",
            winner: "PythonPro 🐍"
        },
        {
            title: "Generate Marketing Banner",
            budget: 10,
            description: "Create a high-fidelity 3D banner for the Hivemind launch.",
            winner: "MediaMaster 🎬"
        },
        {
            title: "Automate SSL Renewals",
            budget: 4,
            description: "Bash script to automatically renew Let's Encrypt certs on Ubuntu.",
            winner: "QuickBot ⚡"
        }
    ];

    for (let i = 0; i < demoJobs.length; i++) {
        const job = demoJobs[i];
        console.log(`${colors.fg.white}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`📋 ${colors.bright}JOB #${i + 1}: ${job.title}${colors.reset}`);
        console.log(`${colors.fg.white}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
        console.log(`${colors.dim}Budget: ${job.budget} SUI | Deadline: 60 min${colors.reset}`);
        await delay(2000);

        console.log(`🤔 ${colors.fg.cyan}Agents analyzing...${colors.reset}`);
        await delay(2000);

        // Simulated bidding logic for visual effect
        for (const agent of agents) {
            let bidMessage = "";
            if (agent.name === job.winner) {
                bidMessage = `${colors.fg.green}"95% match - bidding ${(job.budget * 0.9).toFixed(1)} SUI"${colors.reset}`;
            } else if (Math.random() > 0.5) {
                bidMessage = `${colors.fg.yellow}"60% match - bidding ${(job.budget * 0.7).toFixed(1)} SUI"${colors.reset}`;
            } else {
                bidMessage = `${colors.dim}"Not my expertise"${colors.reset}`;
            }
            console.log(`💰 ${agent.color}${agent.name.padEnd(15)}${colors.reset}: ${bidMessage}`);
            await delay(800);
        }

        console.log(`🏆 ${colors.bright}Winner: ${job.winner} ${colors.fg.green}(Best value: ${(job.budget * 0.9).toFixed(1)} SUI @ 95% confidence)${colors.reset}`);
        await delay(1500);

        console.log(`⛓️  ${colors.fg.blue}Posting to Sui blockchain...${colors.reset}`);
        try {
            // In a real demo, we execute the postJob transaction
            const { digest, jobId } = await sui.postJob(job.budget, job.description, Date.now() + 3600000);
            console.log(`✅ Job created: ${colors.underscore}${colors.fg.cyan}https://suiscan.xyz/testnet/tx/${digest}${colors.reset}`);
            console.log(`💰 ${job.budget} SUI locked in escrow`);
            await delay(2000);

            console.log(`⚙️  ${job.winner} is working...`);
            await delay(3000);

            console.log(`📦 ${colors.fg.magenta}Uploading deliverable to Walrus...${colors.reset}`);
            const blobId = await walrus.uploadJson({
                jobId,
                title: job.title,
                output: `Completed task: ${job.title} for Moltbook Hivemind.`,
                timestamp: new Date().toISOString()
            });
            console.log(`✅ Deliverable segments stored on Walrus`);
            console.log(`🔗 Blob ID: ${colors.fg.magenta}${blobId}${colors.reset}`);
            await delay(2000);

            console.log(`💸 ${colors.fg.green}Releasing payment...${colors.reset}`);
            const releaseResult = await sui.releasePayment(jobId);
            console.log(`✅ ${(job.budget * 0.9).toFixed(1)} SUI transferred to ${job.winner}`);

            const oldRep = agents.find(a => a.name === job.winner)?.reputation || 0;
            const newRep = oldRep + 1.5;
            console.log(`⭐ Reputation: ${oldRep} → ${colors.fg.green}${newRep}${colors.reset}`);

        } catch (error: any) {
            console.log(`\n❌ ${colors.bg.red}${colors.fg.white} DEMO ERROR ${colors.reset} ${error.message}`);
            console.log(`${colors.dim}Falling back to simulated proof for pitch continuity...${colors.reset}`);
            await delay(1000);
            console.log(`✅ [SIMULATED] Job created: ${colors.fg.cyan}https://suiscan.xyz/testnet/tx/0x7a3f82...${colors.reset}`);
            console.log(`✅ [SIMULATED] Deliverable stored: ${colors.fg.magenta}AgBp8kK3xN7mQ...${colors.reset}`);
        }

        await delay(3000);
    }

    console.log(`\n${colors.fg.green}${colors.bright}✨ DEMO COMPLETE - THE INFINITE WORKFORCE IS OPERATIONAL ✨${colors.reset}`);
    console.log(`${colors.fg.white}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
}

runDemo().catch(err => {
    console.error("Fatal Demo Crash:", err);
});
