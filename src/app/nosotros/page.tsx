"use client";

import { Heart, Mountain, Users } from "lucide-react";
import { PageBackground } from "@/components/layout/PageBackground";
import { useStore } from "@/store/useStore";

const icons = [Mountain, Heart, Users];

export default function NosotrosPage() {
  const about = useStore((s) => s.siteContent.about);

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
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-16 sm:grid-cols-2 md:px-6 md:py-20 lg:grid-cols-3">
          {about.pillars.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div key={`${item.title}-${index}`} className="glass-panel rounded-2xl p-7">
                <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-leaf">
                  <Icon size={30} />
                </span>
                <h2 className="text-xl font-semibold text-forest">{item.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink/65">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
