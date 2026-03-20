import Database from 'better-sqlite3';
import { WebSocketServer, WebSocket } from 'ws';

const db = new Database('./payments.sqlite', { verbose: console.log });

db.exec(`
    CREATE TABLE IF NOT EXISTS x402_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        from_agent TEXT,
        to_agent TEXT,
        amount REAL,
        token TEXT,
        job_id TEXT,
        tx_hash TEXT
    )
`);

export class PaymentLogger {
    private wss: WebSocketServer;

    constructor() {
        this.wss = new WebSocketServer({ port: 8080 });
        console.log("📡 WebSocket Server listening for Payment Waterfall on ws://localhost:8080");

        this.wss.on('connection', (ws) => {
            console.log("🟢 Client connected to Payment WebSocket");
            // Optionally, send recent payments on connect if needed
        });
    }

    public emitToFrontend(payment: any) {
        console.log("📡 Broadcasting x402 payment:", payment);
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(payment));
            }
        });
    }

    public logPayment(from: string, to: string, amount: number, token: string, jobId: string, txHash: string) {
        const timestamp = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO x402_payments (timestamp, from_agent, to_agent, amount, token, job_id, tx_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(timestamp, from, to, amount, token, jobId, txHash);
        
        this.emitToFrontend({
            type: "payment",
            from: from,
            to: to,
            amount,
            token,
            jobId,
            txHash,
            timestamp: Date.now()
        });
    }

    public getRecentPayments() {
        const stmt = db.prepare(`SELECT * FROM x402_payments ORDER BY id DESC LIMIT 50`);
        return stmt.all();
    }
}
