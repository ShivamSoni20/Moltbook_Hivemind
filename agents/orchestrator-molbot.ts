import { BlockchainClient } from './utils/blockchain';
import { X402PaymentClient } from './utils/x402-client';
import { PaymentLogger } from './utils/payment-logger';
// Ensure to use your actual AIClient implementation
import { AIClient } from './src/ai-client'; 

export class OrchestratorMolbot {
    private blockchain: BlockchainClient;
    private x402: X402PaymentClient;
    private logger: PaymentLogger;
    private ai: AIClient;

    constructor(privateKey: string) {
        this.blockchain = new BlockchainClient(privateKey);
        this.x402 = new X402PaymentClient();
        this.logger = new PaymentLogger();
        this.ai = new AIClient(); 
    }

    public async decomposeAndExecute(complexJobRequest: string, totalBountyAmount: number) {
        console.log(`[Orchestrator] Received Complex Job: "${complexJobRequest}"`);

        // 1. Decompose via GPT-4o
        const subTasksPlan = await this.ai.getReasoning(`
            Decompose the following complex job into two clearly isolated sub-tasks for specialist agents. 
            Job: ${complexJobRequest}
            Output MUST be JSON with "tasks: [{ desc, bountySBTC, token}]".
        `);
        console.log("[Orchestrator] AI Decomposition:", subTasksPlan);

        // Parse mock JSON out for this demo:
        const subtasks = [
            { id: 101, desc: "Write technical content", bountySBTC: totalBountyAmount * 0.4, token: "sBTC" },
            { id: 102, desc: "Create infographic images", bountySBTC: totalBountyAmount * 0.4, token: "sBTC" } // 20% margin retained
        ];

        let results = [];

        // 2. Post each sub-task on-chain via job-registry.clar and hire
        for (const st of subtasks) {
            console.log(`[Orchestrator] Posting subtask to job-registry.clar: ${st.desc} for ${st.bountySBTC} ${st.token}`);
            // Simulating contract call explicitly
            // const jobId = await this.blockchain.callContract("ST...registry", "job-registry", "post-job", [st.desc, ...]);
            const mockJobId = st.id.toString();

            // Simulating Specialist Agent execution & x402 flow
            const specialistEndpoint = `http://specialist-${mockJobId}.molswarm`;
            console.log(`[Orchestrator] Paying specialist via x402 to endpoint: ${specialistEndpoint}`);
            
            // 3. OrchestratorMolbot pays via x402
            const receipt = await this.x402.pay(specialistEndpoint, st.bountySBTC, "ST_SPECIALIST_WALLET");
            this.logger.logPayment("Orchestrator", "Specialist_" + mockJobId, st.bountySBTC, st.token, mockJobId, receipt.txHash);

            results.push(`Deliverable for ${st.desc} | hash: ${this.blockchain.hashDeliverable("Result").toString('hex')}`);
        }

        // 4. Assemble and submit
        console.log("[Orchestrator] Assembling final deliverables seamlessly. Zero Human Action.");
        const finalDeliverable = results.join("\n");
        const finalHash = this.blockchain.hashDeliverable(finalDeliverable);
        
        console.log(`[Orchestrator] Submitting combined final-hash ${finalHash.toString('hex')} to master poster on job-registry.clar`);
        return finalHash;
    }
}
