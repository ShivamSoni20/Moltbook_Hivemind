import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export interface MoltbookPost {
    id?: string;
    body: string;
    submoltId?: string;
    parentId?: string;
}

export class MoltbookClient {
    private apiKey: string;
    private baseUrl: string;
    private aiClient: any;

    constructor(apiKey: string, aiClient?: any) {
        this.apiKey = apiKey;
        this.aiClient = aiClient;
        this.baseUrl = process.env.MOLTBOOK_API_URL || 'https://api.moltbook.com/v1';
    }

    private getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
    }

    /**
     * Solves the lobster-themed math challenge using AI
     */
    private async solveChallenge(challenge: string): Promise<string> {
        if (!this.aiClient) throw new Error("AI Client required to solve Moltbook challenges");

        const prompt = `Solve this obfuscated math problem. Respond ONLY with the numeric answer (e.g., '15.00'). 
        The problem contains two numbers and an operation (+, -, *, /) hidden in symbols and alternating caps.
        
        Challenge: "${challenge}"`;

        const answer = await this.aiClient.chat([{ role: 'user', content: prompt }], "You are a math solver for AI verification challenges. You extract hidden math problems from obfuscated text.");
        return answer.trim().replace(/[^0-9.-]/g, '');
    }

    /**
     * Submits the solution to a verification challenge
     */
    private async verify(code: string, answer: string): Promise<void> {
        await axios.post(`${this.baseUrl}/verify`, {
            verification_code: code,
            answer: parseFloat(answer).toFixed(2)
        }, {
            headers: this.getHeaders()
        });
        console.log(`✅ Verification challenge passed! Answer: ${answer}`);
    }

    /**
     * Post an update to a specific submolt
     */
    async postToSubmolt(submoltId: string, content: string): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/posts`, {
                body: content,
                submoltId: submoltId
            }, {
                headers: this.getHeaders()
            });

            if (response.data.verification_required) {
                console.log(`🧠 AI Verification Required. Solving challenge...`);
                const answer = await this.solveChallenge(response.data.post.verification.challenge_text);
                await this.verify(response.data.post.verification.verification_code, answer);
            }

            console.log(`✅ Post successful to submolt ${submoltId}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Moltbook Post Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Comment on an existing post
     */
    async addComment(postId: string, content: string): Promise<any> {
        try {
            const response = await axios.post(`${this.baseUrl}/posts`, {
                body: content,
                parentId: postId
            }, {
                headers: this.getHeaders()
            });

            console.log(`✅ Comment added to post ${postId}`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Moltbook Comment Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Update agent profile description
     */
    async updateProfile(description: string): Promise<any> {
        try {
            const response = await axios.patch(`${this.baseUrl}/agents/me`, {
                description: description
            }, {
                headers: this.getHeaders()
            });

            console.log(`✅ Profile updated successfully`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Moltbook Profile Update Error:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Register a new agent (Note: Usually requires subsequent manual verification/key retrieval)
     */
    static async registerAgent(name: string, description: string): Promise<any> {
        const baseUrl = process.env.MOLTBOOK_API_URL || 'https://api.moltbook.com/v1';
        try {
            const response = await axios.post(`${baseUrl}/agents/register`, {
                name,
                description
            });
            console.log(`✅ Agent ${name} registered on Moltbook!`);
            return response.data;
        } catch (error: any) {
            console.error('❌ Moltbook Registration Error:', error.response?.data || error.message);
            throw error;
        }
    }
}
