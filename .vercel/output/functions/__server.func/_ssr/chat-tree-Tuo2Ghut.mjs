//#region node_modules/.nitro/vite/services/ssr/assets/chat-tree-Tuo2Ghut.js
function pathToRoot(messages, leafId) {
	const path = [];
	let id = leafId;
	const seen = /* @__PURE__ */ new Set();
	while (id && !seen.has(id)) {
		seen.add(id);
		const msg = messages[id];
		if (!msg) break;
		path.push(msg);
		id = msg.parentId;
	}
	return path.reverse();
}
function visibleTranscript(chat, messages) {
	if (!chat) return [];
	return pathToRoot(messages, chat.activeLeafId).filter((m) => m.role === "user" || m.role === "assistant");
}
function childrenOf(messages, parentId, chatId) {
	return Object.values(messages).filter((m) => m.parentId === parentId && (chatId ? m.chatId === chatId : true)).sort((a, b) => a.createdAt - b.createdAt);
}
function siblingsOf(messages, message) {
	return childrenOf(messages, message.parentId, message.chatId).filter((m) => m.role === message.role);
}
function siblingIndex(messages, message) {
	const siblings = siblingsOf(messages, message);
	const index = siblings.findIndex((m) => m.id === message.id);
	return {
		index: Math.max(0, index),
		total: siblings.length,
		siblings
	};
}
function leafFrom(messageId, messages) {
	let current = messageId;
	while (true) {
		const kids = childrenOf(messages, current).sort((a, b) => b.createdAt - a.createdAt);
		if (kids.length === 0) return current;
		current = kids[0].id;
	}
}
function addMessage(messages, chat, message) {
	return {
		messages: {
			...messages,
			[message.id]: message
		},
		chat: {
			...chat,
			rootMessageId: chat.rootMessageId ?? message.id,
			activeLeafId: message.id
		}
	};
}
function switchToSibling(messages, chat, message, delta) {
	const { siblings, index } = siblingIndex(messages, message);
	if (siblings.length <= 1) return chat;
	const next = siblings[(index + delta + siblings.length) % siblings.length];
	return {
		...chat,
		activeLeafId: leafFrom(next.id, messages)
	};
}
//#endregion
export { visibleTranscript as i, siblingIndex as n, switchToSibling as r, addMessage as t };
