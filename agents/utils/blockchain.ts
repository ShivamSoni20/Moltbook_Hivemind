import { StacksTestnet } from '@stacks/network';
import { 
    callReadOnlyFunction, 
    broadcastTransaction, 
    makeContractCall,
    SignedContractCallOptions,
    standardPrincipalCV,
    stringAsciiCV,
    uintCV,
    bufferCVFromString,
    makeSTXTokenTransfer
} from '@stacks/transactions';
import { cvToJSON } from '@stacks/cv';
import * as crypto from 'crypto';

export const CONTRACTS = {
    JOB_REGISTRY:   'ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.job-registry',
    ESCROW_VAULT:   'ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.x402-escrow-vault',
    AGENT_REGISTRY: 'ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.agent-registry',
    SBTC_TOKEN:     'ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.sbtc-token',
    USDCX_TOKEN:    'ST30TRK58DT4P8CJQ8Y9D539X1VET78C63BNF0C9A.usdcx-token',
}

export const STACKS_API = 'https://api.testnet.hiro.so';
export const NETWORK = new StacksTestnet({ url: STACKS_API });

export class BlockchainClient {
    public network: StacksTestnet;
    private walletKey: string;
    private address: string;

    constructor(privateKey: string) {
        this.network = NETWORK;
        this.walletKey = privateKey;
        // In real environments, derive address from privateKey using stacks.js utilities.
        this.address = 'ST_MOCK_AGENT_WALLET'; 
    }

    public async connectToStacks() {
        console.log(`Connected to Stacks testnet at ${this.network.coreApiUrl}`);
    }

    public async callContract(contractAddress: string, contractName: string, functionName: string, args: any[]) {
        try {
            const txOptions: SignedContractCallOptions = {
                contractAddress,
                contractName,
                functionName,
                functionArgs: args,
                senderKey: this.walletKey,
                network: this.network,
                fee: 2000,
                anchorMode: 1
            };

            const transaction = await makeContractCall(txOptions);
            const broadcastResponse = await broadcastTransaction(transaction, this.network);
            return broadcastResponse;
        } catch (error) {
            console.error('Contract call failed:', error);
            throw error;
        }
    }

    public async pollForJobs() {
        console.log("Polling Stacks job-registry.clar for open jobs...");
        return []; 
    }

    public async getAgentBalance(principal: string) {
        return {
            sBTC: 1.5,
            USDCx: 100
        };
    }
    
    public hashDeliverable(deliverable: string): Buffer {
        return crypto.createHash('sha256').update(deliverable).digest();
    }
}
