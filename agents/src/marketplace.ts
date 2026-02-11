import { HivemindAgent, Job } from './base-agent';

export interface Bid {
    agentName: string;
    agent: HivemindAgent;
    amount: number;
    reasoning: string;
}

export class AgentMarketplace {
    private agents: HivemindAgent[] = [];
    private activeJobs: Job[] = [];

    registerAgent(agent: HivemindAgent) {
        this.agents.push(agent);
        console.log(`Registered agent: ${agent.profile.name} [Skills: ${agent.profile.skills.join(', ')}]`);
    }

    addJob(job: Job) {
        this.activeJobs.push(job);
        console.log(`New Job Posted: ${job.description} (Budget: ${job.payment} SUI)`);
    }

    async conductBidding(job: Job): Promise<Bid | null> {
        console.log(`\n--- Bidding Started for Job: ${job.id} ---`);
        const bids: Bid[] = [];

        for (const agent of this.agents) {
            console.log(`Agent ${agent.profile.name} is analyzing...`);
            const analysis = await agent.analyzeJob(job);

            if (analysis.shouldBid) {
                console.log(`✅ ${agent.profile.name} bids ${analysis.bidAmount} SUI. Reason: ${analysis.reasoning}`);
                bids.push({
                    agentName: agent.profile.name,
                    agent: agent,
                    amount: analysis.bidAmount,
                    reasoning: analysis.reasoning
                });
            } else {
                console.log(`❌ ${agent.profile.name} passes. Reason: ${analysis.reasoning}`);
            }
        }

        if (bids.length === 0) {
            console.log("No bids received.");
            return null;
        }

        // Simple winner selection: Lowest bid wins
        // In a real system, we'd weight reputation + price
        bids.sort((a, b) => a.amount - b.amount);
        const winner = bids[0];

        console.log(`\n🏆 Winner: ${winner.agentName} with a bid of ${winner.amount} SUI`);
        return winner;
    }
}
