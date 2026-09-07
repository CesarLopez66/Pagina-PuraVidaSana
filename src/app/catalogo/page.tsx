import { Suspense } from "react";
import { CatalogView } from "@/components/catalog/CatalogView";

export default function CatalogoPage() {
  return (
    <div className="leaf-pattern min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 max-w-2xl rounded-2xl border border-forest/10 bg-white px-7 py-7 shadow-sm">
          <p className="font-script text-2xl text-leaf">Catálogo online</p>
          <h1 className="font-display mt-1 text-4xl font-bold text-forest md:text-5xl">
            Productos naturales para tu rutina
          </h1>
          <p className="mt-3 text-lg text-ink/65">
            Filtra por categoría, precio o busca en tiempo real. Precios en
            bolivianos (Bs.).
          </p>
        </div>
        <Suspense
          fallback={
            <div className="rounded-2xl border border-forest/10 bg-white p-10 text-center text-lg text-ink/50 shadow-sm">
              Cargando catálogo...
            </div>
          }
        >
          <CatalogView />
        </Suspense>
      </div>
    </div>
  );
}
