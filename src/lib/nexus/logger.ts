import type { LogEntry } from "./types.ts";

export function makeLog(
  message: string,
  data?: Record<string, unknown>,
  level: LogEntry["level"] = "info",
): LogEntry {
  return { at: Date.now(), level, message, data };
}

export function capLogs(logs: LogEntry[], max = 200): LogEntry[] {
  if (logs.length <= max) return logs;
  return logs.slice(logs.length - max);
}
