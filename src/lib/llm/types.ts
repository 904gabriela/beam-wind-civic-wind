export type ChatRole = "system" | "user" | "assistant";

export type LlmMessage = { role: ChatRole; content: string };

export type LlmRequest = {
  provider: "xai" | "ollama" | "openai-compatible";
  model?: string;
  ollamaBaseUrl?: string;
  openaiBaseUrl?: string;
  openaiApiKey?: string;
  temperature?: number;
  topP?: number;
  topK?: number;
  repeatPenalty?: number;
  /** Reply length. Ollama: num_predict. Never used as the context window. */
  maxTokens?: number;
  /** Context window. Ollama: num_ctx. Separate from maxTokens. */
  numCtx?: number;
  messages: LlmMessage[];
  json?: boolean;
};

/** Ollama /api/chat options. num_ctx is the window; num_predict is the reply. */
export function ollamaChatOptions(req: LlmRequest): Record<string, number> {
  const num_predict = Math.min(req.maxTokens ?? 900, 2000);
  const num_ctx = Math.max(2048, Math.min(Math.round(req.numCtx ?? 8192), 131072));
  const options: Record<string, number> = {
    temperature: req.temperature ?? 0.85,
    top_p: req.topP ?? 0.95,
    num_predict,
    num_ctx,
  };
  if (req.topK && req.topK > 0) options.top_k = req.topK;
  if (req.repeatPenalty && req.repeatPenalty > 0) options.repeat_penalty = req.repeatPenalty;
  return options;
}
