import { createClient } from "@supabase/supabase-js";

// Service role key: solo se usa en Route Handlers, nunca en código de cliente.
// Evita RLS por completo, así que cada ruta que la use debe verificar
// isAdminAuthenticated() antes de hacer cualquier escritura.
export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en las variables de entorno."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
