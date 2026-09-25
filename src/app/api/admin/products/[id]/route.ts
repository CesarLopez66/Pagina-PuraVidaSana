import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteLocalProduct, updateLocalProduct } from "@/lib/products-local";
import { isSupabaseUnreachable } from "@/lib/supabase/errors";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

  try {
    const { data, error } = await getServiceClient()
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      if (isSupabaseUnreachable(error)) {
        const product = await updateLocalProduct(id, updates);
        if (!product) {
          return NextResponse.json(
            { ok: false, message: "Producto no encontrado." },
            { status: 404 }
          );
        }
        return NextResponse.json({ ok: true, product });
      }
      return NextResponse.json(
        { ok: false, message: "Producto no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, product: data });
  } catch (err) {
    if (isSupabaseUnreachable(err)) {
      const product = await updateLocalProduct(id, updates);
      if (!product) {
        return NextResponse.json(
          { ok: false, message: "Producto no encontrado." },
          { status: 404 }
        );
      }
      return NextResponse.json({ ok: true, product });
    }
    return NextResponse.json(
      { ok: false, message: "Producto no encontrado." },
      { status: 404 }
    );
  }
}

export async function DELETE(request: NextRequest, ctx: Params) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const { id } = await ctx.params;
  try {
    const { error } = await getServiceClient().from("products").delete().eq("id", id);

    if (error) {
      if (isSupabaseUnreachable(error)) {
        const ok = await deleteLocalProduct(id);
        if (!ok) {
          return NextResponse.json(
            { ok: false, message: "No se pudo eliminar el producto." },
            { status: 500 }
          );
        }
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { ok: false, message: "No se pudo eliminar el producto." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (isSupabaseUnreachable(err)) {
      const ok = await deleteLocalProduct(id);
      if (!ok) {
        return NextResponse.json(
          { ok: false, message: "No se pudo eliminar el producto." },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, message: "No se pudo eliminar el producto." },
      { status: 500 }
    );
  }
}
