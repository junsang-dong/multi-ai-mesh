import type { ValidationResult } from "../../hooks/useAPIKeyValidation";

interface ValidationStatusProps {
  results: ValidationResult | null;
}

const LABELS: Record<keyof ValidationResult, string> = {
  openai: "OpenAI",
  google: "Google",
  anthropic: "Anthropic",
  perplexity: "Perplexity",
};

export function ValidationStatus({ results }: ValidationStatusProps) {
  if (!results) return null;

  const entries = Object.entries(results) as [keyof ValidationResult, { valid: boolean; error?: string }][];

  return (
    <div className="validation-status">
      {entries.map(([key, r]) => (
        <div key={key} className={`validation-item ${r.valid ? "valid" : "invalid"}`}>
          <span className="validation-icon">{r.valid ? "✓" : "✗"}</span>
          <span>{LABELS[key]}: {r.valid ? "유효함" : r.error ?? "오류"}</span>
        </div>
      ))}
    </div>
  );
}
