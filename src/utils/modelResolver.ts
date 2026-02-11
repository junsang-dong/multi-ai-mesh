import type { Provider } from "../types";
import { MODEL_OPTIONS } from "../types";

export function getProviderFromModelId(modelId: string): Provider | null {
  for (const [provider, options] of Object.entries(MODEL_OPTIONS)) {
    if (options.some((o) => o.id === modelId)) return provider as Provider;
  }
  return null;
}
