import { createFileRoute } from "@tanstack/react-router";
import { runProvider } from "@/lib/llm/providers.server";
import type { LlmRequest } from "@/lib/llm/types";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: LlmRequest & { stream?: boolean };
        try {
          body = (await request.json()) as LlmRequest & { stream?: boolean };
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }
        if (!body?.messages?.length) {
          return Response.json({ error: "Nothing to send." }, { status: 400 });
        }
        const stream = body.stream !== false && !body.json;
        const result = await runProvider(body, stream);
        if (!result.ok) {
          return Response.json({ error: result.error }, { status: result.status ?? 502 });
        }
        if ("text" in result) {
          return Response.json({ text: result.text });
        }
        return new Response(result.stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});
