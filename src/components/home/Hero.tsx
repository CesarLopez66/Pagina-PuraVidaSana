"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden grain-overlay">
      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-24 md:px-6">
        <p className="text-stroke-thin animate-fade-up font-script text-3xl text-leaf drop-shadow-md md:text-4xl">
          Casa de Pura Vida Sana
        </p>
        <h1 className="font-display animate-fade-up-delay-1 mt-4 max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-7xl">
          Salud integral natural en el corazón de La Paz
        </h1>
        <p className="text-stroke-thin animate-fade-up-delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-md md:text-xl">
          Vitaminas, suplementos y cosmética botánica seleccionados para el
          bienestar cotidiano en Bolivia.
        </p>
        <div className="animate-fade-up-delay-2 mt-9 flex flex-wrap items-center gap-4">
          <Link href="/catalogo">
            <Button variant="secondary" size="lg" className="animate-soft-pulse">
              Explorar Catálogo
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/nosotros">
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-forest"
            >
              <Leaf size={20} />
              Nuestra historia
            </Button>
          </Link>
        </div>
        <div className="text-stroke-thin mt-11 inline-flex items-center gap-2.5 text-base text-white/90 drop-shadow-md">
          <Sparkles size={18} className="text-leaf" />
          Envíos a La Paz y todo el país · Pedido y pago por WhatsApp
        </div>
      </div>
    </section>
  );
}
