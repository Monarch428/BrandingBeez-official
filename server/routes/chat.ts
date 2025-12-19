// server/routes/chat.ts
import type { Express } from "express";
import { storage } from "../storage";
import { generateAIResponse } from "../openai";
import { sendContactNotification } from "../email-service";

export function registerChatRoutes(app: Express) {
  app.get("/api/chat/sessions/:sessionId", async (req, res) => {
    const { sessionId } = req.params;
    let session = await storage.getChatSession(sessionId);

    if (!session) {
      const newSession = await storage.createChatSession({ sessionId, clientInfo: {} });
      return res.json({ success: true, session: newSession });
    }

    res.json({ success: true, session });
  });

  app.post("/api/chat/analyze", async (req, res) => {
    const { fileData, sessionId, clientInfo } = req.body;

    if (!fileData?.content) {
      return res.status(400).json({ success: false, message: "No file data provided" });
    }

    const analysis = await generateAIResponse(`Please analyze this document: ${fileData.content}`, sessionId || "");

    let chatSession = sessionId ? await storage.getChatSession(sessionId) : null;
    if (!chatSession) {
      const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      chatSession = await storage.createChatSession({ sessionId: newSessionId, clientInfo: clientInfo || {} });
    }

    const existingMessages = Array.isArray(chatSession.messages) ? chatSession.messages : [];
    const analysisMessage = {
      id: Date.now(),
      type: "analysis" as const,
      content: `📄 **Document Analysis: ${fileData.fileName}**\n\n${analysis.content}`,
      recommendations: analysis.recommendations || [],
      timestamp: new Date(),
      documentAnalysis: analysis,
    };

    const updatedMessages = [...existingMessages, analysisMessage];
    await storage.updateChatSession(chatSession.sessionId, updatedMessages, analysis.recommendations || []);

    if (clientInfo?.leadInfo?.email && clientInfo?.leadInfo?.name) {
      try {
        await sendContactNotification({
          name: clientInfo.leadInfo.name,
          email: clientInfo.leadInfo.email,
          company: clientInfo.company || undefined,
          phone: undefined,
          message: `DOCUMENT ANALYSIS REQUEST: ${fileData.fileName} (${fileData.type}). Analysis completed with ${
            analysis.recommendations?.length || 0
          } recommendations.`,
          submittedAt: new Date(),
        });
      } catch {}
    }

    res.json({ success: true, analysis, session: chatSession, message: analysisMessage });
  });

  app.post("/api/chat", async (req, res) => {
    const { message, sessionId, clientInfo } = req.body;

    let chatSession = sessionId ? await storage.getChatSession(sessionId) : null;
    if (!chatSession) {
      const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      chatSession = await storage.createChatSession({ sessionId: newSessionId, clientInfo: clientInfo || {} });
    }

    const contextWithLeadInfo = { ...chatSession, leadInfo: clientInfo?.leadInfo || {}, messages: chatSession.messages || [] };
    const aiResponse = await generateAIResponse(message, contextWithLeadInfo);

    const existingMessages = Array.isArray(chatSession.messages) ? chatSession.messages : [];
    const updatedMessages = [
      ...existingMessages,
      { id: Date.now(), type: "user" as const, content: message, timestamp: new Date() },
      { id: Date.now() + 1, type: "bot" as const, content: aiResponse.content, recommendations: aiResponse.recommendations, timestamp: new Date() },
    ];

    const updatedSession = await storage.updateChatSession(chatSession.sessionId, updatedMessages, aiResponse.recommendations);

    res.json({ success: true, session: updatedSession, response: aiResponse });
  });
}
