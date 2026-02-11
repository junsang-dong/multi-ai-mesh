import { useState } from "react";
import type { Message } from "../../types";
import { getModelLabel } from "../../utils/copyDownload";

interface CopyDownloadMenuProps {
  messages: Message[];
}

export function CopyDownloadMenu({ messages }: CopyDownloadMenuProps) {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    const text = messagesToMarkdown(messages);
    await navigator.clipboard.writeText(text);
    setOpen(false);
  };

  const handleMarkdown = () => {
    const text = messagesToMarkdown(messages);
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insightmesh-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handlePDF = async () => {
    const { exportToPDF } = await import("../../utils/copyDownload");
    await exportToPDF(messages);
    setOpen(false);
  };

  if (messages.length === 0) return null;

  return (
    <div className="copy-download-menu">
      <button
        type="button"
        className="menu-trigger"
        onClick={() => setOpen(!open)}
      >
        복사 및 다운로드 ▾
      </button>
      {open && (
        <>
          <div
            className="menu-backdrop"
            onClick={() => setOpen(false)}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          />
          <div className="menu-dropdown">
            <button type="button" onClick={handleCopy}>
              전체 복사
            </button>
            <button type="button" onClick={handleMarkdown}>
              마크다운 다운로드
            </button>
            <button type="button" onClick={handlePDF}>
              PDF 다운로드
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function messagesToMarkdown(messages: Message[]): string {
  return messages
    .map((m) => {
      const role = m.role === "user" ? "사용자" : getModelLabel(m.modelId);
      return `## ${role}\n\n${m.content}`;
    })
    .join("\n\n---\n\n");
}
