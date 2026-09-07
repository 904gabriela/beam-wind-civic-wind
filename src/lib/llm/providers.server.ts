import { ollamaChatOptions, type LlmRequest } from "./types";

export type ProviderResult =
  | { ok: true; stream: ReadableStream<Uint8Array> }
  | { ok: true; text: string }
  | { ok: false; error: string; status?: number };

function friendlyError(status: number, provider: string): string {
  if (status === 401 || status === 403) return "The model provider rejected the request.";
  if (status === 404) return "That model was not found.";
  if (status === 429) return "The model is busy. Try again in a moment.";
  if (status >= 500) return `${provider} is unavailable right now.`;
  return "The story stalled. Try again.";
}

export async function runProvider(req: LlmRequest, stream: boolean): Promise<ProviderResult> {
  const temperature = req.temperature ?? 0.85;
  const maxTokens = Math.min(req.maxTokens ?? 900, 2000);
  const topP = req.topP ?? 0.95;

  if (req.provider === "ollama") {
    return runOllama(req, { temperature, maxTokens, topP, stream });
  }

  const isXai = req.provider === "xai";
  const apiKey = isXai ? process.env.XAI_API_KEY : req.openaiApiKey;
  const baseUrl = isXai
    ? "https://api.x.ai/v1"
    : (req.openaiBaseUrl || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = req.model || (isXai ? "grok-4.5" : "gpt-4o-mini");
  const label = isXai ? "xAI" : "OpenAI-compatible";

  if (!apiKey) {
    return {
      ok: false,
      error: isXai
        ? "Storytelling is unavailable right now."
        : "Add an API key in Settings to use this provider.",
    };
  }

  const body: Record<string, unknown> = {
    model,
    temperature,
    top_p: topP,
    max_tokens: maxTokens,
    messages: req.messages,
    stream,
  };
  if (req.json) body.response_format = { type: "json_object" };

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return { ok: false, error: friendlyError(res.status, label), status: res.status };
  }

  if (stream) {
    if (!res.body) return { ok: false, error: "No stream from provider." };
    return { ok: true, stream: res.body };
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = json.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) return { ok: false, error: "Silence from the other side. Try again." };
  return { ok: true, text };
}

async function runOllama(
  req: LlmRequest,
  opts: { temperature: number; maxTokens: number; topP: number; stream: boolean },
): Promise<ProviderResult> {
  const base = (req.ollamaBaseUrl || "http://127.0.0.1:11434").replace(/\/$/, "");
  const model = req.model || req.ollamaBaseUrl || "llama3.1";
  try {
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: req.model || "llama3.1",
        stream: opts.stream,
        format: req.json ? "json" : undefined,
        options: ollamaChatOptions(req),
        messages: req.messages,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: friendlyError(res.status, "Ollama"), status: res.status };
    }
    if (opts.stream) {
      if (!res.body) return { ok: false, error: "Ollama returned no stream." };
      return { ok: true, stream: mapOllamaStream(res.body) };
    }
    const json = (await res.json()) as { message?: { content?: string } };
    const text = json.message?.content?.trim() ?? "";
    if (!text) return { ok: false, error: "Ollama returned an empty reply." };
    return { ok: true, text };
  } catch {
    return {
      ok: false,
      error: `Cannot reach Ollama at ${base}. Start Ollama or switch provider in Settings.`,
    };
  }
}

function mapOllamaStream(source: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buf = "";
  return new ReadableStream({
    async start(controller) {
      const reader = source.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line) as {
                message?: { content?: string };
                done?: boolean;
              };
              const piece = json.message?.content ?? "";
              if (piece) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: piece } }] })}\n\n`),
                );
              }
              if (json.done) {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            } catch {
              /* ignore bad chunks */
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}

export async function listOllamaModels(baseUrl: string): Promise<string[]> {
  const base = baseUrl.replace(/\/$/, "");
  const res = await fetch(`${base}/api/tags`);
  if (!res.ok) throw new Error("Ollama did not list models.");
  const json = (await res.json()) as { models?: { name?: string }[] };
  return (json.models ?? []).map((m) => m.name).filter((n): n is string => !!n);
}
