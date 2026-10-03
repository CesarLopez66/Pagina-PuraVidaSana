import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { CUSTOM_FONT_FORMATS } from "@/lib/fonts";
import { savePublicAsset } from "@/lib/server-data";

export const runtime = "nodejs";

const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  const labelRaw = formData?.get("label");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "No se recibió ningún archivo." },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(ext in CUSTOM_FONT_FORMATS)) {
    return NextResponse.json(
      { ok: false, message: "Usa un archivo .ttf, .otf, .woff o .woff2." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { ok: false, message: "La tipografía supera el límite de 8 MB." },
      { status: 400 }
    );
  }

  const id = `custom-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
  const fromName = file.name.replace(/\.[^.]+$/, "").trim();
  const label = (
    typeof labelRaw === "string" && labelRaw.trim() ? labelRaw.trim() : fromName
  ).slice(0, 60);

  if (!label) {
    return NextResponse.json(
      { ok: false, message: "Escribe un nombre para la tipografía." },
      { status: 400 }
    );
  }

  try {
    const url = await savePublicAsset(
      `fonts/${id}.${ext}`,
      await file.arrayBuffer(),
      `font/${ext}`
    );
    return NextResponse.json({
      ok: true,
      font: {
        id,
        label,
        url,
        format: CUSTOM_FONT_FORMATS[ext as keyof typeof CUSTOM_FONT_FORMATS],
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo guardar la tipografía." },
      { status: 500 }
    );
  }
}
