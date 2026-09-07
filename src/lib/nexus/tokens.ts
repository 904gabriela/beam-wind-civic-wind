export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.max(1, Math.ceil(text.length / 4));
}

export function clipToTokens(text: string, maxTokens: number): string {
  if (maxTokens <= 0) return "";
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) return text;
  return text.slice(0, Math.max(0, maxChars - 1)).trimEnd() + "…";
}
