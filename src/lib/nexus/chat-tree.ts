import type { Chat, ChatMessage, Id } from "./types.ts";

export function pathToRoot(
  messages: Record<Id, ChatMessage>,
  leafId: Id | null,
): ChatMessage[] {
  const path: ChatMessage[] = [];
  let id = leafId;
  const seen = new Set<Id>();
  while (id && !seen.has(id)) {
    seen.add(id);
    const msg = messages[id];
    if (!msg) break;
    path.push(msg);
    id = msg.parentId;
  }
  return path.reverse();
}

export function visibleTranscript(
  chat: Chat | undefined,
  messages: Record<Id, ChatMessage>,
): ChatMessage[] {
  if (!chat) return [];
  return pathToRoot(messages, chat.activeLeafId).filter(
    (m) => m.role === "user" || m.role === "assistant",
  );
}

export function childrenOf(
  messages: Record<Id, ChatMessage>,
  parentId: Id | null,
  chatId?: Id,
): ChatMessage[] {
  return Object.values(messages)
    .filter(
      (m) =>
        m.parentId === parentId && (chatId ? m.chatId === chatId : true),
    )
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function siblingsOf(
  messages: Record<Id, ChatMessage>,
  message: ChatMessage,
): ChatMessage[] {
  return childrenOf(messages, message.parentId, message.chatId).filter(
    (m) => m.role === message.role,
  );
}

export function siblingIndex(
  messages: Record<Id, ChatMessage>,
  message: ChatMessage,
): { index: number; total: number; siblings: ChatMessage[] } {
  const siblings = siblingsOf(messages, message);
  const index = siblings.findIndex((m) => m.id === message.id);
  return { index: Math.max(0, index), total: siblings.length, siblings };
}

export function leafFrom(messageId: Id, messages: Record<Id, ChatMessage>): Id {
  let current = messageId;
  while (true) {
    const kids = childrenOf(messages, current).sort(
      (a, b) => b.createdAt - a.createdAt,
    );
    if (kids.length === 0) return current;
    current = kids[0].id;
  }
}

export function addMessage(
  messages: Record<Id, ChatMessage>,
  chat: Chat,
  message: ChatMessage,
): { messages: Record<Id, ChatMessage>; chat: Chat } {
  const nextMessages = { ...messages, [message.id]: message };
  const nextChat: Chat = {
    ...chat,
    rootMessageId: chat.rootMessageId ?? message.id,
    activeLeafId: message.id,
  };
  return { messages: nextMessages, chat: nextChat };
}

export function switchToSibling(
  messages: Record<Id, ChatMessage>,
  chat: Chat,
  message: ChatMessage,
  delta: number,
): Chat {
  const { siblings, index } = siblingIndex(messages, message);
  if (siblings.length <= 1) return chat;
  const next = siblings[(index + delta + siblings.length) % siblings.length];
  return { ...chat, activeLeafId: leafFrom(next.id, messages) };
}
