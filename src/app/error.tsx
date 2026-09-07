"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="leaf-pattern flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-forest/10 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert size={30} />
        </span>
        <h1 className="text-2xl font-bold text-forest">Algo salió mal</h1>
        <p className="mt-2 text-sm text-ink/60">
          Ocurrió un error inesperado. Puedes intentar de nuevo o volver al
          inicio.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" onClick={reset}>
            <RefreshCw size={16} />
            Intentar de nuevo
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
