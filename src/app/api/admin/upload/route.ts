import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;
const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "No se recibió ningún archivo." },
      { status: 400 }
    );
  }

  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, message: "Formato de imagen no soportado." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { ok: false, message: "La imagen supera el límite de 5MB." },
      { status: 400 }
    );
  }

  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const { error } = await getServiceClient()
    .storage.from("product-images")
    .upload(path, await file.arrayBuffer(), { contentType: file.type });

  if (error) {
    return NextResponse.json(
      { ok: false, message: "No se pudo subir la imagen." },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = getServiceClient().storage.from("product-images").getPublicUrl(path);

  return NextResponse.json({ ok: true, url: publicUrl });
}
