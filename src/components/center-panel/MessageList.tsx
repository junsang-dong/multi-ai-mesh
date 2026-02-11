import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "../../types";

interface MessageListProps {
  messages: Message[];
  getModelLabel: (modelId: string) => string;
}

export function MessageList({ messages, getModelLabel }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} getModelLabel={getModelLabel} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
