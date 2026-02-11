import type { APIKeys } from "../../types";
import { MODEL_OPTIONS } from "../../types";

interface ModelSelectorProps {
  selectedModelId: string;
  onSelect: (modelId: string) => void;
  apiKeys: APIKeys;
  disabled?: boolean;
}

export function ModelSelector({
  selectedModelId,
  onSelect,
  apiKeys,
  disabled,
}: ModelSelectorProps) {
  const allOptions: { id: string; label: string; provider: string }[] = [];
  const providers = ["openai", "google", "anthropic", "perplexity"] as const;

  for (const p of providers) {
    const key = apiKeys[p];
    if (!key?.trim()) continue;
    const opts = MODEL_OPTIONS[p];
    for (const o of opts) {
      allOptions.push({ id: o.id, label: o.label, provider: p });
    }
  }

  if (allOptions.length === 0) {
    return (
      <div className="model-selector-empty">
        사용 가능한 API 키를 설정해주세요.
      </div>
    );
  }

  return (
    <div className="model-selector">
      <label htmlFor="model-select">AI 모델:</label>
      <select
        id="model-select"
        value={selectedModelId || allOptions[0]?.id}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
      >
        {allOptions.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
