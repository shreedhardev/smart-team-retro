import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from 'redis';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.connect().catch(console.error);

// Simple in-memory whiteboard state for illustration
let whiteboardState: any[] = [];

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    // Broadcast received message to all clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === 1) {
        client.send(msg);
      }
    });

    // Example: persist whiteboard state to Redis
    redisClient.set('whiteboard', msg.toString());
  });
});

app.get('/api/whiteboard', async (_req, res) => {
  const state = await redisClient.get('whiteboard');
  res.json({ state: state ? JSON.parse(state) : [] });
});

// Placeholder: AI-powered summary endpoint
app.post('/api/ai-summary', async (req, res) => {
  const { notes } = req.body;
  // TODO: Integrate OpenAI GPT-4 for summarization
  res.json({ summary: "AI summary would be here." });
});

server.listen(4000, () => {
  console.log('Backend running on port 4000');
});