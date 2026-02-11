import { useState } from "react";
import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
  getModelLabel: (modelId: string) => string;
}

export function MessageBubble({ message, getModelLabel }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const isUser = message.role === "user";

  return (
    <div className={`message-bubble ${isUser ? "user" : "assistant"}`}>
      <div className="message-header">
        <span className="message-role">
          {isUser ? "사용자" : getModelLabel(message.modelId)}
        </span>
        {!isUser && (
          <button
            type="button"
            className="copy-btn"
            onClick={handleCopy}
            title="복사"
          >
            {copied ? "복사됨" : "복사"}
          </button>
        )}
      </div>
      <div className="message-content">{message.content}</div>
      {message.usage && (
        <div className="message-usage">
          입력: {message.usage.input} 토큰 / 출력: {message.usage.output} 토큰
        </div>
      )}
    </div>
  );
}
