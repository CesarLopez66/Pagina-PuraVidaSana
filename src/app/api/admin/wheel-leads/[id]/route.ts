import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { removeJson } from "@/lib/server-data";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, ctx: Params) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!/^WL-[A-Z0-9]+$/.test(id)) {
    return NextResponse.json({ ok: false, message: "Lead no encontrado." }, { status: 404 });
  }

  try {
    await removeJson(`wheel-leads/${id}.json`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo eliminar el lead." },
      { status: 500 }
    );
  }
}
