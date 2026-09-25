export function isSupabaseUnreachable(error: unknown): boolean {
  const message =
    error instanceof Error
      ? `${error.message} ${error.cause ?? ""}`
      : error && typeof error === "object" && "message" in error
        ? String((error as { message?: string }).message)
        : String(error ?? "");

  return /fetch failed|ENOTFOUND|ECONNRESET|ETIMEDOUT|ECONNREFUSED|getaddrinfo|Failed to fetch|NetworkError|Non-existent domain/i.test(
    message
  );
}

export const SUPABASE_DOWN_MESSAGE =
  "No se pudo conectar a Supabase. El inventario se está guardando en este servidor (archivo local) hasta que el proyecto vuelva a estar disponible.";
