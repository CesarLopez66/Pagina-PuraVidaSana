import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { listJson } from "@/lib/server-data";
import type { WheelLead } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const leads = await listJson<WheelLead>("wheel-leads");
    leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return NextResponse.json({ ok: true, leads });
  } catch {
    return NextResponse.json(
      { ok: false, message: "No se pudieron cargar los leads." },
      { status: 500 }
    );
  }
}
