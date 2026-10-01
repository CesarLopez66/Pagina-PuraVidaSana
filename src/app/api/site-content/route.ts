import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { readLocalSiteContent, writeLocalSiteContent } from "@/lib/local-storage-server";
import { mergeSiteContent } from "@/lib/site-content";
import type { SiteContent } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const stored = await readLocalSiteContent();
  return NextResponse.json({
    ok: true,
    content: stored ? mergeSiteContent(stored as Partial<SiteContent>) : null,
  });
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, message: "Datos inválidos." },
      { status: 400 }
    );
  }

  const content = mergeSiteContent(body as Partial<SiteContent>);
  await writeLocalSiteContent(content);
  return NextResponse.json({ ok: true, content });
}
