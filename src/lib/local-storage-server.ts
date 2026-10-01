import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_CONTENT_FILE = path.join(DATA_DIR, "site-content.json");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

export const UPLOAD_MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  woff2: "font/woff2",
  woff: "font/woff",
  ttf: "font/ttf",
  otf: "font/otf",
};

export async function readLocalSiteContent(): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(SITE_CONTENT_FILE, "utf8"));
  } catch {
    return null;
  }
}

export async function writeLocalSiteContent(content: unknown) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SITE_CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
}

export async function saveLocalUpload(name: string, bytes: ArrayBuffer) {
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(path.join(UPLOADS_DIR, name), Buffer.from(bytes));
  return `/api/uploads/${name}`;
}
