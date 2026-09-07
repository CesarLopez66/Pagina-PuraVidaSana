"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.ok) {
        // Navegación completa (no router.push): garantiza que la cookie
        // recién puesta viaje en la siguiente petición al proxy que
        // protege /admin. Con client-side nav esto puede llegar antes
        // de que el navegador confirme la cookie, sobre todo con más
        // latencia de red (ej. detrás de un túnel).
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/admin";
      } else {
        setError(data.message ?? "No se pudo iniciar sesión.");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaf-pattern flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-forest/10 bg-white p-8 shadow-sm">
        <div className="flex justify-center">
          <Logo size="sm" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-forest">
          <Lock size={18} />
          <h1 className="text-lg font-semibold">Acceso administrador</h1>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase text-forest/70">
              Usuario
            </span>
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-leaf"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase text-forest/70">
              Contraseña
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-forest/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-leaf"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" variant="secondary" className="w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
