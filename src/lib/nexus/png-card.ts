/**
 * SillyTavern / TavernAI PNG character cards store JSON in a tEXt chunk
 * named `chara` (v2) or `ccv3` (v3), usually base64-encoded.
 */

export type PngCardResult =
  | { ok: true; json: unknown; keyword: string }
  | { ok: false; error: string };

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const CARD_KEYWORDS = ["ccv3", "chara", "character"];

function isPng(bytes: Uint8Array): boolean {
  return PNG_SIGNATURE.every((byte, i) => bytes[i] === byte);
}

function readAscii(bytes: Uint8Array, start: number, length: number): string {
  let out = "";
  for (let i = 0; i < length; i += 1) out += String.fromCharCode(bytes[start + i]!);
  return out;
}

function decodeBase64Utf8(value: string): string {
  const binary = atob(value.replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8").decode(bytes);
}

function readTextChunks(bytes: Uint8Array): { keyword: string; text: string }[] {
  const chunks: { keyword: string; text: string }[] = [];
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
      if (nullIndex > 0) {
        chunks.push({
          keyword: readAscii(data, 0, nullIndex),
          text: new TextDecoder("latin1").decode(data.subarray(nullIndex + 1)),
        });
      }
    } else if (type === "iTXt") {
      const data = bytes.subarray(dataStart, dataStart + length);
      const nullIndex = data.indexOf(0);
      if (nullIndex > 0) {
        const keyword = readAscii(data, 0, nullIndex);
        const compressionFlag = data[nullIndex + 1];
        if (compressionFlag === 0) {
          let cursor = nullIndex + 3;
          let seen = 0;
          while (cursor < data.length && seen < 2) {
            if (data[cursor] === 0) seen += 1;
            cursor += 1;
          }
          chunks.push({ keyword, text: new TextDecoder("utf-8").decode(data.subarray(cursor)) });
        }
      }
    } else if (type === "IEND") {
      break;
    }
    offset = dataStart + length + 4;
  }
  return chunks;
}

export async function readCharacterCardFromPng(file: Blob): Promise<PngCardResult> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (!isPng(bytes)) {
    return {
      ok: false,
      error: "This is not a PNG. Character cards embed their data in PNG files, not JPEG or WebP.",
    };
  }
  const chunks = readTextChunks(bytes);
  if (!chunks.length) {
    return { ok: false, error: "This PNG is a plain image — it has no character-card metadata." };
  }
  for (const keyword of CARD_KEYWORDS) {
    const chunk = chunks.find((c) => c.keyword.toLowerCase() === keyword);
    if (!chunk) continue;
    for (const decode of [() => decodeBase64Utf8(chunk.text), () => chunk.text]) {
      try {
        return { ok: true, json: JSON.parse(decode()), keyword: chunk.keyword };
      } catch {
        /* try the next decoder */
      }
    }
    return {
      ok: false,
      error: `The PNG has a "${chunk.keyword}" chunk, but it is not valid card JSON.`,
    };
  }
  return {
    ok: false,
    error: `This PNG has metadata (${chunks.map((c) => c.keyword).join(", ")}) but no character card chunk.`,
  };
}

export async function blobToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read image"));
    reader.readAsDataURL(file);
  });
}
