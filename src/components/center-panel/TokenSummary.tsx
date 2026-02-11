import type { ModelParameters } from "../../types";
import type { Message } from "../../types";
import { estimateCost } from "../../utils/costEstimate";

interface TokenSummaryProps {
  modelParams: ModelParameters;
  messages: Message[];
}

export function TokenSummary({ modelParams, messages }: TokenSummaryProps) {
  const totalInput = messages.reduce((s, m) => s + (m.usage?.input ?? 0), 0);
  const totalOutput = messages.reduce((s, m) => s + (m.usage?.output ?? 0), 0);

  let totalCostUsd = 0;
  for (const m of messages) {
    if (m.role === "assistant" && m.usage) {
      totalCostUsd += estimateCost(m.modelId, m.usage.input, m.usage.output);
    }
  }

  return (
    <div className="token-summary">
      <span>temp: {modelParams.temperature}</span>
      <span>top_p: {modelParams.topP}</span>
      <span>max_tokens: {modelParams.maxTokens}</span>
      <span>입력 토큰: {totalInput}</span>
      <span>출력 토큰: {totalOutput}</span>
      <span>예상 비용: ${totalCostUsd.toFixed(4)}</span>
    </div>
  );
}
