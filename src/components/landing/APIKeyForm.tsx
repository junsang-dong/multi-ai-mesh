import type { ChangeEvent } from "react";
import type { APIKeys } from "../../types";

interface APIKeyFormProps {
  apiKeys: APIKeys;
  onKeysChange: (keys: APIKeys) => void;
}

const FIELDS: { key: keyof APIKeys; label: string; placeholder: string }[] = [
  { key: "openai", label: "OpenAI (GPT)", placeholder: "sk-..." },
  { key: "google", label: "Google (Gemini)", placeholder: "AIza..." },
  { key: "anthropic", label: "Anthropic (Claude)", placeholder: "sk-ant-..." },
  { key: "perplexity", label: "Perplexity", placeholder: "pplx-..." },
];

export function APIKeyForm({ apiKeys, onKeysChange }: APIKeyFormProps) {
  const handleChange = (k: keyof APIKeys, value: string) => {
    onKeysChange({ ...apiKeys, [k]: value });
  };

  return (
    <div className="landing-section">
      <h2>API 키</h2>
      <p className="landing-hint">최소 하나 이상의 API 키를 입력해주세요.</p>
      {FIELDS.map(({ key, label, placeholder }) => (
        <div key={key} className="form-group">
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            type="password"
            placeholder={placeholder}
            value={apiKeys[key] ?? ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value)}
            autoComplete="off"
          />
        </div>
      ))}
    </div>
  );
}
