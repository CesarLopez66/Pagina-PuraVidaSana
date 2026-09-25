import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";
import { listLocalProducts } from "@/lib/products-local";
import { isSupabaseUnreachable } from "@/lib/supabase/errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const query = supabaseAnon
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    const { data, error } = await Promise.race([
      query,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("ETIMEDOUT")), 4000)
      ),
    ]);

    if (error) {
      if (isSupabaseUnreachable(error)) {
        const products = await listLocalProducts();
        return NextResponse.json({ ok: true, products, source: "local" });
      }
      return NextResponse.json(
        { ok: false, message: "No se pudo cargar el catálogo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, products: data, source: "supabase" });
  } catch (err) {
    if (isSupabaseUnreachable(err)) {
      const products = await listLocalProducts();
      return NextResponse.json({ ok: true, products, source: "local" });
    }
    return NextResponse.json(
      { ok: false, message: "No se pudo cargar el catálogo." },
      { status: 500 }
    );
  }
}
