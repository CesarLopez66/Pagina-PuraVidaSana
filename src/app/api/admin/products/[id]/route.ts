import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, ctx: Params) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await ctx.params;
  const updates = await request.json().catch(() => null);
  if (!updates) {
    return NextResponse.json(
      { ok: false, message: "Datos inválidos." },
      { status: 400 }
    );
  }

  const { data, error } = await getServiceClient()
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { ok: false, message: "Producto no encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, product: data });
}

export async function DELETE(request: NextRequest, ctx: Params) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await ctx.params;
  const { error } = await getServiceClient().from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { ok: false, message: "No se pudo eliminar el producto." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
