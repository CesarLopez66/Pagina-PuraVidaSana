import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { buildProductsTemplateXlsx } from "@/lib/xlsx-writer";

export const runtime = "nodejs";

const HEADERS = [
  "nombre",
  "categoria",
  "precio",
  "stock",
  "descripcion",
  "imagen_url",
  "destacado",
  "imagenes_adicionales",
  "beneficios",
  "etiquetas",
];

const EXAMPLE_ROW = [
  "Ejemplo - bórralo antes de subir",
  "Suplementos",
  145,
  32,
  "Cápsulas de Omega-3 de alta pureza.",
  "https://... (opcional, puedes dejarlo vacío y subir la foto después)",
  "FALSE",
  "https://imagen1.jpg|https://imagen2.jpg",
  "Apoya la salud cardiovascular|Favorece la función cognitiva",
  "Alta pureza|Libre de mercurio",
];

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const buffer = buildProductsTemplateXlsx({
    sheetName: "Productos",
    headers: HEADERS,
    rows: [EXAMPLE_ROW],
    rowStyle: () => 2,
  });

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="plantilla-productos.xlsx"',
    },
  });
}
