import { NextResponse } from "next/server";
import { readJson, writeJson } from "@/lib/server-data";
import type { CartItem, Order } from "@/types";

export const runtime = "nodejs";

function field(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

// Registro público del pedido que el cliente envía por WhatsApp, para que
// el admin lo vea en el panel. Solo el admin puede leerlos o modificarlos.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "Datos inválidos." }, { status: 400 });
  }

  const id = field(body.id, 30);
  const shipping = body.shipping && typeof body.shipping === "object" ? body.shipping : {};
  const items: CartItem[] = Array.isArray(body.items)
    ? body.items
        .slice(0, 50)
        .map((i: Record<string, unknown>) => ({
          productId: field(i?.productId, 40),
          quantity: Math.floor(Number(i?.quantity)),
        }))
        .filter((i: CartItem) => i.productId && i.quantity >= 1 && i.quantity <= 999)
    : [];
  const total = Number(body.total);
  const shippingFee = Number(body.shippingFee);

  const order: Order = {
    id,
    items,
    shipping: {
      name: field(shipping.name, 120),
      phone: field(shipping.phone, 40),
      cityZone: field(shipping.cityZone, 120),
      address: field(shipping.address, 300),
    },
    total: Number.isFinite(total) && total >= 0 ? total : 0,
    shippingFee: Number.isFinite(shippingFee) && shippingFee >= 0 ? shippingFee : 0,
    paymentMethod: "whatsapp",
    status: "Pendiente",
    createdAt: new Date().toISOString(),
  };

  if (
    !/^ORD-[A-Z0-9]{4,20}$/.test(id) ||
    items.length === 0 ||
    !order.shipping.name ||
    !order.shipping.phone
  ) {
    return NextResponse.json({ ok: false, message: "Datos inválidos." }, { status: 400 });
  }

  const key = `orders/${id}.json`;
  if (await readJson(key)) {
    return NextResponse.json({ ok: false, message: "El pedido ya existe." }, { status: 409 });
  }

  try {
    await writeJson(key, order);
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo registrar el pedido." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, order });
}
