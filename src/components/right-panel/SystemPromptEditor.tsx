import { useApp } from "../../context/AppContext";

export function SystemPromptEditor() {
  const { systemPrompt, setSystemPrompt } = useApp();

  return (
    <div className="system-prompt-editor">
      <h3 className="right-section-title">System instructions</h3>
      <p className="right-section-hint">
        AI의 기본적인 입출력 방식이나 내용을 지정합니다.
      </p>
      <textarea
        value={systemPrompt}
        onChange={(e) => setSystemPrompt(e.target.value)}
        placeholder="예: 너는 친절한 AI 어시스턴트입니다..."
        rows={6}
      />
    </div>
  );
}
