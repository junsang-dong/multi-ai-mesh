import type { ModelParameters } from "../types";
import { getProviderFromModelId } from "../utils/modelResolver";
import type { APIKeys } from "../types";

export interface ChatRequest {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  modelId: string;
  params: ModelParameters;
  apiKeys: APIKeys;
}

export interface ChatResponse {
  content: string;
  usage?: { input: number; output: number };
}

function convertToOpenAIMessages(
  messages: ChatRequest["messages"],
  systemPrompt: string
): { role: "user" | "assistant" | "system"; content: string }[] {
  const out: { role: "user" | "assistant" | "system"; content: string }[] = [];
  if (systemPrompt?.trim()) {
    out.push({ role: "system", content: systemPrompt });
  }
  for (const m of messages) {
    if (m.role === "system") continue;
    out.push({ role: m.role, content: m.content });
  }
  return out;
}

async function callOpenAI(
  req: ChatRequest,
  systemPrompt: string
): Promise<ChatResponse> {
  const key = req.apiKeys.openai?.trim();
  if (!key) throw new Error("OpenAI API 키가 없습니다.");

  const body = {
    model: req.modelId,
    messages: convertToOpenAIMessages(req.messages, systemPrompt),
    temperature: req.params.temperature,
    max_tokens: req.params.maxTokens,
    ...(req.params.topP < 1 && { top_p: req.params.topP }),
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const usage = data.usage
    ? { input: data.usage.prompt_tokens, output: data.usage.completion_tokens }
    : undefined;

  return { content, usage };
}

async function callGemini(
  req: ChatRequest,
  systemPrompt: string
): Promise<ChatResponse> {
  const key = req.apiKeys.google?.trim();
  if (!key) throw new Error("Google API 키가 없습니다.");

  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const m of req.messages) {
    if (m.role === "system") continue;
    const role = m.role === "user" ? "user" : "model";
    contents.push({ role, parts: [{ text: m.content }] });
  }

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: req.params.temperature,
      topP: req.params.topP,
      maxOutputTokens: req.params.maxTokens,
    },
  };
  if (systemPrompt?.trim()) {
    (body as Record<string, unknown>).systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${req.modelId}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "";
  const um = data.usageMetadata;
  const usage = um
    ? {
        input: um.promptTokenCount ?? 0,
        output: um.candidatesTokenCount ?? (um.totalTokenCount ?? 0) - (um.promptTokenCount ?? 0),
      }
    : undefined;

  return { content: text, usage };
}

async function callAnthropic(
  req: ChatRequest,
  systemPrompt: string
): Promise<ChatResponse> {
  const key = req.apiKeys.anthropic?.trim();
  if (!key) throw new Error("Anthropic API 키가 없습니다.");

  const system = systemPrompt?.trim() || undefined;
  const msgs = req.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const body: Record<string, unknown> = {
    model: req.modelId,
    max_tokens: req.params.maxTokens,
    messages: msgs,
    temperature: req.params.temperature,
    ...(system && { system: system }),
  };
  if (req.params.topP < 1) (body as Record<string, unknown>).top_p = req.params.topP;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content =
    data.content?.find((c: { type: string }) => c.type === "text")?.text ?? "";
  const usage = data.usage
    ? { input: data.usage.input_tokens, output: data.usage.output_tokens }
    : undefined;

  return { content, usage };
}

async function callPerplexity(
  req: ChatRequest,
  systemPrompt: string
): Promise<ChatResponse> {
  const key = req.apiKeys.perplexity?.trim();
  if (!key) throw new Error("Perplexity API 키가 없습니다.");

  const messages = convertToOpenAIMessages(req.messages, systemPrompt);

  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: req.modelId,
      messages,
      temperature: req.params.temperature,
      max_tokens: req.params.maxTokens,
      ...(req.params.topP < 1 && { top_p: req.params.topP }),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const usage = data.usage
    ? { input: data.usage.prompt_tokens, output: data.usage.completion_tokens }
    : undefined;

  return { content, usage };
}

export async function sendChatMessage(
  req: ChatRequest,
  systemPrompt: string
): Promise<ChatResponse> {
  const provider = getProviderFromModelId(req.modelId);
  if (!provider) throw new Error(`알 수 없는 모델: ${req.modelId}`);

  if (provider === "openai") return callOpenAI(req, systemPrompt);
  if (provider === "google") return callGemini(req, systemPrompt);
  if (provider === "anthropic") return callAnthropic(req, systemPrompt);
  if (provider === "perplexity") return callPerplexity(req, systemPrompt);

  throw new Error(`지원하지 않는 제공자: ${provider}`);
}
