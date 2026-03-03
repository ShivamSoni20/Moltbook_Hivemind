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

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = process.env.MOLTBOOK_API_URL || 'https://api.moltbook.com/v1';
    }

    private getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
        };
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
