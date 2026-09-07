import { d as nid, f as now } from "./store-Cn-YIMyD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-export-BYXsSic0.js
var PNG_SIGNATURE = [
	137,
	80,
	78,
	71,
	13,
	10,
	26,
	10
];
var CARD_KEYWORDS = [
	"ccv3",
	"chara",
	"character"
];
function isPng(bytes) {
	return PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);
}
function readAscii(bytes, start, length) {
	let out = "";
	for (let i = 0; i < length; i += 1) out += String.fromCharCode(bytes[start + i]);
	return out;
}
function decodeBase64Utf8(value) {
	const binary = atob(value.replace(/\s+/g, ""));
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return new TextDecoder("utf-8").decode(bytes);
}
function readTextChunks(bytes) {
	const chunks = [];
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	let offset = 8;
	while (offset + 8 <= bytes.length) {
		const length = view.getUint32(offset);
		const type = readAscii(bytes, offset + 4, 4);
		const dataStart = offset + 8;
		if (dataStart + length > bytes.length) break;
		if (type === "tEXt") {
			const data = bytes.subarray(dataStart, dataStart + length);
			const nullIndex = data.indexOf(0);
			if (nullIndex > 0) chunks.push({
				keyword: readAscii(data, 0, nullIndex),
				text: new TextDecoder("latin1").decode(data.subarray(nullIndex + 1))
			});
		} else if (type === "iTXt") {
			const data = bytes.subarray(dataStart, dataStart + length);
			const nullIndex = data.indexOf(0);
			if (nullIndex > 0) {
				const keyword = readAscii(data, 0, nullIndex);
				if (data[nullIndex + 1] === 0) {
					let cursor = nullIndex + 3;
					let seen = 0;
					while (cursor < data.length && seen < 2) {
						if (data[cursor] === 0) seen += 1;
						cursor += 1;
					}
					chunks.push({
						keyword,
						text: new TextDecoder("utf-8").decode(data.subarray(cursor))
					});
				}
			}
		} else if (type === "IEND") break;
		offset = dataStart + length + 4;
	}
	return chunks;
}
async function readCharacterCardFromPng(file) {
	const bytes = new Uint8Array(await file.arrayBuffer());
	if (!isPng(bytes)) return {
		ok: false,
		error: "This is not a PNG. Character cards embed their data in PNG files, not JPEG or WebP."
	};
	const chunks = readTextChunks(bytes);
	if (!chunks.length) return {
		ok: false,
		error: "This PNG is a plain image — it has no character-card metadata."
	};
	for (const keyword of CARD_KEYWORDS) {
		const chunk = chunks.find((c) => c.keyword.toLowerCase() === keyword);
		if (!chunk) continue;
		for (const decode of [() => decodeBase64Utf8(chunk.text), () => chunk.text]) try {
			return {
				ok: true,
				json: JSON.parse(decode()),
				keyword: chunk.keyword
			};
		} catch {}
		return {
			ok: false,
			error: `The PNG has a "${chunk.keyword}" chunk, but it is not valid card JSON.`
		};
	}
	return {
		ok: false,
		error: `This PNG has metadata (${chunks.map((c) => c.keyword).join(", ")}) but no character card chunk.`
	};
}
async function blobToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result ?? ""));
		reader.onerror = () => reject(reader.error ?? /* @__PURE__ */ new Error("Could not read image"));
		reader.readAsDataURL(file);
	});
}
var IMPORT_KIND_LABELS = {
	character: "Character card",
	persona: "Persona",
	lorebook: "Lorebook",
	backup: "Nexus backup",
	unknown: "Unrecognized"
};
function emptyBundle(partial = {}) {
	return {
		kind: "unknown",
		title: "",
		format: "",
		summary: [],
		characters: [],
		lore: [],
		lorebooks: [],
		personas: [],
		warnings: [],
		...partial
	};
}
function importPayload(raw, opts = {}) {
	let data;
	try {
		data = JSON.parse(raw);
	} catch {
		return emptyBundle({ warnings: ["File is not valid JSON."] });
	}
	return importValue(data, opts);
}
function importValue(data, opts = {}) {
	const warnings = [];
	if (typeof data !== "object" || data === null) return emptyBundle({ warnings: ["Unexpected JSON shape."] });
	const filename = opts.filename ?? "";
	const detected = opts.forceKind ? {
		kind: opts.forceKind,
		format: "forced"
	} : detectKind(data, filename);
	if (detected.kind === "backup") return importNexusBackup(data, warnings);
	if (detected.kind === "persona") return importPersonaValue(data, filename, warnings);
	if (detected.kind === "lorebook") return importLorebookValue(data, filename, warnings);
	if (detected.kind === "character") return importCharacterValue(data, warnings);
	if (isNexusEnvelope(data)) return importNexusBackup(data, warnings);
	warnings.push("Could not recognize this file as a character card, persona, lorebook, or Nexus backup.");
	return emptyBundle({
		warnings,
		format: detected.format
	});
}
async function importFile(file, opts = {}) {
	const filename = file.name || opts.filename || "file";
	const isPng = file.type === "image/png" || /\.png$/i.test(filename) || file.type === "image/apng";
	const isImage = file.type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(filename);
	if (isPng) {
		const card = await readCharacterCardFromPng(file);
		if (card.ok) {
			const bundle = importValue(card.json, {
				...opts,
				filename
			});
			if (!bundle.image) try {
				bundle.image = await blobToDataUrl(file);
				for (const c of bundle.characters) if (!c.image) c.image = bundle.image;
				for (const p of bundle.personas) if (!p.image) p.image = bundle.image;
			} catch {
				bundle.warnings.push("Card imported, but the PNG itself could not be saved as an avatar.");
			}
			if (!bundle.format) bundle.format = `PNG card (${card.keyword})`;
			else bundle.format = `PNG · ${bundle.format}`;
			return bundle;
		}
		if (isImage) return portraitFromImage(file, filename);
		return emptyBundle({ warnings: [card.error] });
	}
	if (isImage) return portraitFromImage(file, filename);
	return importPayload(await file.text(), {
		...opts,
		filename
	});
}
async function portraitFromImage(file, filename) {
	const image = await blobToDataUrl(file);
	const name = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "New character";
	const t = now();
	const character = {
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
		creatorNotes: "Imported portrait",
		tags: [],
		image,
		origin: "imported",
		observedFacts: [],
		confidence: 1,
		createdAt: t,
		updatedAt: t
	};
	return {
		kind: "character",
		title: name,
		format: "portrait image",
		summary: [`Portrait for ${name}`],
		characters: [character],
		lore: [],
		lorebooks: [],
		personas: [],
		warnings: ["No card metadata in this image — using it as a portrait."],
		image
	};
}
function detectKind(value, filename = "") {
	if (Array.isArray(value)) {
		const first = value[0];
		if (isRecord(first)) {
			if ("keys" in first || "key" in first || "keywords" in first || "primaryKeys" in first) return {
				kind: "lorebook",
				format: "entry array"
			};
			if ("first_mes" in first || "char_name" in first) return {
				kind: "character",
				format: "character array"
			};
		}
		return {
			kind: "unknown",
			format: "array"
		};
	}
	if (!isRecord(value)) return {
		kind: "unknown",
		format: "scalar"
	};
	if (value.format === "nexus" && typeof value.kind === "string") {
		const kind = value.kind === "mixed" ? "backup" : value.kind;
		if (IMPORT_KIND_LABELS[kind]) return {
			kind,
			format: "Nexus document"
		};
	}
	if (value.nexus || value.version && (value.characters || value.personas || value.lorebooks)) return {
		kind: "backup",
		format: "Nexus backup"
	};
	if (typeof value.spec === "string" && String(value.spec).startsWith("chara_card")) return {
		kind: "character",
		format: `SillyTavern ${value.spec}`
	};
	if (isRecord(value.character) || isRecord(value.char)) return {
		kind: "character",
		format: "wrapped character"
	};
	if (value.entries !== void 0 && (Array.isArray(value.entries) || isRecord(value.entries))) return {
		kind: "lorebook",
		format: "lorebook / world info"
	};
	if (isRecord(value.lorebook) || isRecord(value.character_book) || value.originalData) return {
		kind: "lorebook",
		format: "world info"
	};
	if ("first_mes" in value || "firstMes" in value || "char_name" in value || "char_persona" in value || "mes_example" in value) return {
		kind: "character",
		format: "character card"
	};
	if (isRecord(value.persona) || "isDefault" in value || "customInstructions" in value) return {
		kind: "persona",
		format: "persona"
	};
	if (/persona/i.test(filename)) return {
		kind: "persona",
		format: "guessed by filename"
	};
	if (/lorebook|world[-_ ]?info|lore/i.test(filename)) return {
		kind: "lorebook",
		format: "guessed by filename"
	};
	if ("name" in value && ("personality" in value || "description" in value) && !("scenario" in value)) return {
		kind: "persona",
		format: "persona-like object"
	};
	if ("name" in value && ("description" in value || "personality" in value || "scenario" in value)) return {
		kind: "character",
		format: "loose character"
	};
	return {
		kind: "unknown",
		format: "unrecognised JSON"
	};
}
function isNexusEnvelope(data) {
	if (!isRecord(data)) return false;
	if (data.nexus === true || data.kind === "backup" || data.kind === "mixed") return true;
	if (data.format === "nexus" && (data.kind === void 0 || data.kind === "backup" || data.kind === "mixed")) return Array.isArray(data.characters) || Array.isArray(data.stories);
	return Array.isArray(data.characters) && Array.isArray(data.personas) && (data.lorebooks !== void 0 || data.lore !== void 0);
}
function importNexusBackup(obj, warnings) {
	const characters = Array.isArray(obj.characters) ? obj.characters : [];
	const personas = Array.isArray(obj.personas) ? obj.personas : [];
	const lorebooks = Array.isArray(obj.lorebooks) ? obj.lorebooks : [];
	const lore = Array.isArray(obj.lore) ? obj.lore : Array.isArray(obj.loreEntries) ? obj.loreEntries : [];
	if (isRecord(obj.persona) && !personas.length) personas.push(personaFromUnknown(obj.persona, warnings));
	if (!characters.length && !lore.length && !personas.length && !lorebooks.length) warnings.push("Backup contained no characters, personas, or lore.");
	return finalize({
		kind: "backup",
		format: "Nexus backup",
		characters,
		personas: personas.map(normalizePersona),
		lorebooks,
		lore: lore.map((e) => ({
			...e,
			always: e.always ?? false
		})),
		warnings
	});
}
function importCharacterValue(data, warnings) {
	if (Array.isArray(data)) return finalize({
		kind: "character",
		format: "character array",
		characters: data.map((item) => cardToCharacter(unwrapCard(item), warnings)),
		warnings
	});
	const card = unwrapCard(data);
	const character = cardToCharacter(card, warnings);
	const fromBook = characterBookToLore(isRecord(data) && (data.character_book || data.lorebook) || card.character_book || card.lorebook, warnings, `${character.name} lore`);
	return finalize({
		kind: "character",
		format: "character card",
		characters: [character],
		lorebooks: fromBook.lorebooks,
		lore: fromBook.lore,
		warnings,
		image: character.image
	});
}
function importPersonaValue(data, filename, warnings) {
	const record = isRecord(data) ? data : {};
	const payload = isRecord(record.persona) ? record.persona : isRecord(record.data) ? record.data : record;
	if (Array.isArray(record.personas)) return finalize({
		kind: "persona",
		format: "persona list",
		personas: record.personas.map((p) => personaFromUnknown(p, warnings)),
		warnings
	});
	const persona = personaFromUnknown(payload, warnings);
	if (!persona.name && filename) persona.name = filename.replace(/\.[^.]+$/, "");
	return finalize({
		kind: "persona",
		format: "persona",
		personas: [persona],
		warnings,
		image: persona.image
	});
}
function importLorebookValue(data, filename, warnings) {
	if (Array.isArray(data)) {
		const book = blankLorebook(filename.replace(/\.[^.]+$/, "") || "Imported lorebook");
		const lore = data.map((e) => loreFromUnknown(e, book.id)).filter((x) => !!x);
		return finalize({
			kind: "lorebook",
			format: "entry array",
			lorebooks: [book],
			lore,
			warnings
		});
	}
	const obj = isRecord(data) ? data : {};
	const nested = isRecord(obj.lorebook) ? obj.lorebook : isRecord(obj.data) ? obj.data : obj;
	const book = blankLorebook(str(nested.name) || str(obj.name) || filename.replace(/\.[^.]+$/, "") || "Imported lorebook");
	book.description = str(nested.description) || str(obj.description);
	book.global = nested.global === true || obj.global === true;
	const entries = asEntryList(nested.entries ?? obj.entries ?? obj.originalData).map((e) => loreFromUnknown(e, book.id)).filter((x) => !!x);
	if (!entries.length) warnings.push("Lorebook had no usable entries.");
	return finalize({
		kind: "lorebook",
		format: "lorebook",
		lorebooks: [book],
		lore: entries,
		warnings
	});
}
function unwrapCard(input) {
	if (!isRecord(input)) return {};
	if (isRecord(input.data) && typeof input.spec === "string") return input.data;
	for (const key of ["character", "char"]) if (isRecord(input[key])) return input[key];
	return input;
}
function cardToCharacter(card, warnings) {
	const name = str(card.name) || str(card.char_name) || "Imported character";
	if (!str(card.name) && !str(card.char_name)) warnings.push("Character card was missing a name.");
	const t = now();
	const tags = Array.isArray(card.tags) ? card.tags.map(String) : [];
	return {
		id: nid(),
		name,
		aliases: splitList(str(card.alternate_names) || str(card.nicknames)),
		description: str(card.description) || str(card.char_persona),
		personality: str(card.personality),
		appearance: str(card.appearance) || str(card.looks),
		background: str(card.background) || str(card.scenario),
		history: str(card.history) || str(card.backstory),
		behavior: str(card.personality),
		speechStyle: str(card.speaking_style) || str(card.speech),
		likes: str(card.likes),
		dislikes: str(card.dislikes),
		fears: str(card.fears),
		goals: str(card.goals),
		secrets: str(card.secrets),
		abilities: str(card.abilities),
		scenario: str(card.scenario),
		exampleDialogue: str(card.mes_example) || str(card.first_mes) || str(card.greeting),
		systemInstructions: str(card.system_prompt) || str(card.system),
		creatorNotes: str(card.creator_notes) || str(card.creatorcomment),
		tags,
		image: str(card.avatar) || void 0,
		origin: "imported",
		observedFacts: [],
		confidence: 1,
		createdAt: t,
		updatedAt: t
	};
}
function personaFromUnknown(value, warnings) {
	const card = isRecord(value) ? value : {};
	const name = str(card.name) || str(card.displayName) || str(card.display_name);
	if (!name) warnings.push("Persona was missing a name.");
	const t = now();
	return {
		id: nid(),
		name: name || "Imported persona",
		appearance: str(card.appearance),
		personality: str(card.personality) || str(card.description),
		background: str(card.background) || str(card.backstory),
		behavior: str(card.behavior),
		speechStyle: str(card.speechStyle) || str(card.speech_style) || str(card.speaking_style),
		preferences: str(card.preferences) || str(card.customInstructions) || str(card.custom_instructions),
		abilities: str(card.abilities),
		tags: Array.isArray(card.tags) ? card.tags.map(String) : [],
		image: str(card.avatar) || str(card.image) || void 0,
		isDefault: card.isDefault === true,
		createdAt: t,
		updatedAt: t
	};
}
function normalizePersona(persona) {
	return {
		...persona,
		tags: persona.tags ?? [],
		isDefault: persona.isDefault ?? false
	};
}
function characterBookToLore(book, warnings, fallbackName) {
	if (!book) return {
		lorebooks: [],
		lore: []
	};
	const record = isRecord(book) ? book : Array.isArray(book) ? { entries: book } : {};
	const lorebook = blankLorebook(str(record.name) || fallbackName);
	const entries = asEntryList(record.entries).map((e) => loreFromUnknown(e, lorebook.id)).filter((x) => !!x);
	if (!entries.length) {
		warnings.push("Character card included a lorebook, but none of the entries had content.");
		return {
			lorebooks: [],
			lore: []
		};
	}
	return {
		lorebooks: [lorebook],
		lore: entries
	};
}
function loreFromUnknown(entry, lorebookId) {
	if (!entry || typeof entry !== "object") return null;
	const e = entry;
	const content = str(e.content) || str(e.entry) || str(e.text);
	const title = str(e.comment) || str(e.title) || str(e.name) || str(e.uid) || "Lore entry";
	if (!content) return null;
	const keysRaw = e.keys ?? e.key ?? e.keywords ?? e.primaryKeys;
	const keywords = Array.isArray(keysRaw) ? keysRaw.map(String) : typeof keysRaw === "string" ? splitList(keysRaw) : [];
	const always = e.constant === true || e.always === true || e.activation === "always";
	const preventRecursion = e.excludeRecursion === true || e.preventRecursion === true || e.prevent_recursion === true;
	return {
		id: nid(),
		lorebookId,
		title,
		content,
		keywords,
		aliases: Array.isArray(e.aliases) ? e.aliases.map(String) : [],
		category: str(e.category) || "general",
		priority: num(e.priority, 10),
		importance: num(e.importance, .5),
		enabled: e.enabled !== false && e.disable !== true,
		always,
		preventRecursion,
		createdAt: now()
	};
}
function blankLorebook(name) {
	const t = now();
	return {
		id: nid(),
		name,
		description: "",
		tags: [],
		enabled: true,
		global: false,
		createdAt: t,
		updatedAt: t
	};
}
function asEntryList(entries) {
	if (Array.isArray(entries)) return entries;
	if (isRecord(entries)) return Object.values(entries);
	return [];
}
function finalize(bundle) {
	const characters = bundle.characters ?? [];
	const personas = bundle.personas ?? [];
	const lore = bundle.lore ?? [];
	const lorebooks = bundle.lorebooks ?? [];
	const title = bundle.title || characters[0]?.name || personas[0]?.name || lorebooks[0]?.name || "Import";
	const summary = [];
	if (characters.length) summary.push(`${characters.length} character${characters.length === 1 ? "" : "s"}`);
	if (personas.length) summary.push(`${personas.length} persona${personas.length === 1 ? "" : "s"}`);
	if (lorebooks.length) summary.push(`${lorebooks.length} lorebook${lorebooks.length === 1 ? "" : "s"}`);
	if (lore.length) summary.push(`${lore.length} lore ${lore.length === 1 ? "entry" : "entries"}`);
	return emptyBundle({
		...bundle,
		kind: bundle.kind ?? "unknown",
		title,
		format: bundle.format ?? "",
		summary,
		characters,
		personas,
		lore,
		lorebooks
	});
}
function isRecord(v) {
	return !!v && typeof v === "object" && !Array.isArray(v);
}
function str(v) {
	return typeof v === "string" ? v : "";
}
function num(v, fallback) {
	return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
function splitList(v) {
	if (!v) return [];
	return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
}
function exportBackup(bundle) {
	return JSON.stringify({
		format: "nexus",
		version: 1,
		nexus: true,
		kind: "backup",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...bundle
	}, null, 2);
}
function exportPersona(persona) {
	return JSON.stringify({
		format: "nexus",
		kind: "persona",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		personas: [persona]
	}, null, 2);
}
function exportLorebook(book, entries) {
	return JSON.stringify({
		format: "nexus",
		kind: "lorebook",
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		lorebooks: [book],
		loreEntries: entries,
		name: book.name,
		description: book.description,
		entries: entries.map((e) => ({
			comment: e.title,
			content: e.content,
			keys: e.keywords,
			enabled: e.enabled,
			constant: e.always,
			priority: e.priority
		}))
	}, null, 2);
}
function samplePersonaJson() {
	return JSON.stringify({
		format: "nexus",
		kind: "persona",
		personas: [{
			name: "Ash Calder",
			personality: "Quiet, dry humor, notices details other people skip.",
			appearance: "Dark coat, ink-stained fingers, a voice that rarely rises.",
			background: "An original character who walks into canon stories as a guest, not a rewrite.",
			speechStyle: "Short sentences. Asks more than they tell.",
			preferences: "Address me as Ash. Do not narrate my thoughts unless I write them.",
			tags: ["oc"],
			isDefault: false
		}]
	}, null, 2);
}
function sampleLorebookJson() {
	return JSON.stringify({
		name: "Ashfell",
		description: "A mountain city that keeps its winters.",
		entries: [{
			comment: "Ashfell",
			keys: [
				"Ashfell",
				"the city",
				"north gate"
			],
			content: "Ashfell is a walled mountain city. The north gate closes at dusk and does not open for strangers."
		}, {
			comment: "House rule",
			keys: [],
			constant: true,
			content: "Names given at the Ember are kept. Do not reveal a guest's true name unless they do."
		}]
	}, null, 2);
}
function downloadJson(filename, contents) {
	const blob = new Blob([contents], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { exportPersona as a, sampleLorebookJson as c, exportLorebook as i, samplePersonaJson as l, downloadJson as n, importFile as o, exportBackup as r, importPayload as s, IMPORT_KIND_LABELS as t };
