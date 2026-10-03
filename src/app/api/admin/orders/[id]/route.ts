import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readJson, removeJson, writeJson } from "@/lib/server-data";
import type { Order, OrderStatus } from "@/types";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ id: string }>;
}

const statuses: OrderStatus[] = ["Pendiente", "Confirmado", "Cancelado"];

async function resolveKey(request: NextRequest, ctx: Params) {
  if (!isAdminAuthenticated(request)) return { error: 401 as const };
  const { id } = await ctx.params;
  if (!/^ORD-[A-Z0-9]{4,20}$/.test(id)) return { error: 404 as const };
  return { key: `orders/${id}.json` };
}

export async function PATCH(request: NextRequest, ctx: Params) {
  const resolved = await resolveKey(request, ctx);
  if (resolved.error) {
    return NextResponse.json({ ok: false }, { status: resolved.error });
  }

  const body = await request.json().catch(() => null);
  if (!body || !statuses.includes(body.status)) {
    return NextResponse.json({ ok: false, message: "Estado inválido." }, { status: 400 });
  }

  const order = await readJson<Order>(resolved.key);
  if (!order) {
    return NextResponse.json({ ok: false, message: "Pedido no encontrado." }, { status: 404 });
  }

  const updated: Order = { ...order, status: body.status };
  try {
    await writeJson(resolved.key, updated);
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo actualizar el pedido." },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true, order: updated });
}

export async function DELETE(request: NextRequest, ctx: Params) {
  const resolved = await resolveKey(request, ctx);
  if (resolved.error) {
    return NextResponse.json({ ok: false }, { status: resolved.error });
  }

  try {
    await removeJson(resolved.key);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudo eliminar el pedido." },
      { status: 500 }
    );
  }
}
