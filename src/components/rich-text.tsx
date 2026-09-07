import { cn } from "@/lib/utils";

export function stripChoices(text: string): { body: string; choices: string[] } {
  const match = text.match(/<choices>\s*([\s\S]*?)\s*<\/choices>/i);
  if (!match) return { body: text.trim(), choices: [] };
  const choices = match[1]
    .split("\n")
    .map((l) => l.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
  const body = text.replace(match[0], "").trim();
  return { body, choices };
}

export function RichText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/(\*[^*\n]+\*|“[^”]+”|"[^"\n]+")/g);
  return (
    <p className={cn("whitespace-pre-wrap text-pretty leading-relaxed", className)}>
      {parts.map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return (
            <em key={i} className="text-muted not-italic italic">
              {part.slice(1, -1)}
            </em>
          );
        }
        if (
          (part.startsWith('"') && part.endsWith('"') && part.length > 2) ||
          (part.startsWith("“") && part.endsWith("”") && part.length > 2)
        ) {
          return (
            <span key={i} className="text-fg">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}
