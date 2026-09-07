import type { NextRequest } from "next/server";

// Misma verificación que src/proxy.ts, extraída para reutilizar en las
// rutas /api/admin/*, que el matcher de proxy.ts no cubre.
export function isAdminAuthenticated(request: NextRequest): boolean {
  const session = request.cookies.get("admin_session")?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;
  return !!expected && session === expected;
}
