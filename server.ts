import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'English Kids' });
  });

  // AI Friend Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getGenAI();

      if (!ai) {
        // Safe interactive fallback responses if GEMINI_API_KEY is not yet supplied
        const lower = message.toLowerCase();
        let reply = "Hello little champion! I love talking with you! Keep practicing your English every day! [IMAGE: star]";
        if (lower.includes('animal') || lower.includes('cat') || lower.includes('dog') || lower.includes('lion')) {
          reply = "Animals are amazing friends! Cats say meow and lions say roar! What is your favorite animal? [IMAGE: lion]";
        } else if (lower.includes('color') || lower.includes('red') || lower.includes('blue')) {
          reply = "Colors make our world so bright and colorful! Red is like a juicy apple and blue is like the sky! [IMAGE: rainbow]";
        } else if (lower.includes('number') || lower.includes('count')) {
          reply = "Let's count together: One, Two, Three! You are super smart at numbers! [IMAGE: number]";
        } else if (lower.includes('story') || lower.includes('tell')) {
          reply = "Once upon a time, a little friendly bunny hopped into a sunny garden and made lots of new friends! [IMAGE: rabbit]";
        }
        return res.json({ response: reply });
      }

      const prompt = `You are a warm, cheerful, and encouraging AI English teacher for young children (ages 3-8).
Rules:
1. Always respond in clear, simple English in 2 to 4 short sentences.
2. If the child writes in Arabic, respond in encouraging simple English with an Arabic friendly subtitle in parentheses if helpful.
3. Be enthusiastic, friendly, and kind!
4. Always end your message with [IMAGE: keyword] where keyword is a single simple concrete noun in English representing the topic (e.g. [IMAGE: elephant], [IMAGE: butterfly], [IMAGE: apple]).

User message: ${message}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || "You are doing great learning English today! [IMAGE: star]";
      return res.json({ response: text });
    } catch (error: any) {
      console.error('Gemini API error:', error);
      return res.status(500).json({
        error: 'Unable to reach AI Friend',
        details: error?.message || 'Server error',
        fallback: "Hello sweet friend! You are doing amazing learning English today! Keep smiling! [IMAGE: smile]"
      });
    }
  });

  // Vite development middleware vs production static files
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`English Kids server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
