import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readJson, writeJson } from "@/lib/server-data";
import { STORE_SETTINGS_KEY, sanitizeStoreSettings } from "@/lib/store-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// settings: null significa que el admin aún no guardó nada en el servidor.
export async function GET() {
  const stored = await readJson(STORE_SETTINGS_KEY);
  return NextResponse.json({
    ok: true,
    settings: stored ? sanitizeStoreSettings(stored) : null,
  });
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, message: "Datos inválidos." },
      { status: 400 }
    );
  }

  const settings = sanitizeStoreSettings(body);
  try {
    await writeJson(STORE_SETTINGS_KEY, settings);
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo guardar en el servidor." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, settings });
}
