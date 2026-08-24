"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_vite = require("vite");
import_dotenv.default.config();
var aiClient = null;
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({ apiKey });
  }
  return aiClient;
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "English Kids" });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      const ai = getGenAI();
      if (!ai) {
        const lower = message.toLowerCase();
        let reply = "Hello little champion! I love talking with you! Keep practicing your English every day! [IMAGE: star]";
        if (lower.includes("animal") || lower.includes("cat") || lower.includes("dog") || lower.includes("lion")) {
          reply = "Animals are amazing friends! Cats say meow and lions say roar! What is your favorite animal? [IMAGE: lion]";
        } else if (lower.includes("color") || lower.includes("red") || lower.includes("blue")) {
          reply = "Colors make our world so bright and colorful! Red is like a juicy apple and blue is like the sky! [IMAGE: rainbow]";
        } else if (lower.includes("number") || lower.includes("count")) {
          reply = "Let's count together: One, Two, Three! You are super smart at numbers! [IMAGE: number]";
        } else if (lower.includes("story") || lower.includes("tell")) {
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
        model: "gemini-2.5-flash",
        contents: prompt
      });
      const text = response.text || "You are doing great learning English today! [IMAGE: star]";
      return res.json({ response: text });
    } catch (error) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: "Unable to reach AI Friend",
        details: error?.message || "Server error",
        fallback: "Hello sweet friend! You are doing amazing learning English today! Keep smiling! [IMAGE: smile]"
      });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`English Kids server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
