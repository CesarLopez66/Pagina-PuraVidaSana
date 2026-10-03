import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { saveLocalUpload } from "@/lib/local-storage-server";
import { isSupabaseUnreachable } from "@/lib/supabase/errors";
import { getServiceClient } from "@/lib/supabase/server";

// Datos compartidos por todos los visitantes (configuración del sitio,
// pedidos, leads de la ruleta). En producción el sitio corre en Vercel,
// cuyo disco no persiste ni se comparte entre instancias, así que todo se
// guarda como JSON en un bucket PRIVADO de Supabase Storage. Si Supabase no
// está configurado o no responde (ej. desarrollo sin conexión), se usa la
// carpeta data/ del servidor, igual que el respaldo local del catálogo.

const DATA_BUCKET = "site-data";
const ASSETS_BUCKET = "site-assets";
const DATA_DIR = path.join(process.cwd(), "data");

// Claves seguras: carpetas y nombres simples, sin "..", siempre .json.
const KEY_PATTERN = /^(?:[\w-]+\/)?[\w-]+\.json$/;

function assertKey(key: string) {
  if (!KEY_PATTERN.test(key)) throw new Error(`Clave inválida: ${key}`);
}

function supabaseConfigured() {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

const ensuredBuckets = new Set<string>();

async function ensureBucket(name: string, isPublic: boolean) {
  if (ensuredBuckets.has(name)) return;
  const storage = getServiceClient().storage;
  const { error } = await storage.getBucket(name);
  if (error) {
    const created = await storage.createBucket(name, { public: isPublic });
    if (created.error && !/already exists/i.test(created.error.message)) {
      throw created.error;
    }
  }
  ensuredBuckets.add(name);
}

// --- Respaldo local ---------------------------------------------------------

async function readLocal(key: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path.join(DATA_DIR, key), "utf8"));
  } catch {
    return null;
  }
}

async function writeLocal(key: string, value: unknown) {
  const file = path.join(DATA_DIR, key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

async function listLocal(prefix: string): Promise<unknown[]> {
  const dir = path.join(DATA_DIR, prefix);
  try {
    const names = (await readdir(dir)).filter((n) => n.endsWith(".json"));
    const items = await Promise.all(names.map((n) => readLocal(`${prefix}/${n}`)));
    return items.filter((i) => i !== null);
  } catch {
    return [];
  }
}

// --- API pública ------------------------------------------------------------

export async function readJson<T>(key: string): Promise<T | null> {
  assertKey(key);
  if (!supabaseConfigured()) return (await readLocal(key)) as T | null;

  try {
    const { data, error } = await getServiceClient()
      .storage.from(DATA_BUCKET)
      .download(key);
    if (!error && data) return JSON.parse(await data.text()) as T;
    if (isSupabaseUnreachable(error)) return (await readLocal(key)) as T | null;
    return null;
  } catch (err) {
    if (isSupabaseUnreachable(err)) return (await readLocal(key)) as T | null;
    return null;
  }
}

export async function writeJson(key: string, value: unknown) {
  assertKey(key);
  if (!supabaseConfigured()) return writeLocal(key, value);

  try {
    await ensureBucket(DATA_BUCKET, false);
    const { error } = await getServiceClient()
      .storage.from(DATA_BUCKET)
      .upload(key, JSON.stringify(value), {
        upsert: true,
        contentType: "application/json",
        cacheControl: "0",
      });
    if (error) throw error;
  } catch (err) {
    if (isSupabaseUnreachable(err)) return writeLocal(key, value);
    throw err;
  }
}

export async function removeJson(key: string) {
  assertKey(key);
  if (!supabaseConfigured()) {
    await rm(path.join(DATA_DIR, key), { force: true });
    return;
  }

  try {
    const { error } = await getServiceClient().storage.from(DATA_BUCKET).remove([key]);
    if (error) throw error;
  } catch (err) {
    if (isSupabaseUnreachable(err)) {
      await rm(path.join(DATA_DIR, key), { force: true });
      return;
    }
    throw err;
  }
}

// Lee todos los JSON de una carpeta (ej. "orders").
export async function listJson<T>(prefix: string): Promise<T[]> {
  if (!/^[\w-]+$/.test(prefix)) throw new Error(`Carpeta inválida: ${prefix}`);
  if (!supabaseConfigured()) return (await listLocal(prefix)) as T[];

  try {
    const bucket = getServiceClient().storage.from(DATA_BUCKET);
    const names: string[] = [];
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await bucket.list(prefix, { limit: 1000, offset });
      if (error) {
        if (isSupabaseUnreachable(error)) return (await listLocal(prefix)) as T[];
        // El bucket todavía no existe: no hay datos guardados.
        return [];
      }
      names.push(...data.filter((f) => f.name.endsWith(".json")).map((f) => f.name));
      if (data.length < 1000) break;
    }

    const items: T[] = [];
    for (let i = 0; i < names.length; i += 20) {
      const batch = await Promise.all(
        names.slice(i, i + 20).map(async (name) => {
          const { data } = await bucket.download(`${prefix}/${name}`);
          return data ? (JSON.parse(await data.text()) as T) : null;
        })
      );
      items.push(...(batch.filter(Boolean) as T[]));
    }
    return items;
  } catch (err) {
    if (isSupabaseUnreachable(err)) return (await listLocal(prefix)) as T[];
    throw err;
  }
}

// Archivos públicos (tipografías). Devuelve la URL pública.
export async function savePublicAsset(
  name: string,
  bytes: ArrayBuffer,
  contentType: string
): Promise<string> {
  if (!supabaseConfigured()) return saveLocalUpload(path.basename(name), bytes);

  try {
    await ensureBucket(ASSETS_BUCKET, true);
    const bucket = getServiceClient().storage.from(ASSETS_BUCKET);
    const { error } = await bucket.upload(name, bytes, { contentType });
    if (error) throw error;
    return bucket.getPublicUrl(name).data.publicUrl;
  } catch (err) {
    if (isSupabaseUnreachable(err)) return saveLocalUpload(path.basename(name), bytes);
    throw err;
  }
}
