import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UPLOAD_MIME_BY_EXT, UPLOADS_DIR } from "@/lib/local-storage-server";

export const runtime = "nodejs";

interface Params {
  params: Promise<{ name: string }>;
}

export async function GET(_request: NextRequest, ctx: Params) {
  const { name } = await ctx.params;
  const match = /^[\w-]+\.(png|jpg|webp|gif|woff2|woff|ttf|otf)$/.exec(name);
  if (!match) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  try {
    const bytes = await readFile(path.join(UPLOADS_DIR, name));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": UPLOAD_MIME_BY_EXT[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
