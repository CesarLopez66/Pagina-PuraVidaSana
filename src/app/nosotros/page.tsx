"use client";

import {
  BadgeCheck,
  Compass,
  Handshake,
  HeartHandshake,
  Leaf,
  Quote,
  Sprout,
  Target,
} from "lucide-react";
import { PageBackground } from "@/components/layout/PageBackground";
import { Reveal } from "@/components/ui/Reveal";
import { useStore } from "@/store/useStore";

// Confianza, Calidad, Servicio, Compromiso, Bienestar.
const valueIcons = [Handshake, BadgeCheck, HeartHandshake, Sprout, Leaf];

export default function NosotrosPage() {
  const about = useStore((s) => s.siteContent.about);
  const storyParagraphs = about.story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div>
      <PageBackground />
      <section className="relative isolate overflow-hidden py-24 md:py-32">
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white md:px-6">
          <p className="text-stroke-thin font-script text-2xl text-leaf drop-shadow-md">
            {about.eyebrow}
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold drop-shadow-lg md:text-5xl">
            {about.title}
          </h1>
          <p className="text-stroke-thin mt-5 text-lg leading-relaxed text-white/90 drop-shadow-md">
            {about.intro}
          </p>
        </div>
      </section>

      <section className="leaf-pattern">
        <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 md:space-y-20 md:px-6 md:py-20">
          {storyParagraphs.length > 0 && (
            <Reveal className="glass-panel mx-auto max-w-4xl rounded-2xl p-7 md:p-10">
              <p className="font-script text-2xl text-leaf">Desde La Paz</p>
              <h2 className="font-display mt-1 text-3xl font-bold text-forest md:text-4xl">
                Nuestra historia
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/70 md:text-lg">
                {storyParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          )}

          <div className="grid gap-7 md:grid-cols-2">
            {[
              { icon: Target, title: "Misión", text: about.mission },
              { icon: Compass, title: "Visión", text: about.vision },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 80} className="h-full">
                  <div className="glass-panel h-full rounded-2xl p-7 md:p-8">
                    <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-leaf">
                      <Icon size={30} />
                    </span>
                    <h2 className="font-display text-2xl font-bold text-forest md:text-3xl">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-base leading-relaxed text-ink/70">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <div>
            <Reveal className="glass-panel mx-auto mb-10 max-w-xl rounded-2xl px-7 py-6 text-center">
              <p className="font-script text-2xl text-leaf">Lo que nos guía</p>
              <h2 className="font-display mt-1 text-3xl font-bold text-forest md:text-4xl">
                Nuestros valores
              </h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-7">
              {about.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length];
                return (
                  <Reveal
                    key={index}
                    delay={index * 80}
                    className="w-full sm:w-[calc(50%-0.875rem)] lg:w-[calc((100%-3.5rem)/3)]"
                  >
                    <div className="glass-panel h-full rounded-2xl p-7">
                      <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-leaf">
                        <Icon size={26} />
                      </span>
                      <h3 className="text-xl font-semibold text-forest">{value.title}</h3>
                      <p className="mt-3 text-base leading-relaxed text-ink/65">
                        {value.text}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {about.philosophy && (
            <Reveal className="glass-panel mx-auto max-w-3xl rounded-2xl px-7 py-10 text-center md:px-12">
              <Quote size={36} className="mx-auto text-leaf" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-forest/60">
                Filosofía de servicio
              </p>
              <blockquote className="font-display mt-4 text-2xl font-bold leading-snug text-forest md:text-3xl">
                “{about.philosophy}”
              </blockquote>
            </Reveal>
          )}
        </div>
      </section>
    </div>
  );
}
