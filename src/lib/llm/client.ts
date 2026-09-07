import type { LlmRequest } from "./types";

export async function streamLlm(
  request: LlmRequest,
  onDelta: (text: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    signal,
  });
  if (!res.ok) {
    let message = "Generation failed.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  if (!res.body) throw new Error("No response stream.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const json = JSON.parse(data) as {
          error?: string;
          choices?: { delta?: { content?: string } }[];
        };
        if (json.error) throw new Error(json.error);
        const piece = json.choices?.[0]?.delta?.content ?? "";
        if (piece) {
          full += piece;
          onDelta(full);
        }
      } catch (err) {
        if (err instanceof Error && err.message !== "Unexpected end of JSON input") {
          if ((err as SyntaxError).name === "SyntaxError") continue;
          throw err;
        }
      }
    }
  }
  return full.trim();
}

export async function completeLlm(request: LlmRequest, signal?: AbortSignal): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...request, stream: false }),
    signal,
  });
  const body = (await res.json()) as { text?: string; error?: string };
  if (!res.ok || body.error) throw new Error(body.error || "Generation failed.");
  return (body.text ?? "").trim();
}
