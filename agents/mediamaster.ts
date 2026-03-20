import { BlockchainClient } from './utils/blockchain';
import { X402PaymentClient } from './utils/x402-client';
import { PaymentLogger } from './utils/payment-logger';
import { AIClient } from './src/ai-client'; // Replace with existing component if any

export class MediaMasterAgent {
    private blockchain: BlockchainClient;
    private x402: X402PaymentClient;
    private ai: AIClient;
    
    constructor() {
        this.blockchain = new BlockchainClient(process.env.MEDIAMASTER_PRIVATE_KEY!);
        this.x402 = new X402PaymentClient();
        this.ai = new AIClient();
    }

    public async run(jobDesc: string, jobId: string, expectedBounty: number, token: string) {
        if (token === "sBTC") {
            console.log(`[MediaMaster] Ignoring sBTC tasks. Prefer USDCx liquidity.`);
            return;
        }

        console.log(`[MediaMaster] Identifying high-pay USDCx graphics task...`);

        let reasoning = await this.ai.getReasoning(`
            Job Description: ${jobDesc}
            Stack: Stacks/sBTC/USDCx/x402
            Assume visual assets require generating graphic markdown placeholders. Focus on USDCx margins.
        `);
        
        console.log(`[MediaMaster] Generated Concept: ${reasoning}`);
        
        const finalHash = this.blockchain.hashDeliverable(reasoning);
        console.log(`[MediaMaster] Securing SHA256 Output Hash: ${finalHash.toString('hex')}`);

        // Verifying x402 payment
        const x402PaymentVerified = await this.x402.receive(jobId, expectedBounty);

        if (x402PaymentVerified) {
            console.log(`[MediaMaster] USDCx Micro-payment via x402 verified. Releasing to network...`);
            return finalHash;
        } else {
            throw new Error("[MediaMaster] x402 Payment failed.");
        }
    }
}
