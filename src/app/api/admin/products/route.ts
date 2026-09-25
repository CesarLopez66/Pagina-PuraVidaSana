import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { insertLocalProducts } from "@/lib/products-local";
import { isSupabaseUnreachable } from "@/lib/supabase/errors";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const categories = ["Suplementos", "Vitaminas", "Cosmética Natural", "Proteínas"];

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.name !== "string" ||
    !body.name.trim() ||
    typeof body.price !== "number" ||
    body.price < 0 ||
    typeof body.stock !== "number" ||
    body.stock < 0 ||
    !categories.includes(body.category)
  ) {
    return NextResponse.json(
      { ok: false, message: "Datos de producto inválidos." },
      { status: 400 }
    );
  }

  const payload = {
    name: body.name,
    category: body.category,
    price: body.price,
    stock: body.stock,
    description: body.description ?? "",
    image: body.image ?? "",
    featured: !!body.featured,
    images: body.images ?? [],
    benefits: body.benefits ?? [],
    tags: body.tags ?? [],
  };

  try {
    const { data, error } = await getServiceClient()
      .from("products")
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (isSupabaseUnreachable(error)) {
        const [product] = await insertLocalProducts([payload]);
        return NextResponse.json({ ok: true, product });
      }
      return NextResponse.json(
        { ok: false, message: "No se pudo crear el producto." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, product: data });
  } catch (err) {
    if (isSupabaseUnreachable(err)) {
      const [product] = await insertLocalProducts([payload]);
      return NextResponse.json({ ok: true, product });
    }
    return NextResponse.json(
      { ok: false, message: "No se pudo crear el producto." },
      { status: 500 }
    );
  }
}
