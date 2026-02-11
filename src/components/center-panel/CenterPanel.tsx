import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAIChat } from "../../hooks/useAIChat";
import { MODEL_OPTIONS } from "../../types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ModelSelector } from "./ModelSelector";
import { ChatInput } from "./ChatInput";
import { TokenSummary } from "./TokenSummary";

function getDefaultModelId(apiKeys: ReturnType<typeof useApp>["apiKeys"]): string {
  if (apiKeys.openai?.trim()) return MODEL_OPTIONS.openai[0].id;
  if (apiKeys.google?.trim()) return MODEL_OPTIONS.google[0].id;
  if (apiKeys.anthropic?.trim()) return MODEL_OPTIONS.anthropic[0].id;
  if (apiKeys.perplexity?.trim()) return MODEL_OPTIONS.perplexity[0].id;
  return "";
}

export function CenterPanel() {
  const { conversationId } = useParams<{ conversationId?: string }>();
  const { getConversation, apiKeys, modelParams } = useApp();
  const { sendMessage, loading, error, getModelLabel } = useAIChat(conversationId ?? null);
  const [selectedModelId, setSelectedModelId] = useState("");

  useEffect(() => {
    if (!selectedModelId) setSelectedModelId(getDefaultModelId(apiKeys));
  }, [apiKeys, selectedModelId]);

  const conv = conversationId ? getConversation(conversationId) : null;
  const messages = conv?.messages ?? [];

  if (!conversationId || !conv) {
    return (
      <div className="center-panel">
        <div className="center-placeholder">
          대화를 시작하려면 왼쪽에서 "새 대화"를 클릭하세요.
        </div>
      </div>
    );
  }

  const handleSend = (content: string) => {
    if (!selectedModelId) return;
    sendMessage(content, selectedModelId);
  };

  return (
    <div className="center-panel">
      <ChatHeader messages={messages} />
      <div className="chat-body">
        <MessageList messages={messages} getModelLabel={getModelLabel} />
      </div>
      <div className="chat-footer">
        <ModelSelector
          selectedModelId={selectedModelId}
          onSelect={setSelectedModelId}
          apiKeys={apiKeys}
          disabled={loading}
        />
        <ChatInput onSend={handleSend} disabled={loading} />
        {error && <div className="chat-error">{error}</div>}
        <TokenSummary modelParams={modelParams} messages={messages} />
      </div>
    </div>
  );
}
