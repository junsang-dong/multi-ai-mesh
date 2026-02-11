import { CopyDownloadMenu } from "./CopyDownloadMenu";
import type { Message } from "../../types";

interface ChatHeaderProps {
  messages: Message[];
}

export function ChatHeader({ messages }: ChatHeaderProps) {
  return (
    <div className="chat-header">
      <h2 className="chat-title">대화</h2>
      <div className="chat-header-actions">
        <CopyDownloadMenu messages={messages} />
      </div>
    </div>
  );
}
