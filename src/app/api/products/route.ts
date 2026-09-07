import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabaseAnon
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { ok: false, message: "No se pudo cargar el catálogo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, products: data });
}
