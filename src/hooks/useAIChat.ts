import { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import { sendChatMessage } from "../services/aiChat";
import type { Message } from "../types";
import { MODEL_OPTIONS } from "../types";

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getModelLabel(modelId: string): string {
  for (const options of Object.values(MODEL_OPTIONS)) {
    const found = options.find((o) => o.id === modelId);
    if (found) return found.label;
  }
  return modelId;
}

export function useAIChat(conversationId: string | null) {
  const {
    getConversation,
    updateConversation,
    apiKeys,
    modelParams,
    systemPrompt,
  } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (userContent: string, modelId: string) => {
      if (!conversationId || !userContent.trim()) return;

      const conv = getConversation(conversationId);
      if (!conv) return;

      setLoading(true);
      setError(null);

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content: userContent.trim(),
        modelId,
        timestamp: Date.now(),
      };

      const prevMessages = conv.messages;
      const updatedMessages = [...prevMessages, userMsg];
      updateConversation(conversationId, { messages: updatedMessages });

      if (conv.messages.length === 0 && !conv.title) {
        const title =
          userContent.trim().slice(0, 50) +
          (userContent.trim().length > 50 ? "..." : "");
        updateConversation(conversationId, { title });
      }

      const apiMessages = [...prevMessages, userMsg].map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

      try {
        const res = await sendChatMessage(
          {
            messages: apiMessages,
            modelId,
            params: modelParams,
            apiKeys,
          },
          systemPrompt
        );

        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: res.content,
          modelId,
          timestamp: Date.now(),
          usage: res.usage,
        };

        updateConversation(conversationId, {
          messages: [...updatedMessages, assistantMsg],
        });
      } catch (e) {
        setError((e as Error).message);
        const errMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: `오류: ${(e as Error).message}`,
          modelId,
          timestamp: Date.now(),
        };
        updateConversation(conversationId, {
          messages: [...updatedMessages, errMsg],
        });
      } finally {
        setLoading(false);
      }
    },
    [
      conversationId,
      getConversation,
      updateConversation,
      apiKeys,
      modelParams,
      systemPrompt,
    ]
  );

  return { sendMessage, loading, error, getModelLabel };
}
