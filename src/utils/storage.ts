import type { StoredData } from "../types";
import { DEFAULT_MODEL_PARAMS, STORAGE_KEY } from "../types";

export function loadStoredData(): StoredData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredData;
    if (!data.conversations) data.conversations = [];
    if (!data.modelParams)
      data.modelParams = { ...DEFAULT_MODEL_PARAMS };
    if (data.systemPrompt == null) data.systemPrompt = "";
    return data;
  } catch {
    return null;
  }
}

export function saveStoredData(data: Partial<StoredData>): void {
  const existing = loadStoredData();
  const merged: StoredData = {
    userName: data.userName ?? existing?.userName ?? "",
    userEmail: data.userEmail ?? existing?.userEmail ?? "",
    apiKeys: data.apiKeys ?? existing?.apiKeys ?? {},
    conversations: data.conversations ?? existing?.conversations ?? [],
    modelParams: data.modelParams ?? existing?.modelParams ?? { ...DEFAULT_MODEL_PARAMS },
    systemPrompt: data.systemPrompt ?? existing?.systemPrompt ?? "",
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}

export function hasValidKeys(apiKeys: StoredData["apiKeys"]): boolean {
  return !!(
    (apiKeys.openai && apiKeys.openai.trim()) ||
    (apiKeys.google && apiKeys.google.trim()) ||
    (apiKeys.anthropic && apiKeys.anthropic.trim()) ||
    (apiKeys.perplexity && apiKeys.perplexity.trim())
  );
}
