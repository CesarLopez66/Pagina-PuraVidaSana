"use client";

import { Clock, MapPin, Phone, Store } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { buildMapEmbedUrl } from "@/lib/format";
import { useStore } from "@/store/useStore";

export function Branches() {
  const branches = useStore((s) => s.storeInfo.branches) ?? [];

  return (
    <section className="leaf-pattern">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal className="glass-panel mx-auto mb-12 max-w-xl rounded-2xl px-7 py-7 text-center">
          <p className="font-script text-2xl text-leaf">Visítanos</p>
          <h2 className="font-display mt-1 text-4xl font-bold text-forest md:text-5xl">
            {branches.length > 1 ? "Nuestras sucursales" : "Nuestra sucursal"}
          </h2>
        </Reveal>

        {branches.length === 0 ? (
          <div className="glass-panel mx-auto max-w-md rounded-2xl p-8 text-center">
            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-soft text-leaf">
              <Store size={22} />
            </span>
            <p className="text-base text-ink/65">
              Todavía no registramos sucursales para mostrar aquí.
            </p>
          </div>
        ) : (
          <div
            className={`grid gap-6 ${
              branches.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-2xl"
            }`}
          >
            {branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 80}>
                <div className="glass-panel overflow-hidden rounded-2xl">
                  <iframe
                    src={buildMapEmbedUrl(b.lat, b.lon)}
                    title={`Mapa de ${b.name}`}
                    loading="lazy"
                    className="h-60 w-full grayscale-25 contrast-[1.05]"
                  />
                  <div className="space-y-2.5 p-6">
                    <h3 className="text-xl font-semibold text-forest">
                      {b.name}
                    </h3>
                    <p className="flex items-start gap-2 text-base text-ink/65">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-leaf" />
                      {b.address}
                    </p>
                    <p className="flex items-center gap-2 text-base text-ink/65">
                      <Clock size={18} className="shrink-0 text-leaf" />
                      {b.hours}
                    </p>
                    <p className="flex items-center gap-2 text-base text-ink/65">
                      <Phone size={18} className="shrink-0 text-leaf" />
                      {b.phone}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
