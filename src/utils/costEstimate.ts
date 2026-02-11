// 예상 비용 (참고용, 공개 가격표 기반 대략적 추정)
// 가격: USD per 1M tokens (input, output)
const PRICES: Record<string, [number, number]> = {
  "gpt-4o": [2.5, 10],
  "gpt-4o-mini": [0.15, 0.6],
  "gpt-4-turbo": [10, 30],
  "gemini-2.5-pro": [1.25, 5],
  "gemini-2.5-flash": [0.075, 0.3],
  "gemini-2.0-flash": [0.1, 0.4],
  "gemini-3-flash-preview": [0.15, 0.6],
  "claude-3-5-sonnet-20241022": [3, 15],
  "claude-3-haiku-20240307": [0.25, 1.25],
  sonar: [0.2, 1],
  "sonar-pro": [1, 5],
};

export function estimateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): number {
  const [inPrice, outPrice] = PRICES[modelId] ?? [0.5, 2];
  const inCost = (inputTokens / 1_000_000) * inPrice;
  const outCost = (outputTokens / 1_000_000) * outPrice;
  return inCost + outCost;
}
