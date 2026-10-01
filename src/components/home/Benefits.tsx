"use client";

import { Leaf, MapPinned, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { defaultSiteContent } from "@/lib/site-content";
import { useStore } from "@/store/useStore";

const icons = [MapPinned, Leaf, MessageCircle];

export function Benefits() {
  const benefits = useStore((s) => s.siteContent.benefits) ?? defaultSiteContent.benefits;

  return (
    <section className="leaf-pattern">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal className="glass-panel mx-auto mb-12 max-w-xl rounded-2xl px-7 py-7 text-center">
          <p className="font-script text-2xl text-leaf">{benefits.eyebrow}</p>
          <h2 className="font-display mt-1 text-4xl font-bold text-forest md:text-5xl">
            {benefits.title}
          </h2>
        </Reveal>
        <div className="grid gap-7 md:grid-cols-3">
          {benefits.items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <Reveal key={index} delay={index * 80} className="h-full">
                <div className="glass-panel h-full rounded-2xl p-7 text-center transition hover:-translate-y-1 hover:shadow-xl hover:shadow-forest/15">
                  <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-soft text-leaf">
                    <Icon size={30} />
                  </span>
                  <h3 className="text-xl font-semibold text-forest">{item.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-ink/65">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
