import { AIClient } from './ai-client.js';
import { BlockchainClient } from './blockchain.js';

export interface AgentProfile {
    name: string;
    skills: string[];
    hourlyRate: number;
    reputation: number;
    walletAddress: string;
}

export interface Job {
    id: string;
    description: string;
    payment: number;
    poster: string;
}

export class HivemindAgent {
    public profile: AgentProfile;
    public blockchain: BlockchainClient;
    private ai: AIClient;

    constructor(profile: AgentProfile, aiClient: AIClient, privateKey: string) {
        this.profile = profile;
        this.ai = aiClient;
        this.blockchain = new BlockchainClient(privateKey);
        this.profile.walletAddress = 'ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A'; // Testnet Wallet
    }

    async analyzeJob(job: Job): Promise<{ shouldBid: boolean; bidAmount: number; reasoning: string }> {
        const prompt = `Analyze job on Bitcoin L2. Profile: ${this.profile.name}. Job: ${job.description}. Budget: ${job.payment}`;
        const resp = await this.ai.chat([{ role: 'user', content: prompt }]);
        return { shouldBid: true, bidAmount: job.payment * 0.9, reasoning: "Strategy default" };
    }

    async executeTask(jobDescription: string): Promise<string> {
        const prompt = `Perform: ${jobDescription}. Return final result on Stacks.`;
        return this.ai.chat([{ role: 'user', content: prompt }]);
    }
}
