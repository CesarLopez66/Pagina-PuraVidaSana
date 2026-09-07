// Crea el bucket "product-images" en Supabase Storage. Correr una sola vez:
//   node --env-file=.env.local scripts/setup-storage.mjs

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Corre con --env-file=.env.local."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const { error } = await supabase.storage.createBucket("product-images", {
  public: true,
  fileSizeLimit: "5MB",
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
});

if (error && !error.message.includes("already exists")) {
  console.error("Error creando el bucket:", error.message);
  process.exit(1);
}

console.log(
  error
    ? "El bucket 'product-images' ya existía, nada que hacer."
    : "Bucket 'product-images' creado correctamente (público)."
);
