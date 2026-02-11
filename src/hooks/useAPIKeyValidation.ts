import { useState } from "react";
import type { APIKeys } from "../types";

export interface ValidationResult {
  openai?: { valid: boolean; error?: string };
  google?: { valid: boolean; error?: string };
  anthropic?: { valid: boolean; error?: string };
  perplexity?: { valid: boolean; error?: string };
}

async function validateOpenAI(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key?.trim()) return { valid: false, error: "키를 입력해주세요" };
  try {
    const res = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key.trim()}` },
    });
    if (res.ok) return { valid: true };
    const err = await res.json().catch(() => ({}));
    return { valid: false, error: err?.error?.message ?? `HTTP ${res.status}` };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

async function validateGoogle(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key?.trim()) return { valid: false, error: "키를 입력해주세요" };
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key.trim()}`
    );
    if (res.ok) return { valid: true };
    const err = await res.json().catch(() => ({}));
    return { valid: false, error: err?.error?.message ?? `HTTP ${res.status}` };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

async function validateAnthropic(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key?.trim()) return { valid: false, error: "키를 입력해주세요" };
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key.trim(),
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });
    if (res.ok || res.status === 200) return { valid: true };
    const err = await res.json().catch(() => ({}));
    return { valid: false, error: err?.error?.message ?? `HTTP ${res.status}` };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

async function validatePerplexity(key: string): Promise<{ valid: boolean; error?: string }> {
  if (!key?.trim()) return { valid: false, error: "키를 입력해주세요" };
  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key.trim()}`,
      },
      body: JSON.stringify({
        model: "sonar",
        max_tokens: 1,
        messages: [{ role: "user", content: "Hi" }],
      }),
    });
    if (res.ok || res.status === 200) return { valid: true };
    const err = await res.json().catch(() => ({}));
    return { valid: false, error: err?.error?.message ?? `HTTP ${res.status}` };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export function useAPIKeyValidation() {
  const [validating, setValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult | null>(null);

  const validate = async (keys: APIKeys): Promise<boolean> => {
    setValidating(true);
    setResults(null);

    const result: ValidationResult = {};
    const entries: (keyof APIKeys)[] = ["openai", "google", "anthropic", "perplexity"];

    for (const k of entries) {
      const key = keys[k];
      if (!key?.trim()) continue;
      if (k === "openai") result.openai = await validateOpenAI(key);
      else if (k === "google") result.google = await validateGoogle(key);
      else if (k === "anthropic") result.anthropic = await validateAnthropic(key);
      else if (k === "perplexity") result.perplexity = await validatePerplexity(key);
    }

    setResults(result);

    const allValid = Object.values(result).every((r) => r?.valid !== false);
    const hasAny = Object.keys(result).length > 0;
    const allPass = hasAny && allValid;

    setValidating(false);
    return allPass;
  };

  return { validate, validating, results };
}
