"use client";

import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useStore } from "@/store/useStore";

export function Philosophy() {
  const about = useStore((s) => s.siteContent.about);

  if (!about.philosophy) return null;

  return (
    <section className="px-4 py-16 md:px-6 md:py-20">
      <Reveal className="glass-panel mx-auto max-w-4xl rounded-2xl px-7 py-10 text-center md:px-14 md:py-12">
        <Quote size={36} className="mx-auto text-leaf" />
        <p className="font-script mt-3 text-2xl text-leaf">Nuestra filosofía</p>
        <blockquote className="font-display mt-3 text-3xl font-bold leading-snug text-forest md:text-4xl">
          “{about.philosophy}”
        </blockquote>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg">
          {about.intro}
        </p>
        <Link href="/nosotros" className="mt-7 inline-block">
          <Button variant="secondary">
            Conoce nuestra historia
            <ArrowRight size={18} />
          </Button>
        </Link>
      </Reveal>
    </section>
  );
}
