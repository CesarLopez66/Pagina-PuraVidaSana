"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";

export function Hero() {
  const hero = useStore((s) => s.siteContent.hero);
  const ready = useStore((s) => s.siteContentReady);
  const customScript = useStore((s) =>
    s.siteContent.customFonts?.find((font) => font.id === s.siteContent.typography.script)
  );

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden grain-overlay">
      {/* Velo oscuro del lado del texto: el fondo es claro a la izquierda y
          sin él los textos blancos se pierden. Los productos quedan nítidos. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/30 to-black/45 md:bg-gradient-to-r md:from-black/60 md:via-black/30 md:to-transparent"
      />
      <div
        className={`relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-24 md:px-6 ${
          ready ? "" : "invisible"
        }`}
      >
        <h1
          className="text-stroke-thin animate-fade-up max-w-5xl text-6xl leading-[1.15] text-leaf drop-shadow-md sm:text-7xl md:text-8xl lg:text-9xl"
          style={{
            fontFamily: customScript
              ? `"${customScript.id}", cursive`
              : "var(--font-courgette), cursive",
          }}
        >
          {hero.eyebrow}
        </h1>
        <p className="font-display animate-fade-up-delay-1 mt-5 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-lg md:text-6xl">
          {hero.title}
        </p>
        <p className="text-stroke-thin animate-fade-up-delay-2 mt-6 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-md md:text-xl">
          {hero.subtitle}
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
          {hero.footnote}
        </div>
      </div>
    </section>
  );
}
