import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="leaf-pattern flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-forest/10 bg-white p-8 text-center shadow-sm">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-soft text-leaf">
          <Compass size={30} />
        </span>
        <p className="font-script text-xl text-leaf">Error 404</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-forest">
          Página no encontrada
        </h1>
        <p className="mt-3 text-sm text-ink/60">
          La página que buscas no existe o fue movida.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
