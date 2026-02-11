import { useState, useEffect } from "react";
import type { APIKeys } from "../../types";
import { useApp } from "../../context/AppContext";

interface APISettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const FIELDS: { key: keyof APIKeys; label: string }[] = [
  { key: "openai", label: "OpenAI (GPT)" },
  { key: "google", label: "Google (Gemini)" },
  { key: "anthropic", label: "Anthropic (Claude)" },
  { key: "perplexity", label: "Perplexity" },
];

export function APISettingsModal({ open, onClose }: APISettingsModalProps) {
  const { apiKeys, setApiKeys } = useApp();
  const [localKeys, setLocalKeys] = useState<APIKeys>({});

  useEffect(() => {
    if (open) setLocalKeys({ ...apiKeys });
  }, [open, apiKeys]);

  const handleChange = (k: keyof APIKeys, value: string) => {
    setLocalKeys((prev) => ({ ...prev, [k]: value }));
  };

  const handleSave = () => {
    setApiKeys(localKeys);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>API 설정</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label}</label>
              <input
                type="password"
                value={localKeys[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder="API 키 입력"
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
