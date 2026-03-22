import { Router } from "express";
import OpenAI from "openai";

const router = Router();

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

const MAX_MESSAGES = 20;
const MAX_MSG_LENGTH = 2000;
const MAX_CONTEXT_LENGTH = 5000;
const ALLOWED_ROLES = new Set(["user", "assistant"]);

router.post("/ai/chat", async (req, res) => {
  try {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages array required" });
      return;
    }

    if (messages.length > MAX_MESSAGES) {
      res.status(400).json({ error: "Too many messages" });
      return;
    }

    const sanitized = [];
    for (const m of messages) {
      if (!m || typeof m.content !== "string" || !ALLOWED_ROLES.has(m.role)) {
        res.status(400).json({ error: "Invalid message format" });
        return;
      }
      sanitized.push({ role: m.role, content: m.content.slice(0, MAX_MSG_LENGTH) });
    }

    const ctx = typeof userContext === "string" ? userContext.slice(0, MAX_CONTEXT_LENGTH) : "";

    const systemPrompt = `You are the FlipiQ AI Assistant — an expert CSM coaching tool built into the FlipiQ dashboard. You help CSM Lead Ramy analyze Acquisition Associates (AAs) and provide actionable coaching advice.

CONTEXT ABOUT THIS AA:
${ctx || "No context provided."}

RULES:
- Be concise and actionable. Ramy is busy — give direct answers.
- Use the AA's actual data when answering questions.
- Focus on what matters: calls, offers, deals, feature usage, and health.
- When suggesting actions, be specific: "Call them about X" not "reach out".
- Reference specific numbers from their data.
- Use plain language, no jargon. Keep responses under 150 words unless asked for detail.
- Health colors: red=Critical, orange=Gap, yellow=Cooling, green=Healthy.
- Phase: P1=Onboarding (D1-7), P2=Activation (D8-21), P3=Performance (D22+).
- Target: 2 deals/month per AA.
- 3-Strike rule: After 3 unanswered emails, escalate to the Account Manager.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitized,
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "No response generated.";
    res.json({ reply });
  } catch (err: any) {
    console.error("AI chat error:", err?.message || err);
    res.status(500).json({ error: "AI service error" });
  }
});

export default router;
