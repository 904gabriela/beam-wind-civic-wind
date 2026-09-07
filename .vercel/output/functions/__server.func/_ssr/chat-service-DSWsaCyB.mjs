import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./router-DqXMpz5r.mjs";
import { c as createStoryDraft, d as nid, f as now, g as withOpeningChoices, h as useNexus, i as composePresets, l as defaultPersonaId, n as CHARACTERS } from "./store-Cn-YIMyD.mjs";
import { a as normalizeLine, i as memoryProvenance, n as estimateTokens, o as retrieveContext, r as jaccard, s as tokenize, t as detectEntities } from "./context-engine-DVBFw0hf.mjs";
import { i as visibleTranscript, t as addMessage } from "./chat-tree-Tuo2Ghut.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-service-DSWsaCyB.js
var import_jsx_runtime = require_jsx_runtime();
function stripChoices(text) {
	const match = text.match(/<choices>\s*([\s\S]*?)\s*<\/choices>/i);
	if (!match) return {
		body: text.trim(),
		choices: []
	};
	const choices = match[1].split("\n").map((l) => l.replace(/^[-*]\s*/, "").trim()).filter(Boolean).slice(0, 3);
	return {
		body: text.replace(match[0], "").trim(),
		choices
	};
}
function RichText({ text, className }) {
	const parts = text.split(/(\*[^*\n]+\*|“[^”]+”|"[^"\n]+")/g);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("whitespace-pre-wrap text-pretty leading-relaxed", className),
		children: parts.map((part, i) => {
			if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
				className: "text-muted not-italic italic",
				children: part.slice(1, -1)
			}, i);
			if (part.startsWith("\"") && part.endsWith("\"") && part.length > 2 || part.startsWith("“") && part.endsWith("”") && part.length > 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-fg",
				children: part
			}, i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
		})
	});
}
async function streamLlm(request, onDelta, signal) {
	const res = await fetch("/api/generate", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request),
		signal
	});
	if (!res.ok) {
		let message = "Generation failed.";
		try {
			const body = await res.json();
			if (body.error) message = body.error;
		} catch {}
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
				const json = JSON.parse(data);
				if (json.error) throw new Error(json.error);
				const piece = json.choices?.[0]?.delta?.content ?? "";
				if (piece) {
					full += piece;
					onDelta(full);
				}
			} catch (err) {
				if (err instanceof Error && err.message !== "Unexpected end of JSON input") {
					if (err.name === "SyntaxError") continue;
					throw err;
				}
			}
		}
	}
	return full.trim();
}
async function completeLlm(request, signal) {
	const res = await fetch("/api/generate", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...request,
			stream: false
		}),
		signal
	});
	const body = await res.json();
	if (!res.ok || body.error) throw new Error(body.error || "Generation failed.");
	return (body.text ?? "").trim();
}
function attachedLorebooks(story, books) {
	const attached = new Set(story.lorebookIds ?? []);
	return books.filter((book) => book.enabled && (book.global || attached.has(book.id)));
}
function loreForStory(story, lore, books) {
	if (story.loreActivation === "off") return [];
	const bookIds = new Set(attachedLorebooks(story, books).map((b) => b.id));
	return lore.filter((entry) => {
		if (!entry.enabled) return false;
		if (entry.lorebookId && bookIds.has(entry.lorebookId)) return true;
		if (story.loreIds.includes(entry.id)) return true;
		if (entry.storyId === story.id) return true;
		if (story.worldId && entry.worldId === story.worldId) return true;
		return false;
	});
}
function discoverCharacters(opts) {
	const entities = detectEntities(opts.text, opts.known, opts.lore ?? [], opts.world);
	const created = [];
	for (const hit of entities.others) {
		const name = hit.name.trim();
		if (name.length < 3) continue;
		if (looksGeneric(name)) continue;
		if (opts.known.some((c) => namesMatch(c, name)) || created.some((c) => namesMatch(c, name))) continue;
		const fact = {
			id: nid(),
			content: extractFact(opts.text, name),
			sourceMessageId: opts.sourceMessageId,
			confidence: .86,
			createdAt: now()
		};
		const t = now();
		created.push({
			id: nid(),
			name,
			aliases: [],
			description: "",
			personality: "",
			appearance: "",
			background: "",
			history: "",
			behavior: "",
			speechStyle: "",
			likes: "",
			dislikes: "",
			fears: "",
			goals: "",
			secrets: "",
			abilities: "",
			scenario: "",
			exampleDialogue: "",
			systemInstructions: "",
			creatorNotes: "Automatically discovered from the story. Only observed facts are stored.",
			tags: ["discovered"],
			origin: "discovered",
			observedFacts: [fact],
			confidence: fact.confidence,
			createdAt: t,
			updatedAt: t
		});
	}
	return created;
}
function enrichCharacter(character, factText, sourceMessageId) {
	const content = factText.trim();
	if (!content) return character;
	if (character.observedFacts.some((f) => f.content.toLowerCase() === content.toLowerCase())) return character;
	const fact = {
		id: nid(),
		content,
		sourceMessageId,
		confidence: .8,
		createdAt: now()
	};
	const facts = [...character.observedFacts, fact].slice(-24);
	const confidence = Math.min(.99, facts.reduce((s, f) => s + f.confidence, 0) / facts.length);
	return {
		...character,
		observedFacts: facts,
		confidence,
		updatedAt: now()
	};
}
function namesMatch(c, name) {
	const n = name.toLowerCase();
	return c.name.toLowerCase() === n || c.aliases.some((a) => a.toLowerCase() === n);
}
function extractFact(text, name) {
	return (text.split(/(?<=[.!?])\s+/).find((p) => p.toLowerCase().includes(name.toLowerCase())) ?? `${name} appeared in the current storyline.`).trim().slice(0, 240);
}
function looksGeneric(name) {
	if (/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|Chapter|Scene)$/i.test(name)) return true;
	return new Set("play sit look come wait please maybe something someone everything nothing hello thanks fine sure right left back down open close stay leave take give keep tell ask know think feel want need make made said says went came let get got put run walk stand stand sat speak talk whisper smile laugh freeze nod glance turn".split(" ")).has(name.toLowerCase());
}
var PATTERNS = [
	{
		re: /\b(kissed|kiss)\b/i,
		type: "relationship_event",
		importance: .92,
		rel: .94,
		emotion: .9
	},
	{
		re: /\b(promised|promise|vowed|swore)\b/i,
		type: "promise",
		importance: .9,
		rel: .72,
		emotion: .55
	},
	{
		re: /\b(secret|never told|don't tell|dont tell)\b/i,
		type: "secret",
		importance: .93,
		rel: .8,
		emotion: .7
	},
	{
		re: /\b(argued|argument|yelled|fought|fight)\b/i,
		type: "conflict",
		importance: .78,
		rel: .74,
		emotion: .7
	},
	{
		re: /\b(apologized|apology|forgave|reconciled)\b/i,
		type: "relationship_event",
		importance: .82,
		rel: .8,
		emotion: .66
	},
	{
		re: /\b(confess(?:ed|es|ion)?)\b/i,
		type: "relationship_event",
		importance: .88,
		rel: .86,
		emotion: .8
	},
	{
		re: /\b(moved to|permanently|will live|left (?:town|home|the city))\b/i,
		type: "fact",
		importance: .84,
		rel: .3,
		emotion: .4
	},
	{
		re: /\b(died|killed|wounded|injured)\b/i,
		type: "event",
		importance: .95,
		rel: .5,
		emotion: .85
	},
	{
		re: /\b(arrived|returned to|went back|took .+ (?:to|into))\b/i,
		type: "event",
		importance: .55,
		rel: .2,
		emotion: .2
	},
	{
		re: /\b(goal|must|have to protect|will protect)\b/i,
		type: "goal",
		importance: .72,
		rel: .4,
		emotion: .35
	},
	{
		re: /\b(found|discovered|realized)\b/i,
		type: "discovery",
		importance: .7,
		rel: .25,
		emotion: .35
	}
];
var TRIVIAL = /\b(dropped (?:her |his |their )?(?:phone|bag|keys)|yawned|blinked|sipped|shifted in (?:her |his )?seat)\b/i;
function scoreConfidence(opts) {
	if (opts.inferred && !opts.explicit) return .38;
	if (opts.observation && opts.explicit) return .96;
	if (opts.explicit) return .86;
	if (opts.observation) return .74;
	return .5;
}
function shouldAutoCommit(confidence, importance) {
	if (confidence < .55 || importance < .45) return "reject";
	if (confidence < .8) return "soft";
	return "committed";
}
function extractHeuristic(opts) {
	const text = `${opts.userText}\n${opts.assistantText}`.trim();
	if (!text) return emptyAnalyzer();
	if (TRIVIAL.test(text) && text.length < 180) return emptyAnalyzer();
	const entities = detectEntities(opts.userText + " " + opts.assistantText, opts.characters, opts.lore ?? [], opts.world);
	const uniqueSubjects = uniq([...entities.characters.map((c) => c.name), ...entities.others.map((o) => o.name)]);
	const memories = [];
	for (const pat of PATTERNS) {
		if (!pat.re.test(text)) continue;
		const snippet = sentenceContaining(text, pat.re) ?? summarizeBeat(text, uniqueSubjects, pat.type);
		const inferred = /seemed|perhaps|maybe|might have|as if|looked like/i.test(snippet);
		const explicit = pat.re.test(snippet);
		memories.push({
			type: pat.type,
			subjects: uniqueSubjects.slice(0, 4),
			content: snippet,
			importance: pat.importance,
			confidence: scoreConfidence({
				observation: !inferred,
				explicit,
				inferred
			}),
			relationshipImpact: pat.rel,
			observation: !inferred
		});
	}
	if (memories.length === 0 && entities.characters.length >= 2 && text.length > 400) {
		const inferred = /seemed|perhaps|maybe/i.test(text);
		memories.push({
			type: "event",
			subjects: uniqueSubjects.slice(0, 4),
			content: summarizeBeat(text, uniqueSubjects, "event"),
			importance: .52,
			confidence: scoreConfidence({
				observation: true,
				explicit: false,
				inferred
			}),
			relationshipImpact: .35,
			observation: !inferred
		});
	}
	const characters = entities.others.filter((o) => /^[A-Z]/.test(o.name) && o.name.length > 2).slice(0, 4).map((o) => ({
		name: o.name,
		facts: [sentenceContaining(text, new RegExp(o.name, "i")) ?? `${o.name} appeared in the scene.`],
		confidence: .8
	}));
	const relationshipUpdates = [];
	if (entities.characters.length >= 2) {
		const relMem = memories.find((m) => m.relationshipImpact >= .6);
		if (relMem) relationshipUpdates.push({
			a: entities.characters[0].name,
			b: entities.characters[1].name,
			note: relMem.content,
			state: relMem.type === "conflict" ? "In conflict" : "Changed by recent events",
			confidence: relMem.confidence
		});
	}
	const loc = entities.locations[0]?.name ?? "";
	const storyStateUpdates = {};
	if (loc) storyStateUpdates.location = loc;
	const arrived = uniqueSubjects.filter((name) => nameArrivedInText(text, name));
	if (arrived.length) storyStateUpdates.present = arrived;
	if (memories[0]) storyStateUpdates.recentEvents = memories[0].content;
	return {
		memories,
		characters,
		relationshipUpdates,
		storyStateUpdates
	};
}
function memoriesFromAnalyzer(storyId, chatId, sourceMessageId, output, characters) {
	const result = [];
	for (const m of output.memories) {
		const status = shouldAutoCommit(m.confidence, m.importance);
		if (status === "reject") continue;
		const characterIds = characters.filter((c) => m.subjects.some((s) => c.name.toLowerCase() === s.toLowerCase() || c.aliases.some((a) => a.toLowerCase() === s.toLowerCase()))).map((c) => c.id);
		const created = now();
		result.push({
			id: nid(),
			storyId,
			type: m.type,
			content: m.content.trim(),
			summary: m.content.trim(),
			subjects: m.subjects,
			characterIds,
			importance: clamp01(m.importance),
			confidence: clamp01(m.confidence),
			relationshipImpact: clamp01(m.relationshipImpact),
			emotionalSignificance: clamp01(m.importance * .8),
			observation: m.observation,
			sourceMessageId,
			sourceChatId: chatId,
			pinned: false,
			manuallyEdited: false,
			status,
			createdAt: created,
			updatedAt: created,
			retrievalCount: 0
		});
	}
	return result;
}
function dedupeMemories(existing, incoming) {
	const kept = [];
	for (const mem of incoming) {
		if (mem.status === "deleted") continue;
		const dup = existing.find((e) => e.status !== "deleted" && similarMemory(e, mem));
		if (!dup) {
			kept.push(mem);
			continue;
		}
		if (mem.confidence > dup.confidence || mem.manuallyEdited) kept.push({
			...dup,
			content: mem.content,
			summary: mem.summary,
			confidence: Math.max(dup.confidence, mem.confidence),
			importance: Math.max(dup.importance, mem.importance),
			updatedAt: now()
		});
	}
	return kept;
}
function similarMemory(a, b) {
	if (a.storyId !== b.storyId) return false;
	const sameType = a.type === b.type;
	const sim = jaccard(tokenize(a.content), tokenize(b.content));
	const sameSubjects = a.subjects.length > 0 && b.subjects.length > 0 && a.subjects.some((s) => b.subjects.some((t) => s.toLowerCase() === t.toLowerCase()));
	if (normalizeLine(a.content) === normalizeLine(b.content)) return true;
	if (sameType && sameSubjects && sim >= .34) return true;
	const aStem = stemKey(a.content);
	const bStem = stemKey(b.content);
	return sameType && sameSubjects && aStem.size > 0 && [...aStem].some((k) => bStem.has(k));
}
function stemKey(text) {
	const keys = [
		"protect",
		"promise",
		"vow",
		"kiss",
		"secret",
		"apolog",
		"argu",
		"forgave",
		"reconcil",
		"moved",
		"confess"
	];
	const lower = text.toLowerCase();
	return new Set(keys.filter((k) => lower.includes(k)));
}
function consolidatePairEvents(memories) {
	const live = memories.filter((m) => m.status !== "deleted");
	const conflicts = live.filter((m) => m.type === "conflict");
	const repairs = live.filter((m) => m.type === "relationship_event" && /apolog|forgave|reconcil/i.test(m.content));
	if (!conflicts.length || !repairs.length) return null;
	const a = conflicts[0];
	const b = repairs[0];
	const subjects = uniq([...a.subjects, ...b.subjects]);
	if (subjects.length < 2) return null;
	const created = now();
	return {
		id: nid(),
		storyId: a.storyId,
		type: "consequence",
		content: `${subjects[0]} and ${subjects[1]} had a conflict but later reconciled.`,
		summary: `${subjects[0]} and ${subjects[1]} reconciled after a conflict.`,
		subjects,
		characterIds: uniq([...a.characterIds, ...b.characterIds]),
		importance: .8,
		confidence: Math.min(a.confidence, b.confidence),
		relationshipImpact: .84,
		emotionalSignificance: .7,
		observation: true,
		sourceMessageId: b.sourceMessageId,
		sourceChatId: b.sourceChatId,
		pinned: false,
		manuallyEdited: false,
		status: "committed",
		createdAt: created,
		updatedAt: created,
		retrievalCount: 0
	};
}
function applyRelationshipUpdates(existing, storyId, updates, resolveId) {
	const next = [...existing];
	for (const u of updates) {
		const aId = resolveId(u.a);
		const bId = resolveId(u.b);
		if (!aId || !bId || aId === bId) continue;
		const found = next.find((r) => r.storyId === storyId && (r.aId === aId && r.bId === bId || r.aId === bId && r.bId === aId));
		if (found) {
			found.currentState = u.state ?? found.currentState;
			if (u.label) found.label = u.label;
			if (u.note) found.history = [...found.history, u.note].slice(-12);
			found.confidence = Math.max(found.confidence, u.confidence);
			found.updatedAt = now();
		} else next.push({
			id: nid(),
			storyId,
			aId,
			bId,
			label: u.label ?? "Involved",
			history: u.note ? [u.note] : [],
			currentState: u.state ?? "Developing",
			confidence: u.confidence,
			updatedAt: now()
		});
	}
	return next;
}
function mergeStoryState(prev, patch, presentIds, tracked) {
	const base = prev ?? {
		location: "",
		scene: "",
		presentCharacterIds: [],
		time: "",
		goals: "",
		tension: "",
		recentEvents: "",
		emotionalState: "",
		updatedAt: 0,
		tracked: false
	};
	return {
		location: patch.location ?? base.location,
		scene: patch.scene ?? base.scene,
		presentCharacterIds: presentIds ?? base.presentCharacterIds,
		time: patch.time ?? base.time,
		goals: patch.goals ?? base.goals,
		tension: patch.tension ?? base.tension,
		recentEvents: patch.recentEvents ?? base.recentEvents,
		emotionalState: patch.emotionalState ?? base.emotionalState,
		updatedAt: now(),
		tracked: tracked ?? base.tracked ?? false
	};
}
function parseAnalyzerJson(raw) {
	const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");
	if (start < 0 || end <= start) return null;
	try {
		const parsed = JSON.parse(trimmed.slice(start, end + 1));
		if (!Array.isArray(parsed.memories)) return null;
		return {
			memories: parsed.memories.filter(validMemory),
			characters: Array.isArray(parsed.characters) ? parsed.characters : [],
			relationshipUpdates: Array.isArray(parsed.relationshipUpdates) ? parsed.relationshipUpdates : [],
			storyStateUpdates: parsed.storyStateUpdates ?? {}
		};
	} catch {
		return null;
	}
}
function validMemory(m) {
	return !!m && typeof m.content === "string" && m.content.trim().length > 0 && typeof m.confidence === "number" && typeof m.importance === "number";
}
function emptyAnalyzer() {
	return {
		memories: [],
		characters: [],
		relationshipUpdates: [],
		storyStateUpdates: {}
	};
}
function sentenceContaining(text, re) {
	const hit = text.split(/(?<=[.!?])\s+/).find((p) => re.test(p));
	return hit ? hit.trim().slice(0, 280) : null;
}
function summarizeBeat(text, subjects, type) {
	const who = subjects.slice(0, 2).join(" and ");
	const first = text.replace(/\s+/g, " ").trim().slice(0, 180);
	if (who) return `${who}: ${first}`;
	return `${type}: ${first}`;
}
function uniq(xs) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const x of xs) {
		const k = x.toLowerCase();
		if (seen.has(k)) continue;
		seen.add(k);
		out.push(x);
	}
	return out;
}
function clamp01(n) {
	if (Number.isNaN(n)) return 0;
	return Math.max(0, Math.min(1, n));
}
var ARRIVAL = /\b(arrived|walked in|came in|entered|joined|showed up|stepped in|steps in|stepped inside)\b/i;
function nameArrivedInText(text, name) {
	if (!name.trim()) return false;
	const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	return new RegExp(`(${escaped})[^\\n.]{0,72}${ARRIVAL.source}|${ARRIVAL.source}[^\\n.]{0,72}(${escaped})`, "i").test(text);
}
function arrivingIdsFromText(text, names, resolveId) {
	const ids = [];
	for (const name of names) {
		if (!nameArrivedInText(text, name)) continue;
		const id = resolveId(name);
		if (id && !ids.includes(id)) ids.push(id);
	}
	return ids;
}
var DEFAULT_ORDER = [
	"system",
	"style",
	"story",
	"character",
	"persona",
	"world",
	"lore",
	"relationships",
	"memory",
	"storyState",
	"examples",
	"chat",
	"user"
];
function buildPrompt(opts) {
	const order = opts.order ?? DEFAULT_ORDER;
	const blocks = [];
	const push = (kind, title, content, rank = 1) => {
		const trimmed = content.trim();
		if (!trimmed) return;
		blocks.push({
			id: `${kind}-${blocks.length}`,
			kind,
			title,
			content: trimmed,
			tokens: estimateTokens(trimmed),
			included: true,
			rank
		});
	};
	push("system", "System", SYSTEM_CORE);
	push("style", "Generation style", `Active style: ${opts.preset.name}\n\n${opts.preset.instructions}\n\nStyle affects prose only. It never overrides persona lock, scene presence, or character identity.`);
	push("story", "Story", `Story: ${opts.story.name}\n${opts.story.description}\n\nAuthority: character definitions and established story events outrank style instructions. Never force outcomes the characters would not choose.`);
	for (const c of opts.pack.characters) push("character", c.name, renderCharacter(c), c.origin === "discovered" ? .6 : 1);
	push("persona", "User persona — do not write", renderPersona(opts.pack.persona));
	if (opts.pack.world) push("world", opts.pack.world.name, opts.pack.world.description);
	if (opts.pack.lore.length) push("lore", "Relevant lore", `${opts.pack.lore.map(renderLore).join("\n\n")}\n\nLore is background knowledge only. It must never create physical presence or walk an Absent character into the scene.`);
	if (opts.pack.relationships.length) push("relationships", "Relationships", opts.pack.relationships.map((r) => renderRelationship(r, opts.pack)).join("\n"));
	if (opts.pack.memories.length) push("memory", "Memory matrix", `Provenance: CANON is user-pinned or edited. SEEN happened in a scene. GUESSED is inference — not fact, do not treat it as canon.\n${opts.pack.memories.map(renderMemory).join("\n")}\n\nMemory is continuity, not a guest list. Recalling someone does not put them in the room.`);
	push("storyState", "Scene and story state", renderState(opts.pack.storyState, opts.pack));
	const examples = opts.pack.characters.map((c) => c.exampleDialogue.trim()).filter(Boolean).join("\n\n");
	if (examples) push("examples", "Example voice (present characters only)", examples);
	const history = opts.pack.chat.filter((m) => m.content.trim());
	const userBlock = opts.userText.trim();
	const ordered = order.filter((k) => k !== "chat" && k !== "user").flatMap((k) => blocks.filter((b) => b.kind === k));
	applyBudget(ordered, opts.pack.budget.total - estimateTokens(userBlock) - 1500);
	const messages = [{
		role: "system",
		content: ordered.map((b) => `### ${b.title}\n${b.content}`).join("\n\n")
	}];
	for (const m of history) {
		if (m.role === "system") continue;
		messages.push({
			role: m.role,
			content: stripMeta(m.content)
		});
	}
	if (!history.some((m) => m.role === "user" && m.content === userBlock)) messages.push({
		role: "user",
		content: userBlock
	});
	return {
		messages,
		trace: {
			at: Date.now(),
			blocks: [...ordered, {
				id: "user",
				kind: "user",
				title: "Current user",
				content: userBlock,
				tokens: estimateTokens(userBlock),
				included: true,
				rank: 1
			}],
			totalTokens: ordered.reduce((s, b) => s + b.tokens, 0) + estimateTokens(userBlock),
			memoryIds: opts.pack.memories.map((m) => m.id),
			loreIds: opts.pack.lore.map((l) => l.id),
			characterIds: opts.pack.characters.map((c) => c.id),
			presetNames: [opts.preset.name],
			storyState: opts.pack.storyState
		}
	};
}
function applyBudget(blocks, budget) {
	let total = blocks.reduce((s, b) => s + b.tokens, 0);
	if (total <= budget) return;
	for (const kind of [
		"examples",
		"lore",
		"memory",
		"world",
		"relationships"
	]) for (const b of [...blocks].reverse()) {
		if (total <= budget) return;
		if (b.kind !== kind || !b.included) continue;
		b.included = false;
		b.content = "";
		total -= b.tokens;
		b.tokens = 0;
	}
	const kept = blocks.filter((b) => b.included);
	blocks.length = 0;
	blocks.push(...kept);
}
function renderCharacter(c) {
	if (c.origin === "discovered") {
		const facts = c.observedFacts.map((f) => `- ${f.content} (confidence ${f.confidence.toFixed(2)})`).join("\n");
		return `IN SCENE — you may write this character.\nName: ${c.name}\nStatus: Automatically discovered\nOnly use established facts. Do not invent a full biography.\nKnown facts:\n${facts || "- Present in the current storyline."}`;
	}
	return `IN SCENE — you may write this character's speech, actions, and interiority.\n${[
		["Name", c.name],
		["Aliases", c.aliases.join(", ")],
		["Description", c.description],
		["Personality", c.personality],
		["Appearance", c.appearance],
		["Background", c.background],
		["Behavior", c.behavior],
		["Speech", c.speechStyle],
		["Likes", c.likes],
		["Dislikes", c.dislikes],
		["Fears", c.fears],
		["Goals", c.goals],
		["Secrets (do not leak to those who do not know)", c.secrets],
		["Abilities", c.abilities],
		["Scenario", c.scenario],
		["Instructions", c.systemInstructions]
	].filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v}`).join("\n")}`;
}
function renderPersona(p) {
	const lock = "The user controls this persona. NEVER invent the persona's dialogue, thoughts, feelings, decisions, or next actions unless the user already supplied them in the current turn.\nHistorical lines attributed to the persona are past events. They do not license you to write the persona now.";
	if (!p) return `${lock}\n\nThe human user is playing themselves. Do not write their lines.`;
	const details = [
		`Name: ${p.name}`,
		p.appearance && `Appearance: ${p.appearance}`,
		p.personality && `Personality: ${p.personality}`,
		p.background && `Background: ${p.background}`,
		p.behavior && `Behavior: ${p.behavior}`,
		p.speechStyle && `Speech: ${p.speechStyle}`,
		p.preferences && `Preferences: ${p.preferences}`,
		p.abilities && `Abilities: ${p.abilities}`
	].filter((line) => Boolean(line) && !line.endsWith(": ")).join("\n");
	return `${lock}\n\nNEVER write ${p.name}'s dialogue, thoughts, feelings, decisions, or next actions unless the user already wrote them in this turn.\n\n${details}`;
}
function renderLore(l) {
	return `• ${l.title}: ${l.content}`;
}
function renderMemory(m) {
	const origin = memoryProvenance(m).toUpperCase();
	const pin = m.pinned ? " [PINNED]" : "";
	const auth = m.manuallyEdited ? " [USER-EDITED]" : "";
	return `• [${origin}] (${m.type}, importance ${m.importance.toFixed(2)}, confidence ${m.confidence.toFixed(2)})${pin}${auth} ${m.content}`;
}
function renderRelationship(r, pack) {
	const name = (id) => pack.characters.find((c) => c.id === id)?.name ?? pack.absentCharacters.find((c) => c.id === id)?.name ?? (pack.persona?.id === id ? pack.persona.name : id);
	return `• ${name(r.aId)} ↔ ${name(r.bId)}: ${r.label}. ${r.currentState}. ${r.history.slice(-3).join(" ")}`;
}
function resolveName(id, pack) {
	if (pack.persona?.id === id) return pack.persona.name;
	return pack.characters.find((c) => c.id === id)?.name ?? pack.absentCharacters.find((c) => c.id === id)?.name;
}
function renderState(s, pack) {
	const personaName = pack.persona?.name;
	const presentNpc = (s?.presentCharacterIds ?? pack.characters.map((c) => c.id)).map((id) => resolveName(id, pack)).filter((n) => !!n && n !== personaName);
	const absent = (pack.absentCharacters ?? []).map((c) => c.name).filter((n) => n && n !== personaName);
	return [
		s?.location && `Location: ${s.location}`,
		s?.scene && `Scene: ${s.scene}`,
		presentNpc.length && `Present: ${presentNpc.join(", ")}`,
		personaName && `User persona in scene: ${personaName} — do not write this character`,
		absent.length && `Absent — must not enter, speak, or be nearby: ${absent.join(", ")}`,
		absent.length && "Lore, memory, and older chat that mention Absent people are background only. They do not create physical presence.",
		s?.time && `Time: ${s.time}`,
		s?.goals && `Goals: ${s.goals}`,
		s?.tension && `Tension: ${s.tension}`,
		s?.recentEvents && `Recent: ${s.recentEvents}`,
		s?.emotionalState && `Emotional state: ${s.emotionalState}`
	].filter(Boolean).join("\n");
}
function stripMeta(text) {
	return text.replace(/<choices>[\s\S]*?<\/choices>/gi, "").trim();
}
var SYSTEM_CORE = `You are the storyteller inside Nexus, a private long-form roleplay engine.

The LLM renders the story. Nexus already managed context for you. Use what you are given. Do not invent a conflicting canon.

Conflict hierarchy (highest wins):
1. Explicit user instruction in the current message
2. Current story events in the recent chat
3. Pinned or manually edited story knowledge
4. Character definition
5. Established memories
6. Lore
7. Your inference

Control:
- The user controls their persona. You control narration and NPCs who are present.
- NEVER invent the persona's dialogue, thoughts, feelings, decisions, or next actions unless the user already supplied them in the current turn.
- Historical lines spoken by the persona (or labeled as them) are past events. They do not license you to write the persona now.
- Style presets affect prose, never identity. A romantic or slow-burn style does not make a character suddenly romantic or in love.

Presence:
- Existence and presence are different. Cast members may exist without being in this scene.
- Write ONLY characters listed as Present. Absent characters must not enter, speak, or be revealed to be nearby.
- Lore, memories, and old chat mentioning someone do not create physical presence. Do not invent a reason for an absent character to arrive.

Continuation:
- A short user turn is still a full roleplay beat. Continue the scene from where it currently stands.
- Treat the user's turn as an invitation to play out what happens next: NPC reaction, environment, dialogue, physical response.
- Do not merely acknowledge the message and stop.
- Use whatever combination of dialogue, action, narration, and present-character interiority the scene naturally requires.
- Stop at a natural beat. Do not pad. Do not recap. Do not summarize. Do not write meta commentary.

Rules:
- Stay in scene. Do not mention being an AI, a model, or Nexus.
- Do not force romance, friendship, reconciliation, or plot twists the characters would not choose.
- Discovered characters may only use listed facts. Do not hallucinate biographies.
- Secrets are knowledge-bounded: a character who does not know a secret must not speak as if they do.
- Mix *action/body language* with spoken dialogue in quotes.
- All characters portrayed are adults.
- Keep intimacy literary. Do not write explicit sexual content.
- Continuity first: who is present, where they are, what just happened, what was promised.`;
function requestFromState(story, messages, sampling, json = false) {
	const settings = useNexus.getState().settings;
	return {
		provider: settings.provider,
		model: settings.provider === "xai" ? settings.xaiModel : settings.provider === "ollama" ? settings.ollamaModel : settings.openaiModel,
		ollamaBaseUrl: settings.ollamaBaseUrl,
		openaiBaseUrl: settings.openaiBaseUrl,
		openaiApiKey: settings.openaiApiKey,
		temperature: sampling.temperature,
		topP: sampling.topP,
		topK: sampling.topK,
		repeatPenalty: sampling.repeatPenalty,
		maxTokens: json ? 500 : Math.min(sampling.maxTokens, 2e3),
		numCtx: story.contextSize || 24e3,
		messages,
		json
	};
}
function packFor(story, userText) {
	const s = useNexus.getState();
	const chat = s.chats[story.chatId];
	const transcript = visibleTranscript(chat, s.messages);
	const characters = Object.values(s.characters);
	const lore = loreForStory(story, Object.values(s.lore), Object.values(s.lorebooks));
	return retrieveContext({
		story,
		characters,
		persona: story.personaId ? s.personas[story.personaId] : void 0,
		world: story.worldId ? s.worlds[story.worldId] : void 0,
		lore,
		memories: Object.values(s.memories),
		relationships: Object.values(s.relationships),
		storyState: s.storyStates[story.id],
		transcript
	}, userText, {
		system: 1500,
		character: 2500,
		persona: 1e3,
		lore: 3e3,
		memory: 3e3,
		storyState: 1e3,
		chat: Math.min(12e3, Math.max(2e3, story.contextSize - 8e3)),
		user: 500,
		total: story.contextSize || 24e3
	});
}
function composedFor(story) {
	const s = useNexus.getState();
	const presets = story.presetIds.map((id) => s.presets[id]).filter(Boolean);
	return composePresets(presets);
}
async function sendTurn(storyId, userText, onDelta, signal) {
	const text = userText.trim();
	if (!text) throw new Error("Empty message.");
	const s = useNexus.getState();
	const story = s.stories[storyId];
	if (!story) throw new Error("Story not found.");
	let chat = s.chats[story.chatId];
	if (!chat) throw new Error("Chat not found.");
	const userMsg = {
		id: nid(),
		chatId: chat.id,
		parentId: chat.activeLeafId,
		role: "user",
		content: text,
		createdAt: now()
	};
	const added = addMessage(s.messages, chat, userMsg);
	s.upsertMessage(userMsg);
	s.setChat(added.chat);
	chat = added.chat;
	const assistantId = nid();
	const placeholder = {
		id: assistantId,
		chatId: chat.id,
		parentId: userMsg.id,
		role: "assistant",
		content: "",
		createdAt: now()
	};
	const addedA = addMessage(useNexus.getState().messages, chat, placeholder);
	s.upsertMessage(placeholder);
	s.setChat(addedA.chat);
	s.touchStory(storyId);
	const composed = composedFor(story);
	const { messages, trace } = buildPrompt({
		story,
		pack: packFor(story, text),
		preset: composed,
		userText: text
	});
	s.setTrace(trace);
	s.log("Generation started", {
		model: useNexus.getState().settings.xaiModel,
		preset: composed.name,
		contextTokens: trace.totalTokens,
		memories: trace.memoryIds.length,
		lore: trace.loreIds.length,
		characters: trace.characterIds.length
	});
	try {
		const finalText = await streamLlm(requestFromState(story, messages, composed), (delta) => {
			onDelta(delta);
			useNexus.getState().upsertMessage({
				...placeholder,
				content: delta
			});
		}, signal) || "…";
		useNexus.getState().upsertMessage({
			...placeholder,
			content: finalText
		});
		useNexus.getState().log("Generation completed", { tokensOut: Math.ceil(finalText.length / 4) });
		afterTurn(storyId, userMsg.id, assistantId, text, finalText);
		return { assistantId };
	} catch (err) {
		const message = err instanceof Error ? err.message : "Generation failed.";
		useNexus.getState().log("Generation failed", { error: message }, "error");
		throw err;
	}
}
async function regenerate(storyId, assistantId, onDelta, signal) {
	const s = useNexus.getState();
	const story = s.stories[storyId];
	const original = s.messages[assistantId];
	if (!story || !original || original.role !== "assistant") throw new Error("Nothing to regenerate.");
	const parent = original.parentId;
	const userText = (parent && s.messages[parent]?.role === "user" ? s.messages[parent].content : "") || "Continue.";
	const sibling = {
		id: nid(),
		chatId: original.chatId,
		parentId: original.parentId,
		role: "assistant",
		content: "",
		createdAt: now()
	};
	const chat = s.chats[story.chatId];
	const added = addMessage(s.messages, chat, sibling);
	s.upsertMessage(sibling);
	s.setChat(added.chat);
	const composed = composedFor(story);
	const { messages, trace } = buildPrompt({
		story,
		pack: packFor(story, userText),
		preset: composed,
		userText
	});
	s.setTrace(trace);
	s.log("Regeneration started", { preset: composed.name });
	const full = await streamLlm(requestFromState(story, messages, composed), (delta) => {
		onDelta(delta);
		useNexus.getState().upsertMessage({
			...sibling,
			content: delta
		});
	}, signal);
	useNexus.getState().upsertMessage({
		...sibling,
		content: full || "…"
	});
	return sibling.id;
}
function editUserMessage(storyId, messageId, content) {
	const s = useNexus.getState();
	const story = s.stories[storyId];
	const original = s.messages[messageId];
	if (!story || !original || original.role !== "user") return null;
	const next = {
		id: nid(),
		chatId: original.chatId,
		parentId: original.parentId,
		role: "user",
		content,
		createdAt: now(),
		editedFromId: original.id
	};
	const chat = s.chats[story.chatId];
	const added = addMessage(s.messages, chat, next);
	s.upsertMessage(next);
	s.setChat(added.chat);
	return next;
}
async function afterTurn(storyId, userMessageId, assistantId, userText, assistantText) {
	const s = useNexus.getState();
	const story = s.stories[storyId];
	if (!story) return;
	const settings = s.settings;
	const characters = Object.values(s.characters);
	const storyChars = characters.filter((c) => story.characterIds.includes(c.id));
	const lore = Object.values(s.lore);
	const world = story.worldId ? s.worlds[story.worldId] : void 0;
	const heuristic = extractHeuristic({
		storyId,
		chatId: story.chatId,
		sourceMessageId: assistantId,
		userText,
		assistantText,
		characters: storyChars,
		lore,
		world
	});
	if (story.autoCharacters && settings.autoCharactersGlobal) {
		const found = discoverCharacters({
			text: `${userText}\n${assistantText}`,
			known: characters,
			lore,
			world,
			sourceMessageId: assistantId
		});
		for (const c of found) {
			useNexus.getState().upsertCharacter(c);
			const st = useNexus.getState().stories[storyId];
			if (st && !st.characterIds.includes(c.id)) useNexus.getState().upsertStory({
				...st,
				characterIds: [...st.characterIds, c.id]
			});
			useNexus.getState().log("Character discovered", { name: c.name });
		}
		for (const extra of heuristic.characters) {
			const existing = Object.values(useNexus.getState().characters).find((c) => c.name.toLowerCase() === extra.name.toLowerCase());
			if (existing && extra.facts[0]) useNexus.getState().upsertCharacter(enrichCharacter(existing, extra.facts[0], assistantId));
		}
	}
	if (story.autoMemories && story.memoryMatrix && settings.autoMemoriesGlobal) {
		useNexus.getState().log("Memory extraction started");
		let output = heuristic;
		if (heuristic.memories.some((m) => m.importance >= .7)) try {
			const llmOut = await analyzeWithLlm(story, userText, assistantText);
			if (llmOut) output = llmOut;
		} catch {}
		const incoming = memoriesFromAnalyzer(storyId, story.chatId, assistantId, output, Object.values(useNexus.getState().characters));
		const fresh = dedupeMemories(Object.values(useNexus.getState().memories).filter((m) => m.storyId === storyId), incoming);
		for (const mem of fresh) useNexus.getState().upsertMemory(mem);
		const all = Object.values(useNexus.getState().memories).filter((m) => m.storyId === storyId);
		const cons = consolidatePairEvents(all);
		if (cons && !all.some((m) => m.type === "consequence" && m.content === cons.content)) useNexus.getState().upsertMemory(cons);
		const resolveId = (name) => {
			const n = name.toLowerCase();
			const c = Object.values(useNexus.getState().characters).find((x) => x.name.toLowerCase() === n || x.aliases.some((a) => a.toLowerCase() === n));
			if (c) return c.id;
			return Object.values(useNexus.getState().personas).find((x) => x.name.toLowerCase() === n)?.id;
		};
		const rels = applyRelationshipUpdates(Object.values(useNexus.getState().relationships), storyId, output.relationshipUpdates, resolveId);
		for (const r of rels) useNexus.getState().upsertRelationship(r);
		const presentNames = output.storyStateUpdates.present ?? [];
		const currentState = useNexus.getState().storyStates[storyId];
		const arrivedIds = arrivingIdsFromText(`${userText}\n${assistantText}`, presentNames, resolveId);
		const tracked = Boolean(currentState?.tracked) || (currentState?.presentCharacterIds.length ?? 0) > 0;
		const nextPresent = tracked ? [.../* @__PURE__ */ new Set([...currentState?.presentCharacterIds ?? [], ...arrivedIds])] : arrivedIds.length ? arrivedIds : currentState?.presentCharacterIds ?? [];
		const nextState = mergeStoryState(currentState, output.storyStateUpdates, nextPresent, tracked || arrivedIds.length > 0);
		useNexus.getState().setStoryState(storyId, nextState);
		useNexus.getState().log("Memory extraction completed", {
			candidates: output.memories.length,
			committed: fresh.length
		});
	}
}
async function analyzeWithLlm(story, userText, assistantText) {
	return parseAnalyzerJson(await completeLlm(requestFromState(story, [{
		role: "system",
		content: `Extract structured story memory from a roleplay turn. Return ONLY JSON:
{"memories":[{"type":"event|fact|promise|secret|relationship_event|conflict|goal|discovery","subjects":["Name"],"content":"one sentence","importance":0-1,"confidence":0-1,"relationshipImpact":0-1,"observation":true}],"characters":[{"name":"","facts":[],"confidence":0-1}],"relationshipUpdates":[{"a":"","b":"","state":"","note":"","confidence":0-1}],"storyStateUpdates":{"location":"","scene":"","present":[],"recentEvents":"","emotionalState":""}}
Rules: only clearly supported facts. Observations high confidence. Inferences below 0.5. Ignore trivia (dropped objects, idle motion). Known characters: ${story.characterIds.map((id) => useNexus.getState().characters[id]?.name).filter(Boolean).join(", ") || "none"}.`
	}, {
		role: "user",
		content: `USER:\n${userText}\n\nASSISTANT:\n${assistantText}`
	}], {
		temperature: .2,
		topP: .9,
		maxTokens: 500
	}, true)));
}
function openStoryForCharacter(characterId) {
	const s = useNexus.getState();
	const existing = Object.values(s.stories).filter((st) => st.characterIds.length === 1 && st.characterIds[0] === characterId && !st.worldId).sort((a, b) => b.updatedAt - a.updatedAt)[0];
	if (existing) {
		s.touchStory(existing.id);
		return existing.id;
	}
	const character = s.characters[characterId];
	if (!character) throw new Error("Character not found.");
	const catalog = CHARACTERS.find((c) => c.id === characterId);
	const { story, chat } = createStoryDraft(character.name);
	const next = {
		...story,
		description: character.creatorNotes || character.description,
		characterIds: [characterId],
		personaId: defaultPersonaId(s.personas),
		image: character.image,
		presetIds: ["preset-slow-burn"]
	};
	s.upsertChat(chat);
	s.upsertStory(next);
	ensureGreeting(next, withOpeningChoices(character.exampleDialogue || catalog?.greeting || "", catalog?.openingChoices));
	return next.id;
}
function openStoryForWorld(worldId) {
	const s = useNexus.getState();
	const existing = Object.values(s.stories).filter((st) => st.worldId === worldId).sort((a, b) => b.updatedAt - a.updatedAt)[0];
	if (existing) {
		s.touchStory(existing.id);
		return existing.id;
	}
	const world = s.worlds[worldId];
	if (!world) throw new Error("World not found.");
	const catalog = CHARACTERS.find((c) => c.id === worldId);
	const { story, chat } = createStoryDraft(world.name);
	const bookId = Object.values(s.lorebooks).find((b) => b.id === `book-${worldId}` || b.name === world.name)?.id;
	const next = {
		...story,
		description: catalog?.tagline || world.description.slice(0, 180),
		worldId,
		image: world.image,
		personaId: defaultPersonaId(s.personas),
		lorebookIds: bookId ? [bookId] : [],
		presetIds: ["preset-slow-burn"]
	};
	s.upsertChat(chat);
	s.upsertStory(next);
	ensureGreeting(next, withOpeningChoices(world.greeting || catalog?.greeting || "", catalog?.openingChoices));
	return next.id;
}
function ensureGreeting(story, greeting) {
	const s = useNexus.getState();
	const chat = s.chats[story.chatId];
	if (!chat || chat.rootMessageId) return;
	if (!greeting.trim()) return;
	const msg = {
		id: nid(),
		chatId: chat.id,
		parentId: null,
		role: "assistant",
		content: greeting.trim(),
		createdAt: now()
	};
	const added = addMessage(s.messages, chat, msg);
	s.upsertMessage(msg);
	s.setChat({
		...added.chat,
		canonLeafId: msg.id
	});
}
//#endregion
export { regenerate as a, openStoryForWorld as i, editUserMessage as n, sendTurn as o, openStoryForCharacter as r, stripChoices as s, RichText as t };
