//#region node_modules/.nitro/vite/services/ssr/assets/context-engine-DVBFw0hf.js
var STOP = new Set([
	"The",
	"She",
	"He",
	"They",
	"You",
	"Your",
	"I",
	"A",
	"An",
	"It",
	"We",
	"Then",
	"And",
	"But",
	"When",
	"If",
	"As",
	"There",
	"This",
	"That",
	"Her",
	"His",
	"Him",
	"Not",
	"No",
	"Yes",
	"What",
	"Why",
	"How",
	"Who",
	"Where",
	"With",
	"From",
	"Into",
	"Over",
	"Under",
	"After",
	"Before",
	"Still",
	"Just",
	"Maybe",
	"Something",
	"Someone",
	"Nothing",
	"Okay",
	"Alright",
	"Well",
	"Please",
	"Sorry",
	"Hello",
	"Good",
	"Bad",
	"Very",
	"Really",
	"Already",
	"Always",
	"Never",
	"Once",
	"Again",
	"Back",
	"Down",
	"Up",
	"Out",
	"Off",
	"On",
	"In",
	"At",
	"To",
	"For",
	"Of",
	"Or",
	"So",
	"Too",
	"Now",
	"Here",
	"Look",
	"Let",
	"Can",
	"Could",
	"Would",
	"Should",
	"Will",
	"Did",
	"Does",
	"Don't",
	"Didn't",
	"It's",
	"I'm",
	"You're",
	"We're",
	"They're",
	"That's",
	"There's"
].map((s) => s.toLowerCase()));
function aliasesOf(c) {
	return [c.name, ...c.aliases].map((s) => s.trim()).filter(Boolean);
}
function matchCharacter(text, characters) {
	const lower = text.toLowerCase();
	return characters.filter((c) => aliasesOf(c).some((alias) => {
		if (alias.length < 2) return false;
		const a = alias.toLowerCase();
		return new RegExp(`\\b${escapeReg(a)}\\b`, "i").test(lower) || lower.includes(a);
	}));
}
function detectEntities(text, characters, lore = [], world) {
	const charHits = matchCharacter(text, characters).map((c) => ({
		kind: "character",
		name: c.name,
		id: c.id
	}));
	const locations = [];
	for (const entry of lore) {
		const keys = [
			entry.title,
			...entry.keywords,
			...entry.aliases
		];
		if (entry.category.toLowerCase().includes("location") || keys.some((k) => k && new RegExp(`\\b${escapeReg(k)}\\b`, "i").test(text))) {
			if (keys.some((k) => k && new RegExp(`\\b${escapeReg(k)}\\b`, "i").test(text))) locations.push({
				kind: "location",
				name: entry.title,
				id: entry.id
			});
		}
	}
	if (world && new RegExp(`\\b${escapeReg(world.name)}\\b`, "i").test(text)) locations.push({
		kind: "location",
		name: world.name,
		id: world.id
	});
	const others = [];
	const nameRe = /\b([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\b/g;
	let m;
	const known = new Set([...charHits, ...locations].map((h) => h.name.toLowerCase()));
	while (m = nameRe.exec(text)) {
		const name = m[1];
		const first = name.split(/\s+/)[0].toLowerCase();
		if (STOP.has(first)) continue;
		if (known.has(name.toLowerCase())) continue;
		if (charHits.some((h) => h.name.toLowerCase() === name.toLowerCase())) continue;
		others.push({
			kind: "other",
			name
		});
		known.add(name.toLowerCase());
	}
	return {
		characters: charHits,
		locations,
		others,
		keywords: tokenize(text).filter((t) => t.length > 3).slice(0, 24)
	};
}
function tokenize(text) {
	return text.toLowerCase().replace(/[^a-z0-9\s']/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));
}
function jaccard(a, b) {
	const A = new Set(a);
	const B = new Set(b);
	if (A.size === 0 && B.size === 0) return 1;
	let inter = 0;
	for (const x of A) if (B.has(x)) inter += 1;
	const union = A.size + B.size - inter;
	return union === 0 ? 0 : inter / union;
}
function normalizeLine(text) {
	return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}
function escapeReg(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function estimateTokens(text) {
	if (!text) return 0;
	return Math.max(1, Math.ceil(text.length / 4));
}
var DEFAULT_BUDGET = {
	system: 1500,
	character: 2500,
	persona: 1e3,
	lore: 3e3,
	memory: 3e3,
	storyState: 1e3,
	chat: 12e3,
	user: 500,
	total: 24500
};
function retrieveContext(index, userText, budget = DEFAULT_BUDGET) {
	const entities = detectEntities(userText + " " + lastAssistant(index.transcript), index.characters, index.lore, index.world);
	const storyChars = index.characters.filter((c) => index.story.characterIds.includes(c.id));
	const presentIds = index.storyState?.presentCharacterIds ?? [];
	const tracked = Boolean(index.storyState?.tracked) || presentIds.length > 0;
	const sceneIds = new Set(tracked ? presentIds : index.story.characterIds);
	const presentChars = index.characters.filter((c) => sceneIds.has(c.id));
	const mentionedPresent = index.characters.filter((c) => entities.characters.some((e) => e.id === c.id) && sceneIds.has(c.id));
	const mergedChars = uniqById([...presentChars, ...mentionedPresent]).slice(0, 8);
	const absentCharacters = tracked ? storyChars.filter((c) => !sceneIds.has(c.id)) : [];
	const lore = activateLore(index.lore.filter((l) => l.enabled), entities, userText + " " + lastAssistant(index.transcript), index.story.loreActivation);
	const pathIds = new Set(index.transcript.map((m) => m.id));
	const memories = index.story.memoryMatrix ? rankMemories(memoriesOnPath(index.memories.filter((m) => m.storyId === index.story.id && m.status !== "deleted"), pathIds), entities, userText, index.storyState).slice(0, 24) : [];
	const relationships = index.relationships.filter((r) => {
		if (r.storyId !== index.story.id) return false;
		const ids = new Set(mergedChars.map((c) => c.id));
		if (index.persona) ids.add(index.persona.id);
		return ids.has(r.aId) || ids.has(r.bId);
	});
	const chat = trimChat(index.transcript, budget.chat);
	return {
		characters: mergedChars,
		persona: index.persona,
		world: index.world,
		lore: fitList(lore, budget.lore, (l) => l.title + l.content),
		memories: fitList(memories, budget.memory, (m) => m.content),
		relationships,
		storyState: index.storyState,
		chat,
		entities,
		budget,
		absentCharacters
	};
}
function memoriesOnPath(memories, pathIds) {
	return memories.filter((m) => {
		if (m.pinned || m.manuallyEdited) return true;
		if (!m.sourceMessageId) return true;
		return pathIds.has(m.sourceMessageId);
	});
}
function memoryProvenance(m) {
	if (m.pinned || m.manuallyEdited) return "canon";
	if (m.observation && m.confidence >= .8) return "seen";
	return "guessed";
}
/** Always-on + keyword match, then 2 hops of ST-style recursion. */
function activateLore(entries, entities, scanText, activation, depth = 2) {
	if (activation === "off") return [];
	const enabled = entries.filter((l) => l.enabled);
	if (activation === "all") return enabled;
	const always = enabled.filter((l) => l.always);
	const ranked = rankLore(enabled.filter((l) => !l.always), entities, scanText);
	return recurseLore(enabled, uniqById([...always, ...ranked]), scanText, depth).slice(0, 16);
}
function recurseLore(all, activated, scanText, depth) {
	const seen = new Set(activated.map((e) => e.id));
	let current = [...activated];
	for (let d = 0; d < depth; d++) {
		const haystack = (scanText + "\n" + current.map((e) => `${e.title}\n${e.content}\n${e.keywords.join(" ")}`).join("\n")).toLowerCase();
		const extra = [];
		for (const entry of all) {
			if (seen.has(entry.id) || entry.preventRecursion) continue;
			if ([
				entry.title,
				...entry.keywords,
				...entry.aliases
			].filter(Boolean).some((k) => k && haystack.includes(k.toLowerCase()))) {
				seen.add(entry.id);
				extra.push(entry);
			}
		}
		if (!extra.length) break;
		current = [...current, ...extra];
	}
	return current;
}
function rankMemories(memories, entities, userText, storyState) {
	const queryTokens = tokenize(userText);
	const entityNames = new Set([
		...entities.characters,
		...entities.locations,
		...entities.others
	].map((e) => e.name.toLowerCase()));
	const scored = memories.map((m) => {
		let score = m.importance * 40 + m.confidence * 10;
		if (m.pinned) score += 100;
		if (m.manuallyEdited) score += 20;
		const recency = Math.max(0, 1 - (Date.now() - m.createdAt) / 18144e5);
		score += recency * 20;
		if (m.subjects.some((s) => entityNames.has(s.toLowerCase()))) score += 30;
		score += jaccard(tokenize(m.content), queryTokens) * 24;
		if (storyState?.location && m.content.toLowerCase().includes(storyState.location.toLowerCase())) score += 8;
		return {
			m,
			score
		};
	});
	scored.sort((a, b) => b.score - a.score);
	return scored.map((s) => s.m);
}
function rankLore(lore, entities, userText) {
	const q = userText.toLowerCase();
	const qTokens = tokenize(userText);
	const names = new Set([
		...entities.characters,
		...entities.locations,
		...entities.others
	].map((e) => e.name.toLowerCase()));
	const scored = lore.map((l) => {
		let score = 0;
		const keys = [
			l.title,
			...l.keywords,
			...l.aliases
		];
		for (const k of keys) {
			if (!k) continue;
			if (q.includes(k.toLowerCase()) || names.has(k.toLowerCase())) score += 28;
		}
		score += jaccard(tokenize(l.content), qTokens) * 18;
		if (score > 0) score += l.priority * 10 + l.importance * 20;
		return {
			l,
			score
		};
	});
	scored.sort((a, b) => b.score - a.score);
	return scored.filter((s) => s.score >= 20).map((s) => s.l);
}
function trimChat(messages, budgetTokens) {
	const kept = [];
	let used = 0;
	for (let i = messages.length - 1; i >= 0; i--) {
		const t = estimateTokens(messages[i].content);
		if (used + t > budgetTokens && kept.length > 2) break;
		kept.push(messages[i]);
		used += t;
	}
	return kept.reverse();
}
function fitList(items, budget, text) {
	const out = [];
	let used = 0;
	for (const item of items) {
		const t = estimateTokens(text(item));
		if (used + t > budget && out.length > 0) break;
		out.push(item);
		used += t;
	}
	return out;
}
function lastAssistant(transcript) {
	for (let i = transcript.length - 1; i >= 0; i--) if (transcript[i].role === "assistant") return transcript[i].content;
	return "";
}
function uniqById(items) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of items) {
		if (seen.has(item.id)) continue;
		seen.add(item.id);
		out.push(item);
	}
	return out;
}
//#endregion
export { normalizeLine as a, memoryProvenance as i, estimateTokens as n, retrieveContext as o, jaccard as r, tokenize as s, detectEntities as t };
