export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  modelId: string;
  timestamp: number;
  usage?: { input: number; output: number };
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export interface ModelParameters {
  temperature: number;
  topP: number;
  maxTokens: number;
}

export interface APIKeys {
  openai?: string;
  google?: string;
  anthropic?: string;
  perplexity?: string;
}

export interface StoredData {
  userName: string;
  userEmail: string;
  apiKeys: APIKeys;
  conversations: Conversation[];
  modelParams: ModelParameters;
  systemPrompt: string;
}

export const DEFAULT_MODEL_PARAMS: ModelParameters = {
  temperature: 0.7,
  topP: 1,
  maxTokens: 4096,
};

export const STORAGE_KEY = "mai-edu-storage";

export type Provider = "openai" | "google" | "anthropic" | "perplexity";

export const MODEL_OPTIONS: Record<Provider, { id: string; label: string }[]> = {
  openai: [
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini" },
    { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
  ],
  google: [
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { id: "gemini-3-flash-preview", label: "Gemini 3 Flash" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
    { id: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
  ],
  perplexity: [
    { id: "sonar", label: "Sonar" },
    { id: "sonar-pro", label: "Sonar Pro" },
  ],
};
