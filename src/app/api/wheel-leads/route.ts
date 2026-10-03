import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/server-data";
import { STORE_SETTINGS_KEY, sanitizeStoreSettings } from "@/lib/store-settings";
import type { WheelLead } from "@/types";

export const runtime = "nodejs";

function field(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Registro público: cualquier visitante que gira la ruleta envía aquí sus
// datos. Solo el admin puede leerlos (ver /api/admin/wheel-leads).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "Datos inválidos." }, { status: 400 });
  }

  const name = field(body.name, 120);
  const email = field(body.email, 160);
  const phone = field(body.phone, 40);
  const birthdate = field(body.birthdate, 10);
  const prizeLabel = field(body.prizeLabel, 60);
  const prizeCode = field(body.prizeCode, 12).toUpperCase();

  const settings = sanitizeStoreSettings(await readJson(STORE_SETTINGS_KEY));
  const validPrize = settings.wheelPrizes.some((p) => p.label === prizeLabel);

  if (
    !name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !phone ||
    (birthdate && !/^\d{4}-\d{2}-\d{2}$/.test(birthdate)) ||
    !validPrize ||
    !/^[A-Z0-9]{4,12}$/.test(prizeCode) ||
    body.consentMarketing !== true
  ) {
    return NextResponse.json({ ok: false, message: "Datos inválidos." }, { status: 400 });
  }

  const lead: WheelLead = {
    id: `WL-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    name,
    email,
    phone,
    birthdate: birthdate || undefined,
    prizeLabel,
    prizeCode,
    consentMarketing: true,
    createdAt: new Date().toISOString(),
  };

  try {
    await writeJson(`wheel-leads/${lead.id}.json`, lead);
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo registrar la participación." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, lead });
}
