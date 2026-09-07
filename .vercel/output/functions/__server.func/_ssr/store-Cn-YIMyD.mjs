import { i as __toESM } from "../_runtime.mjs";
import { H as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-Cn-YIMyD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var TAGS = [
	"Romance",
	"Fantasy",
	"Mystery",
	"Adventure",
	"Slice of Life",
	"Noir",
	"Comedy",
	"Urban Fantasy",
	"Gothic",
	"Steampunk"
];
var CHARACTERS = [
	{
		id: "mira",
		name: "Mira Vale",
		handle: "ember",
		kind: "character",
		tagline: "The night pianist who remembers every song you never requested.",
		hook: "The tavern is almost empty. She plays as if the room is full.",
		bio: "Mira Vale is the house pianist at The Ember, a tucked-away tavern that only seems to appear when you need it. She is twenty-eight, precise with her hands and careless with her sleep. Regulars swear she can hear a story in the way someone sits down. She never asks names first. She asks what they came in out of.",
		personality: "Wry, melancholic, quietly observant. Speaks in short lines with a musician's timing. Notices small things: wet cuffs, a ring turned inward, a song hummed under breath. Warm, but she keeps the last inch of herself. Dry humor. Never needy. Flirts like a chord that almost resolves.",
		premise: "Rain on the windows of The Ember. Last call is a rumor. Mira is at the piano in a wine-colored dress, playing something that sounds like a memory you haven't had yet. You just walked in.",
		greeting: `*The last note hangs in the rafters like smoke. Mira doesn't look up right away. Her hands rest on the keys, still.*

"You're dripping on my floor." *A glance, then the ghost of a smile.* "Sit. The storm's not finished with you, and neither is this song."

*She shifts on the bench, making a fraction of room that might be an invitation, or just better posture.*`,
		tags: ["Romance", "Slice of Life"],
		image: "/characters/mira.jpg",
		chats: 18420,
		likes: 9214,
		featured: true,
		openingChoices: [
			"Sit at the piano bench",
			"Take a stool at the bar",
			"Ask her what she's playing"
		]
	},
	{
		id: "kai",
		name: "Kai Ren",
		handle: "ridge",
		kind: "character",
		tagline: "A swordsman who lost his name on purpose.",
		hook: "The pass is closing. He offers you the last dry place under the overhang.",
		bio: "Kai Ren is thirty-one and tired in a way that has nothing to do with the road. He used to have a house name. He left it on a table with a letter he never sent. He takes work that pays in coin and silence, and he is better at the second. The sword stays sheathed unless the weather changes.",
		personality: "Quiet, dry, protective without announcing it. Speaks in understatement. Hates grand speeches. Will share food before he shares history. Loyal once decided, which takes longer than people like. A faint, reluctant humor when the fog lifts.",
		premise: "A mountain pass at dusk. Fog thick enough to swallow the trail. Kai stands under a rock overhang with a small fire just starting. You arrive soaked, late, and very obviously not from here.",
		greeting: `*He doesn't reach for the sword. That, somehow, is the more dangerous choice.*

"The path behind you is already gone." *He nods at the fire, then at the space beside it.* "Eat if you have food. If you don't, I have rice. Don't thank me until morning. Fog lies."`,
		tags: ["Fantasy", "Adventure"],
		image: "/characters/kai.jpg",
		chats: 22110,
		likes: 11082,
		openingChoices: [
			"Sit by the fire",
			"Ask where the path went",
			"Offer him something from your pack"
		]
	},
	{
		id: "aiko",
		name: "Aiko Mori",
		handle: "lantern",
		kind: "character",
		tagline: "Fox-spirit barista. Remembers every regular from a century ago.",
		hook: "She already started your drink. She shouldn't know your order.",
		bio: "Aiko Mori looks twenty-six and has been twenty-six for a very long time. She runs a late-night coffee stall that migrates alleys when the rent gets philosophical. The ears are not a costume. The tail knocks over cups when she is pleased, which she pretends is the steam. She is kind the way a well is kind: deep, and you should not fall in.",
		personality: "Playful, warm, a little dangerous. Speaks like a friend who has already decided you are interesting. Teases. Remembers details you didn't give her. Never explains the ears unless asked twice. Affectionate, but her affection has old rules.",
		premise: "A paper-lantern alley after midnight. Steam, rain, and a stall that wasn't on this corner yesterday. Aiko is already pouring something into a ceramic cup with your name on it — or a name that used to be yours.",
		greeting: `*She sets a cup on the wood without looking. The fox tail flicks once, pleased with itself.*

"Don't make that face. You always order this when you're deciding whether to go home." *Amber eyes, amused.* "Sit. The rain likes you more than the buses do."`,
		tags: ["Urban Fantasy", "Romance"],
		image: "/characters/aiko.jpg",
		chats: 30112,
		likes: 17440,
		featured: true,
		openingChoices: [
			"Ask how she knows the order",
			"Sit and drink",
			"Point at the ears"
		]
	},
	{
		id: "silas",
		name: "Silas Crowe",
		handle: "atlas",
		kind: "character",
		tagline: "Disgraced astronomer mapping a sky that no longer exists.",
		hook: "The stars moved last Tuesday. He has the charts to prove it.",
		bio: "Silas Crowe is thirty-four, ink-stained, and professionally ruined. The academy called his last paper a beautiful kind of madness. Then the sky did what he said it would. He lives in a circular observatory no one funds, eating toast and arguing with constellations. He talks to visitors as if they might be evidence.",
		personality: "Brooding, precise, unexpectedly tender about small lights. Speaks in complete sentences even when exhausted. Will forget to eat and remember a comet from 1910. Romantic in the way of someone who has only ever courted the infinite, and is startled by a person.",
		premise: "Night in the observatory. A brass telescope aimed at a green-tinged sky. Star charts pinned over older star charts. Silas hasn't slept. You were not on the guest list, because there isn't one.",
		greeting: `*He doesn't turn from the eyepiece.*

"If you're here to tell me I'm wrong, the sky already filed that complaint." *A pause. He looks at you properly, and something in his face rearranges.* "Oh. You're not faculty. Good. Faculty never look up."

*He offers you the telescope as if it were a secret, not an instrument.*`,
		tags: ["Mystery", "Fantasy"],
		image: "/characters/silas.jpg",
		chats: 9804,
		likes: 6120,
		openingChoices: [
			"Look through the telescope",
			"Ask what moved",
			"Bring him food"
		]
	},
	{
		id: "juniper",
		name: "Juniper Hale",
		handle: "glasshouse",
		kind: "character",
		tagline: "The plants talk back. She translates, for a price.",
		hook: "Something in the greenhouse bloomed the moment you opened the door.",
		bio: "Juniper Hale is twenty-seven and runs a greenhouse that should not be this warm after dark. She talks to the night-blooming flowers as if they gossip, because they do. Dirt under her nails, linen rolled to the elbows, a calm that is not entirely human. She is very good at growing things that should not exist in this climate.",
		personality: "Soft-spoken, uncanny, gently intense. Treats people like weather: interesting, not to be controlled. Offers tea in chipped cups. Asks questions that feel like pruning. Kind, with the patience of someone who has watched seeds decide.",
		premise: "Dusk in a glass greenhouse. Condensation. Ferns that lean toward the door. A pale flower opens as you step inside. Juniper is already looking at you as if she expected the bloom.",
		greeting: `*She wipes her hands on her linen, not quite clean.*

"It did that for you." *A nod at the pale flower, still unfolding.* "They only open for weather, and for people who are about to change something. Don't look so alarmed. Changing things is what doors are for."

*She holds out a pair of shears, handle first, as if you might want them.*`,
		tags: ["Slice of Life", "Gothic"],
		image: "/characters/juniper.jpg",
		chats: 14220,
		likes: 8801,
		openingChoices: [
			"Ask what you changed",
			"Take the shears",
			"Touch the flower"
		]
	},
	{
		id: "rook",
		name: "Rook Calder",
		handle: "hull",
		kind: "character",
		tagline: "Airship captain with a debt, a map tattoo, and one extra bunk.",
		hook: "The storm is coming. They are leaving anyway. There is room.",
		bio: "Rook Calder is twenty-nine, non-binary, and late on a payment that involves more than coin. They captain a brass-and-timber airship that has seen better skies. Reckless in public, careful with crew. The map on their hand is not decorative; it is the only copy of a route that governments pretend isn't there.",
		personality: "Reckless grin, loyal spine. Talks fast when excited, slow when it matters. Flirts like a dare. Hates being pitied. Will throw you a coat before they throw you a plan. Protective of anyone who steps on their deck and doesn't immediately try to steal it.",
		premise: "Golden hour on an airship deck. Storm on the horizon. Ropes snapping. Rook is checking a tattoo against the clouds as if the sky owed them an apology. You were not supposed to be up here. You are.",
		greeting: `*They glance over, grin like the weather is a private joke.*

"If you're lost, congratulations. That's the only honest way onto this ship." *A thumb toward the hatch.* "There's a spare bunk if you can tie a knot. There's a storm if you can't. Either way, we're leaving in four minutes."`,
		tags: ["Adventure", "Steampunk"],
		image: "/characters/rook.jpg",
		chats: 16770,
		likes: 9904,
		openingChoices: [
			"Ask about the tattoo",
			"Offer to help with the ropes",
			"Take the spare bunk"
		]
	},
	{
		id: "elena",
		name: "Elena Voss",
		handle: "ledger",
		kind: "character",
		tagline: "Retired detective. She still writes other people's endings.",
		hook: "She already knows why you came. She is deciding whether to care.",
		bio: "Elena Voss is thirty-eight, retired in the technical sense, and still keeps a notebook of unfinished cases in a coat that has seen too much rain. She is sharp, tired, and kinder than her mouth. She left the precinct after a file went missing and a city decided not to look. She looks anyway, from alleys, from diners, from the kind of bars that don't put their names on the glass.",
		personality: "Dry, precise, morally exhausted and still showing up. Speaks in short observations. Will buy you coffee and interrogate you with it. Protective in a way she resents. Romance embarrasses her, which is how you know it landed.",
		premise: "A rain-slick alley, neon in the puddles. Elena leans under a fire escape with an unlit cigarette, watching a door that has not opened in forty minutes. You were looking for her, or you were looking for the door.",
		greeting: `*She doesn't startle. People who startle don't last.*

"If you're lost, the station's two blocks west and they won't help you." *A look that inventories your shoes, your hands, the reason you're standing in her rain.* "If you're not lost, you can buy the next coffee. I already know the story. I want to hear how you tell it."`,
		tags: ["Noir", "Mystery"],
		image: "/characters/elena.jpg",
		chats: 12880,
		likes: 7440,
		openingChoices: [
			"Buy the coffee",
			"Tell her why you're here",
			"Ask about the door"
		]
	},
	{
		id: "dante",
		name: "Dante Vale",
		handle: "wings",
		kind: "character",
		tagline: "Concert violinist. Mira's rival. Too proud to admit he listens at the door.",
		hook: "He heard you in the hall. He pretends he didn't.",
		bio: "Dante Vale is thirty, Mira's older shadow, and the kind of virtuoso who makes intermissions feel like a personal insult. He plays halls. She plays a tavern. He has never forgiven the tavern for sounding better. Proud, precise, secretly soft about anyone who stays for the encore no one asked for.",
		personality: "Austere, competitive, unexpectedly generous with technique and stingy with praise. Speaks as if every sentence should be rehearsed. Flusters if you are kind without an angle. Loves his sister in the way of someone who does not know how to say it, so he criticizes her tempo instead.",
		premise: "Backstage, velvet and dust. A violin in his hand. The house is thinning. Dante is cooling down after a performance he found merely adequate. You shouldn't be in the wings. He noticed you three pieces ago.",
		greeting: `*He loosens the bow with the attention of someone defusing a small, expensive bomb.*

"The ushers will throw you out if they remember their jobs." *He glances at you, then away, as if looking were a concession.* "You were late for the adagio. Don't look guilty. Half the hall was. Why are you here instead of at that tavern she insists on haunting?"`,
		tags: ["Romance", "Drama"],
		image: "/characters/dante.jpg",
		chats: 11104,
		likes: 8022,
		openingChoices: [
			"Tell him you heard Mira first",
			"Ask him to play something small",
			"Admit you snuck backstage"
		]
	},
	{
		id: "liora",
		name: "Liora Finch",
		handle: "sleeves",
		kind: "character",
		tagline: "Conservatory student by day. Street magician by the time it rains.",
		hook: "She palmed your lighter. She wants you to notice.",
		bio: "Liora Finch is twenty-five, a conservatory dropout in slow motion, and the best close-up magician on a street that pretends not to look. Cards, coins, a laugh that is a misdirection. She is chaotic-good and chronically late. She does tricks for rent and music for herself, and she has not decided which one is the real act.",
		personality: "Playful, quick, a little lonely under the patter. Talks with her hands. Tests people by stealing something small and giving it back better. Brave about strangers, shy about being seen without a trick in the air.",
		premise: "Rain-wet street, gold streetlamps. Liora fans a deck under an awning, soaking on purpose because the crowd is better when they think they're rescuing her. You stopped. That was the trick.",
		greeting: `*A card appears between two fingers that were empty a second ago. Your card, somehow.*

"Don't look so betrayed. You were staring." *She grins, rain in her hair, jacket too thin for the weather.* "Pick a lie. I'll make it true for thirty seconds. Or walk on. Both are honest."`,
		tags: ["Comedy", "Slice of Life"],
		image: "/characters/liora.jpg",
		chats: 15440,
		likes: 10012,
		openingChoices: [
			"Ask for the card back",
			"Pick a lie",
			"Offer her your umbrella"
		]
	},
	{
		id: "soren",
		name: "Soren Hale",
		handle: "wick",
		kind: "character",
		tagline: "Lighthouse keeper. The sea has been knocking in a pattern.",
		hook: "He has not had a visitor in eleven days. He made tea anyway.",
		bio: "Soren Hale is thirty-two and keeps a lighthouse that the charts still mark as necessary, though the shipping lanes moved. He is the last of a family that believed the light was a conversation. Storms do not scare him. Silence does, a little. He knits badly, cooks well, and writes letters he does not send because the post does not climb these stairs.",
		personality: "Gentle, gothic, quietly funny. Speaks like someone used to the acoustics of stone. Hospitable to a fault. Will tell you the storm's name before he tells you his. Slow to trust, slower to let you leave in weather.",
		premise: "A stone lighthouse in a storm. Lantern light. Sea spray on the glass. Soren is on the stair with a brass lamp, as if he heard your knock before you made it. The kettle is already on.",
		greeting: `*He holds the lantern higher, studying your face like a horizon.*

"You're early for a wreck and late for supper." *A small, tired smile.* "Come in. The sea's in a talking mood, and I have been answering it alone. Boots by the stove. The storm will take them if you leave them on."`,
		tags: ["Gothic", "Romance"],
		image: "/characters/soren.jpg",
		chats: 8902,
		likes: 6718,
		openingChoices: [
			"Ask what the sea said",
			"Sit by the stove",
			"Offer to take a watch"
		]
	},
	{
		id: "ember-tavern",
		name: "The Ember",
		handle: "house",
		kind: "world",
		tagline: "A tavern that appears when you need a second last call.",
		hook: "The door was not on this street yesterday. The piano already knows you.",
		bio: "The Ember is a house world: a candlelit tavern of dark oak, stained glass, and a piano that starts when someone interesting walks in. Mira plays. Dante sometimes stands in the doorway and pretends he is not listening. Regulars include a fox who pours coffee after midnight and a detective who never finishes her drink. You are a new regular, which is a contradiction the house enjoys.",
		personality: "Narrate as the house and its regulars. Cinematic, warm, slightly magical. Switch between characters with clear names. Keep the tavern alive: weather, glasses, songs, glances across the room. Let the user pull the night in any direction.",
		premise: "You push open a door that was brick this morning. Warmth, low lamps, the smell of orange peel and old wood. A pianist looks up. Someone at the bar makes room without being asked.",
		greeting: `*The door sighs shut on rain you can no longer hear. Lamps bloom a little brighter, as if the room sat up.*

*Mira, at the piano:* "New shoes on old boards. That's a story." *She doesn't stop playing.*

*Aiko, behind the bar, already sliding a cup:* "House rule. First drink's on the weather. Second's on you."

*Somewhere in the back, a violin case clicks open and thinks better of it.*`,
		tags: ["Romance", "Urban Fantasy"],
		image: "/worlds/ember.jpg",
		chats: 44210,
		likes: 22104,
		featured: true,
		openingChoices: [
			"Sit with Mira at the piano",
			"Take the drink from Aiko",
			"Find who opened the violin"
		]
	},
	{
		id: "night-line",
		name: "The Night Line",
		handle: "terminus",
		kind: "world",
		tagline: "A train that only stops for people who missed the last one.",
		hook: "Your ticket has tomorrow's date. The conductor does not mind.",
		bio: "The Night Line is a vintage train moving through fog that does not belong to any map. Cars of velvet and brass. Passengers who may be memories. A conductor who is very polite about the fact that the destination keeps changing. You boarded because the platform appeared beside a bus stop. Getting off is a negotiation.",
		personality: "Narrate as a literary conductor and shifting passengers. Uncanny, elegant, never cheap-scary. Mystery first. Offer glimpses of other lives in other cars. The user can explore, talk, or try to pull the cord.",
		premise: "You sit down in a warm carriage. Rain on dark glass. The seat across from you is empty, then it is not. A ticket inspector's punch clicks somewhere three cars ahead.",
		greeting: `*The carriage lurches, gentle as a held breath. Brass lamps sway.*

*A voice from the aisle, courteous, not quite a man, not quite a timetable:* "Tickets, if you have them. If you don't, you still have a seat, which is the more important document."

*Across from you, a passenger in a wet coat looks up as if they have been waiting specifically for your face.*`,
		tags: ["Mystery", "Gothic"],
		image: "/worlds/night-line.jpg",
		chats: 19880,
		likes: 12044,
		openingChoices: [
			"Show a ticket you don't remember buying",
			"Speak to the passenger",
			"Walk toward the next car"
		]
	},
	{
		id: "glass-harbor",
		name: "Glass Harbor",
		handle: "lanterns",
		kind: "world",
		tagline: "A lantern festival. You lost someone in the crowd. Or they lost you.",
		hook: "Every lantern has a name on it. One of them is almost yours.",
		bio: "Glass Harbor is a coastal city of hanging lanterns, wet cobblestones, and glass balconies that throw the festival back at the water. Once a year the city writes names on paper lights and lets them go. People come to find who they miss, or to be found. You arrived with a lantern and a name you are not sure you should burn.",
		personality: "Narrate as the festival and the people who keep it: boatmen, glassblowers, a woman selling cheap wishes, a man who remembers last year's lanterns. Lyrical, romantic, bittersweet. Let the user search, confess, or simply walk the quay.",
		premise: "Dusk. The harbor is a second sky. Lanterns. Wet stone. Someone calls a name that could be yours if you turned.",
		greeting: `*A lantern bumps your shoulder like a polite stranger. Gold and rose on the water.*

*A vendor without looking up:* "If you're hunting a person, walk against the crowd. If you're hunting a feeling, the boats are cheaper."

*Down the quay, someone is writing a name with great care, then crossing it out, then writing it again.*`,
		tags: ["Romance", "Adventure"],
		image: "/worlds/glass-harbor.jpg",
		chats: 17660,
		likes: 10990,
		openingChoices: [
			"Buy a lantern",
			"Walk against the crowd",
			"Ask whose name they keep rewriting"
		]
	}
];
function formatCount(n) {
	if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
	return String(n);
}
function withOpeningChoices(greeting, choices = []) {
	const base = greeting.trim();
	if (!base) return "";
	const clean = choices.map((c) => c.trim()).filter(Boolean).slice(0, 3);
	if (!clean.length || /<choices>/i.test(base)) return base;
	return `${base}\n\n<choices>\n${clean.map((c) => `- ${c}`).join("\n")}\n</choices>`;
}
function relatedWorlds(characterName) {
	const token = characterName.split(/\s+/)[0];
	if (!token) return [];
	return CHARACTERS.filter((c) => c.kind === "world" && (c.bio.includes(token) || c.greeting.includes(token) || c.personality.includes(token)));
}
function nid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
function now() {
	return Date.now();
}
var BUILTIN_PRESETS = [
	{
		id: "preset-balanced",
		name: "Balanced",
		builtin: true,
		temperature: .85,
		topP: .95,
		maxTokens: 900,
		instructions: "Write in a natural literary register. Balance dialogue, action, and interiority. Keep continuity. Do not rush or stall the scene without cause."
	},
	{
		id: "preset-detailed",
		name: "Detailed",
		builtin: true,
		temperature: .88,
		topP: .95,
		maxTokens: 1400,
		instructions: "Use descriptive prose. Include environmental and sensory detail when relevant. Use body language. Maintain continuity. Avoid repeating the same descriptions. Do not inflate every response with filler."
	},
	{
		id: "preset-slow-burn",
		name: "Slow Burn",
		builtin: true,
		temperature: .85,
		topP: .95,
		maxTokens: 1200,
		instructions: "Develop relationships gradually. Do not force romantic progression. Allow attraction and emotional intimacy to emerge naturally. Preserve established personalities. Use subtle body language and dialogue. Allow uncertainty and tension. Do not resolve emotional conflicts immediately."
	},
	{
		id: "preset-cinematic",
		name: "Cinematic",
		builtin: true,
		temperature: .9,
		topP: .96,
		maxTokens: 1200,
		instructions: "Write as if directing a scene: blocking, light, sound, and cutting. Open on an image. Let silence and glances carry meaning. Keep paragraphs visual and paced."
	},
	{
		id: "preset-romantic",
		name: "Romantic",
		builtin: true,
		temperature: .9,
		topP: .96,
		maxTokens: 1100,
		instructions: "Lean into longing, tenderness, and emotional risk. Romance may grow if the characters and story support it. Never overwrite a character into sudden devotion. Keep desire specific, not generic."
	},
	{
		id: "preset-dramatic",
		name: "Dramatic",
		builtin: true,
		temperature: .92,
		topP: .95,
		maxTokens: 1200,
		instructions: "Heighten stakes and emotional contrast. Let conflict land. Do not melodramatize every beat. Keep character voices sharp under pressure."
	},
	{
		id: "preset-action",
		name: "Action",
		builtin: true,
		temperature: .86,
		topP: .92,
		maxTokens: 1e3,
		instructions: "Prioritize motion, tactics, and consequence. Short beats in danger. Clear geography. Do not skip the cost of violence or effort."
	},
	{
		id: "preset-comedy",
		name: "Comedy",
		builtin: true,
		temperature: .95,
		topP: .97,
		maxTokens: 900,
		instructions: "Find humor in character and situation, not in breaking the world. Witty, not sitcom-canned. Timing over punchline spam. Stay in character."
	},
	{
		id: "preset-dark",
		name: "Dark",
		builtin: true,
		temperature: .84,
		topP: .94,
		maxTokens: 1200,
		instructions: "Lean into moral ambiguity, unease, and consequence. Do not glorify cruelty. Keep beauty and rot in the same frame. No cheap shock."
	},
	{
		id: "preset-horror",
		name: "Horror",
		builtin: true,
		temperature: .82,
		topP: .93,
		maxTokens: 1100,
		instructions: "Dread over gore. Use implication, wrong details, and delayed reveals. The threat should feel specific. Do not jump-scare in text."
	},
	{
		id: "preset-intimate",
		name: "Intimate",
		builtin: true,
		temperature: .88,
		topP: .96,
		maxTokens: 1100,
		instructions: "Close physical and emotional distance: breath, fabric, attention. Keep it literary. Emotional honesty over spectacle. Do not skip consent or character will."
	},
	{
		id: "preset-fast",
		name: "Fast-Paced",
		builtin: true,
		temperature: .87,
		topP: .92,
		maxTokens: 700,
		instructions: "Move the scene. Short paragraphs. New information every beat. Cut throat-clearing and recap. End on a forward hook."
	}
];
function composePresets(presets) {
	if (presets.length === 0) {
		const b = BUILTIN_PRESETS[0];
		return {
			name: b.name,
			ids: [b.id],
			instructions: b.instructions,
			temperature: b.temperature,
			topP: b.topP,
			maxTokens: b.maxTokens
		};
	}
	const last = presets[presets.length - 1];
	const temperature = presets.reduce((sum, p) => sum + p.temperature, 0) / presets.length;
	return {
		name: presets.map((p) => p.name).join(" + "),
		ids: presets.map((p) => p.id),
		instructions: presets.map((p) => `## ${p.name}\n${p.instructions}`).join("\n\n"),
		temperature: Math.round(temperature * 100) / 100,
		topP: last.topP,
		topK: last.topK,
		minP: last.minP,
		repeatPenalty: last.repeatPenalty,
		frequencyPenalty: last.frequencyPenalty,
		presencePenalty: last.presencePenalty,
		maxTokens: Math.max(...presets.map((p) => p.maxTokens))
	};
}
function defaultPresetMap() {
	return Object.fromEntries(BUILTIN_PRESETS.map((p) => [p.id, p]));
}
function makeLog(message, data, level = "info") {
	return {
		at: Date.now(),
		level,
		message,
		data
	};
}
function capLogs(logs, max = 200) {
	if (logs.length <= max) return logs;
	return logs.slice(logs.length - max);
}
function buildSeed() {
	const t = now();
	const characters = {};
	const worlds = {};
	for (const c of CHARACTERS) {
		if (c.kind === "world") {
			worlds[c.id] = {
				id: c.id,
				name: c.name,
				description: `${c.bio}\n\nVoice: ${c.personality}\n\nOpening scene: ${c.premise}`,
				image: c.image,
				greeting: withOpeningChoices(c.greeting, c.openingChoices),
				createdAt: t,
				updatedAt: t
			};
			continue;
		}
		characters[c.id] = {
			id: c.id,
			name: c.name,
			aliases: c.handle ? [c.handle] : [],
			description: c.bio,
			personality: c.personality,
			appearance: "",
			background: c.bio,
			history: "",
			behavior: c.personality,
			speechStyle: "",
			likes: "",
			dislikes: "",
			fears: "",
			goals: "",
			secrets: "",
			abilities: "",
			scenario: c.premise,
			exampleDialogue: c.greeting,
			systemInstructions: "",
			creatorNotes: c.tagline,
			tags: c.tags,
			image: c.image,
			origin: "manual",
			observedFacts: [],
			confidence: 1,
			createdAt: t,
			updatedAt: t
		};
	}
	const personaId = "persona-you";
	const personas = { [personaId]: {
		id: personaId,
		name: "You",
		appearance: "",
		personality: "A traveler who walks into stories as if they were rooms.",
		background: "",
		behavior: "Present, curious, not a narrator. Speak as yourself.",
		speechStyle: "",
		preferences: "",
		abilities: "",
		tags: [],
		isDefault: true,
		createdAt: t,
		updatedAt: t
	} };
	const lorebooks = {
		"book-ember": {
			id: "book-ember",
			name: "The Ember",
			description: "House rules of the tavern that appears for a second last call.",
			tags: ["tavern"],
			enabled: true,
			global: false,
			createdAt: t,
			updatedAt: t
		},
		"book-night": {
			id: "book-night",
			name: "The Night Line",
			description: "Facts the conductor will not volunteer.",
			tags: ["train"],
			enabled: true,
			global: false,
			createdAt: t,
			updatedAt: t
		},
		"book-harbor": {
			id: "book-harbor",
			name: "Glass Harbor",
			description: "Lantern night and the names the water keeps.",
			tags: ["harbor"],
			enabled: true,
			global: false,
			createdAt: t,
			updatedAt: t
		}
	};
	const lore = {};
	const addLore = (lorebookId, worldId, title, content, keywords, always = false, category = "world") => {
		const id = nid();
		lore[id] = {
			id,
			lorebookId,
			worldId,
			title,
			content,
			keywords,
			aliases: [],
			category,
			priority: 12,
			importance: .7,
			enabled: true,
			always,
			createdAt: t
		};
		return id;
	};
	const emberLore = [
		addLore("book-ember", "ember-tavern", "The Ember", "The Ember is a tavern that appears when someone needs a second last call. The door is never where it was yesterday.", [
			"ember",
			"tavern",
			"door",
			"last call"
		]),
		addLore("book-ember", "ember-tavern", "House rule", "First drink is on the weather. Second is on you. Names given at the Ember are kept.", [
			"drink",
			"weather",
			"house rule",
			"bar",
			"name"
		], true, "custom"),
		addLore("book-ember", "ember-tavern", "The piano", "Mira Vale is the house pianist. Regulars swear she hears a story in how someone sits down.", [
			"piano",
			"mira",
			"song",
			"music"
		], false, "character")
	];
	const nightLore = [addLore("book-night", "night-line", "The Night Line", "A vintage train that only stops for people who missed the last one. Destinations are a negotiation.", [
		"train",
		"ticket",
		"carriage",
		"conductor"
	])];
	addLore("book-harbor", "glass-harbor", "Lantern festival", "Once a year Glass Harbor writes names on paper lights and lets them go over the water.", [
		"lantern",
		"harbor",
		"festival",
		"name"
	], false, "event");
	const stories = {};
	const chats = {};
	const messages = {};
	const storyStates = {};
	function makeStory(opts) {
		const chatId = `chat-${opts.id}`;
		const greetId = `greet-${opts.id}`;
		stories[opts.id] = {
			id: opts.id,
			name: opts.name,
			description: opts.description,
			image: opts.image,
			characterIds: opts.characterIds,
			personaId,
			worldId: opts.worldId,
			loreIds: opts.loreIds,
			lorebookIds: opts.lorebookIds ?? [],
			presetIds: opts.presetIds,
			chatId,
			autoMemories: true,
			autoCharacters: true,
			memoryMatrix: true,
			loreActivation: "smart",
			contextSize: 24e3,
			createdAt: t,
			updatedAt: t
		};
		chats[chatId] = {
			id: chatId,
			storyId: opts.id,
			rootMessageId: greetId,
			activeLeafId: greetId,
			canonLeafId: greetId
		};
		messages[greetId] = {
			id: greetId,
			chatId,
			parentId: null,
			role: "assistant",
			content: opts.greeting,
			createdAt: t
		};
		storyStates[opts.id] = {
			...opts.state,
			updatedAt: t
		};
	}
	const mira = CHARACTERS.find((c) => c.id === "mira");
	const night = CHARACTERS.find((c) => c.id === "night-line");
	const kai = CHARACTERS.find((c) => c.id === "kai");
	makeStory({
		id: "story-ember",
		name: "Last Call at The Ember",
		description: "A tavern that appears when you need a second last call. Mira at the piano, Aiko behind the bar, Dante pretending not to listen.",
		image: "/worlds/ember.jpg",
		characterIds: [
			"mira",
			"aiko",
			"dante"
		],
		worldId: "ember-tavern",
		loreIds: emberLore,
		lorebookIds: ["book-ember"],
		presetIds: ["preset-slow-burn", "preset-detailed"],
		greeting: withOpeningChoices(mira.greeting, mira.openingChoices),
		state: {
			location: "The Ember",
			scene: "Last call, rain on the windows",
			presentCharacterIds: ["mira", "aiko"],
			time: "Late",
			goals: "",
			tension: "A new regular just walked in",
			recentEvents: "The door opened on a street that did not have a door this morning.",
			emotionalState: "Quiet, watchful",
			tracked: true
		}
	});
	makeStory({
		id: "story-pass",
		name: "The Closing Pass",
		description: "Fog thick enough to swallow the trail. Kai Ren offers the last dry place under the overhang — and does not ask who you used to be.",
		image: "/characters/kai.jpg",
		characterIds: ["kai"],
		loreIds: [],
		lorebookIds: [],
		presetIds: ["preset-cinematic"],
		greeting: withOpeningChoices(kai.greeting, kai.openingChoices),
		state: {
			location: "Mountain pass overhang",
			scene: "Dusk, fog, a new fire",
			presentCharacterIds: ["kai"],
			time: "Dusk",
			goals: "Survive the night on the pass",
			tension: "The path behind is already gone",
			recentEvents: "The traveler arrived soaked and late.",
			emotionalState: "Wary, practical",
			tracked: true
		}
	});
	makeStory({
		id: "story-night",
		name: "The Night Line",
		description: "A train that only stops for people who missed the last one. Your ticket has tomorrow's date. The conductor does not mind.",
		image: "/worlds/night-line.jpg",
		characterIds: [],
		worldId: "night-line",
		loreIds: nightLore,
		lorebookIds: ["book-night"],
		presetIds: ["preset-dark", "preset-cinematic"],
		greeting: withOpeningChoices(night.greeting, night.openingChoices),
		state: {
			location: "Night Line carriage",
			scene: "Rain on dark glass, brass lamps",
			presentCharacterIds: [],
			time: "Night",
			goals: "Understand the destination",
			tension: "The ticket is wrong, and still valid",
			recentEvents: "You sat down. The seat across from you was empty, then it was not.",
			emotionalState: "Uncanny calm",
			tracked: true
		}
	});
	return {
		stories,
		characters,
		personas,
		worlds,
		lorebooks,
		lore,
		chats,
		messages,
		storyStates,
		presets: defaultPresetMap(),
		settings: {
			provider: "xai",
			ollamaBaseUrl: "http://127.0.0.1:11434",
			ollamaModel: "llama3.1",
			openaiBaseUrl: "http://127.0.0.1:11434/v1",
			openaiModel: "llama3.1",
			openaiApiKey: "",
			xaiModel: "grok-4.5",
			debugMode: false,
			autoMemoriesGlobal: true,
			autoCharactersGlobal: true
		}
	};
}
var empty = () => ({
	stories: {},
	characters: {},
	personas: {},
	worlds: {},
	lorebooks: {},
	lore: {},
	relationships: {},
	memories: {},
	secrets: {},
	chats: {},
	messages: {},
	storyStates: {},
	presets: defaultPresetMap(),
	settings: buildSeed().settings,
	logs: [],
	seeded: false
});
function initial() {
	const seed = buildSeed();
	return {
		...empty(),
		...seed,
		relationships: {},
		memories: {},
		secrets: {},
		logs: [],
		seeded: true
	};
}
function uniq(ids) {
	return [...new Set(ids.filter(Boolean))];
}
function memoryStorage() {
	const mem = {};
	return {
		getItem: (k) => mem[k] ?? null,
		setItem: (k, v) => {
			mem[k] = v;
		},
		removeItem: (k) => {
			delete mem[k];
		}
	};
}
function safeStorage() {
	if (typeof window === "undefined") return memoryStorage();
	try {
		const probe = "__nexus_probe__";
		window.localStorage.setItem(probe, "1");
		window.localStorage.removeItem(probe);
		return window.localStorage;
	} catch {
		return memoryStorage();
	}
}
function nonempty(rec) {
	return !!rec && Object.keys(rec).length > 0;
}
function hydrateFrom(s, current) {
	const seed = buildSeed();
	const base = current ?? {
		...empty(),
		...seed,
		relationships: {},
		memories: {},
		secrets: {},
		logs: [],
		seeded: true
	};
	return {
		...base,
		...s,
		characters: nonempty(s.characters) ? s.characters : base.characters,
		worlds: nonempty(s.worlds) ? s.worlds : base.worlds,
		personas: nonempty(s.personas) ? s.personas : base.personas,
		lorebooks: nonempty(s.lorebooks) ? s.lorebooks : base.lorebooks,
		lore: nonempty(s.lore) ? s.lore : base.lore,
		stories: nonempty(s.stories) ? s.stories : base.stories,
		chats: nonempty(s.chats) ? s.chats : base.chats,
		messages: nonempty(s.messages) ? s.messages : base.messages,
		presets: nonempty(s.presets) ? s.presets : base.presets,
		settings: s.settings ?? base.settings,
		relationships: s.relationships ?? base.relationships ?? {},
		memories: s.memories ?? base.memories ?? {},
		secrets: s.secrets ?? base.secrets ?? {},
		storyStates: nonempty(s.storyStates) ? s.storyStates : base.storyStates,
		logs: [],
		seeded: true
	};
}
var useNexus = create()(persist((set, get) => ({
	...initial(),
	log: (message, data, level = "info") => set({ logs: capLogs([...get().logs, makeLog(message, data, level)]) }),
	setTrace: (trace) => set({ lastTrace: trace }),
	patchSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	upsertStory: (story) => set({ stories: {
		...get().stories,
		[story.id]: {
			...story,
			lorebookIds: story.lorebookIds ?? [],
			updatedAt: now()
		}
	} }),
	deleteStory: (id) => {
		const stories = { ...get().stories };
		const story = stories[id];
		delete stories[id];
		const chats = { ...get().chats };
		const messages = { ...get().messages };
		if (story) {
			delete chats[story.chatId];
			for (const m of Object.values(messages)) if (m.chatId === story.chatId) delete messages[m.id];
		}
		const memories = { ...get().memories };
		for (const m of Object.values(memories)) if (m.storyId === id) delete memories[m.id];
		set({
			stories,
			chats,
			messages,
			memories
		});
	},
	touchStory: (id) => {
		const story = get().stories[id];
		if (!story) return;
		set({ stories: {
			...get().stories,
			[id]: {
				...story,
				updatedAt: now()
			}
		} });
	},
	upsertCharacter: (character) => set({ characters: {
		...get().characters,
		[character.id]: character
	} }),
	deleteCharacter: (id) => {
		const characters = { ...get().characters };
		delete characters[id];
		const stories = { ...get().stories };
		for (const story of Object.values(stories)) if (story.characterIds.includes(id)) stories[story.id] = {
			...story,
			characterIds: story.characterIds.filter((cid) => cid !== id),
			updatedAt: now()
		};
		set({
			characters,
			stories
		});
	},
	upsertPersona: (persona) => {
		const personas = { ...get().personas };
		if (persona.isDefault) {
			for (const existing of Object.values(personas)) if (existing.id !== persona.id && existing.isDefault) personas[existing.id] = {
				...existing,
				isDefault: false
			};
		}
		personas[persona.id] = {
			...persona,
			tags: persona.tags ?? [],
			updatedAt: now()
		};
		set({ personas });
	},
	deletePersona: (id) => {
		const personas = { ...get().personas };
		delete personas[id];
		const stories = { ...get().stories };
		for (const story of Object.values(stories)) if (story.personaId === id) stories[story.id] = {
			...story,
			personaId: void 0,
			updatedAt: now()
		};
		set({
			personas,
			stories
		});
	},
	upsertWorld: (world) => set({ worlds: {
		...get().worlds,
		[world.id]: world
	} }),
	upsertLorebook: (book) => set({ lorebooks: {
		...get().lorebooks,
		[book.id]: {
			...book,
			updatedAt: now()
		}
	} }),
	deleteLorebook: (id) => {
		const lorebooks = { ...get().lorebooks };
		delete lorebooks[id];
		const lore = { ...get().lore };
		for (const entry of Object.values(lore)) if (entry.lorebookId === id) delete lore[entry.id];
		const stories = { ...get().stories };
		for (const story of Object.values(stories)) if (story.lorebookIds?.includes(id)) stories[story.id] = {
			...story,
			lorebookIds: story.lorebookIds.filter((bid) => bid !== id),
			updatedAt: now()
		};
		set({
			lorebooks,
			lore,
			stories
		});
	},
	upsertLore: (entry) => set({ lore: {
		...get().lore,
		[entry.id]: entry
	} }),
	deleteLore: (id) => {
		const lore = { ...get().lore };
		delete lore[id];
		const stories = { ...get().stories };
		for (const story of Object.values(stories)) if (story.loreIds.includes(id)) stories[story.id] = {
			...story,
			loreIds: story.loreIds.filter((lid) => lid !== id),
			updatedAt: now()
		};
		set({
			lore,
			stories
		});
	},
	upsertRelationship: (rel) => set({ relationships: {
		...get().relationships,
		[rel.id]: rel
	} }),
	upsertMemory: (memory) => set({ memories: {
		...get().memories,
		[memory.id]: memory
	} }),
	patchMemory: (id, patch) => {
		const prev = get().memories[id];
		if (!prev) return;
		set({ memories: {
			...get().memories,
			[id]: {
				...prev,
				...patch,
				updatedAt: now(),
				manuallyEdited: true
			}
		} });
	},
	deleteMemory: (id) => {
		const prev = get().memories[id];
		if (!prev) return;
		set({ memories: {
			...get().memories,
			[id]: {
				...prev,
				status: "deleted",
				updatedAt: now()
			}
		} });
	},
	upsertSecret: (secret) => set({ secrets: {
		...get().secrets,
		[secret.id]: secret
	} }),
	setStoryState: (storyId, state) => set({ storyStates: {
		...get().storyStates,
		[storyId]: state
	} }),
	upsertChat: (chat) => set({ chats: {
		...get().chats,
		[chat.id]: chat
	} }),
	upsertMessage: (message) => set({ messages: {
		...get().messages,
		[message.id]: message
	} }),
	setChat: (chat) => set({ chats: {
		...get().chats,
		[chat.id]: chat
	} }),
	upsertPreset: (preset) => set({ presets: {
		...get().presets,
		[preset.id]: preset
	} }),
	importBundle: (partial) => set({
		characters: {
			...get().characters,
			...partial.characters ?? {}
		},
		lore: {
			...get().lore,
			...partial.lore ?? {}
		},
		lorebooks: {
			...get().lorebooks,
			...partial.lorebooks ?? {}
		},
		personas: {
			...get().personas,
			...partial.personas ?? {}
		},
		worlds: {
			...get().worlds,
			...partial.worlds ?? {}
		},
		stories: {
			...get().stories,
			...partial.stories ?? {}
		},
		chats: {
			...get().chats,
			...partial.chats ?? {}
		},
		messages: {
			...get().messages,
			...partial.messages ?? {}
		}
	}),
	commitImport: (bundle, opts) => {
		const characters = { ...get().characters };
		const personas = { ...get().personas };
		const lore = { ...get().lore };
		const lorebooks = { ...get().lorebooks };
		const stories = { ...get().stories };
		for (const c of bundle.characters) characters[c.id] = c;
		for (const p of bundle.personas) {
			if (p.isDefault) {
				for (const existing of Object.values(personas)) if (existing.isDefault) personas[existing.id] = {
					...existing,
					isDefault: false
				};
			}
			personas[p.id] = {
				...p,
				tags: p.tags ?? []
			};
		}
		for (const book of bundle.lorebooks) lorebooks[book.id] = book;
		for (const entry of bundle.lore) lore[entry.id] = entry;
		let storyId = opts?.storyId;
		if (storyId && stories[storyId]) {
			const story = stories[storyId];
			stories[storyId] = {
				...story,
				characterIds: uniq([...story.characterIds, ...bundle.characters.map((c) => c.id)]),
				lorebookIds: uniq([...story.lorebookIds ?? [], ...bundle.lorebooks.map((b) => b.id)]),
				loreIds: uniq([...story.loreIds, ...bundle.lore.map((l) => l.id)]),
				personaId: story.personaId || bundle.personas[0]?.id,
				updatedAt: now()
			};
		}
		set({
			characters,
			personas,
			lore,
			lorebooks,
			stories
		});
		return {
			storyId,
			firstId: bundle.personas[0]?.id || bundle.lorebooks[0]?.id || bundle.characters[0]?.id || bundle.lore[0]?.id
		};
	}
}), {
	name: "nexus-store-v1",
	version: 4,
	migrate: (persisted) => migratePersisted(persisted),
	merge: (persisted, current) => ({
		...current,
		...hydrateFrom(persisted ?? {}, current)
	}),
	storage: createJSONStorage(() => safeStorage()),
	partialize: (s) => ({
		stories: s.stories,
		characters: s.characters,
		personas: s.personas,
		worlds: s.worlds,
		lorebooks: s.lorebooks,
		lore: s.lore,
		relationships: s.relationships,
		memories: s.memories,
		secrets: s.secrets,
		chats: s.chats,
		messages: s.messages,
		storyStates: s.storyStates,
		presets: s.presets,
		settings: s.settings,
		seeded: s.seeded
	})
}));
function migratePersisted(persisted) {
	const s = persisted ?? {};
	const lorebooks = { ...s.lorebooks ?? {} };
	const lore = { ...s.lore ?? {} };
	const personas = { ...s.personas ?? {} };
	const stories = { ...s.stories ?? {} };
	for (const persona of Object.values(personas)) personas[persona.id] = {
		...persona,
		tags: persona.tags ?? [],
		isDefault: persona.isDefault ?? false
	};
	for (const entry of Object.values(lore)) lore[entry.id] = {
		...entry,
		always: entry.always ?? false,
		preventRecursion: entry.preventRecursion ?? false
	};
	for (const story of Object.values(stories)) stories[story.id] = {
		...story,
		lorebookIds: story.lorebookIds ?? []
	};
	const storyStates = { ...s.storyStates ?? {} };
	for (const [id, st] of Object.entries(storyStates)) storyStates[id] = {
		...st,
		tracked: st.tracked ?? (st.presentCharacterIds?.length ?? 0) > 0
	};
	if (Object.keys(lorebooks).length === 0) {
		const worlds = s.worlds ?? {};
		for (const world of Object.values(worlds)) {
			const id = `book-${world.id}`;
			lorebooks[id] = {
				id,
				name: world.name,
				description: (world.description ?? "").slice(0, 180),
				tags: [],
				enabled: true,
				global: false,
				createdAt: world.createdAt,
				updatedAt: world.updatedAt
			};
		}
		for (const entry of Object.values(lore)) if (entry.worldId && !entry.lorebookId) lore[entry.id] = {
			...entry,
			lorebookId: `book-${entry.worldId}`
		};
		for (const story of Object.values(stories)) if (story.worldId && lorebooks[`book-${story.worldId}`]) {
			const bid = `book-${story.worldId}`;
			if (!(story.lorebookIds ?? []).includes(bid)) stories[story.id] = {
				...story,
				lorebookIds: [...story.lorebookIds ?? [], bid]
			};
		}
	}
	return hydrateFrom({
		...s,
		lorebooks,
		lore,
		personas,
		stories,
		storyStates
	});
}
function useHydrated() {
	const [hydrated, setHydrated] = (0, import_react.useState)(() => typeof window === "undefined" ? true : useNexus.persist.hasHydrated());
	(0, import_react.useEffect)(() => {
		const unsub = useNexus.persist.onFinishHydration(() => setHydrated(true));
		if (useNexus.persist.hasHydrated()) setHydrated(true);
		const t = window.setTimeout(() => setHydrated(true), 600);
		return () => {
			unsub();
			window.clearTimeout(t);
		};
	}, []);
	return hydrated;
}
function createBlankPersona(name) {
	const t = now();
	return {
		id: nid(),
		name,
		appearance: "",
		personality: "",
		background: "",
		behavior: "",
		speechStyle: "",
		preferences: "",
		abilities: "",
		tags: [],
		isDefault: false,
		createdAt: t,
		updatedAt: t
	};
}
function createBlankLorebook(name) {
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
function createBlankLoreEntry(lorebookId, title = "New entry") {
	return {
		id: nid(),
		lorebookId,
		title,
		content: "",
		keywords: [],
		aliases: [],
		category: "general",
		priority: 10,
		importance: .5,
		enabled: true,
		always: false,
		preventRecursion: false,
		createdAt: now()
	};
}
function createStoryDraft(name) {
	const t = now();
	const id = nid();
	const chatId = nid();
	return {
		story: {
			id,
			name,
			description: "",
			characterIds: [],
			loreIds: [],
			lorebookIds: [],
			presetIds: ["preset-slow-burn"],
			chatId,
			autoMemories: true,
			autoCharacters: true,
			memoryMatrix: true,
			loreActivation: "smart",
			contextSize: 24e3,
			createdAt: t,
			updatedAt: t
		},
		chat: {
			id: chatId,
			storyId: id,
			rootMessageId: null,
			activeLeafId: null,
			canonLeafId: null
		}
	};
}
function defaultPersonaId(personas) {
	const list = Object.values(personas);
	return list.find((p) => p.isDefault)?.id ?? list[0]?.id;
}
//#endregion
export { createBlankLoreEntry as a, createStoryDraft as c, nid as d, now as f, withOpeningChoices as g, useNexus as h, composePresets as i, defaultPersonaId as l, useHydrated as m, CHARACTERS as n, createBlankLorebook as o, relatedWorlds as p, TAGS as r, createBlankPersona as s, BUILTIN_PRESETS as t, formatCount as u };
