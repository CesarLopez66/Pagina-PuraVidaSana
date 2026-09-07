import Link from "next/link";
import { Dumbbell, Flower2, Pill, Salad } from "lucide-react";
import type { Category } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

const items: Array<{
  category: Category;
  title: string;
  description: string;
  icon: typeof Pill;
  image: string;
}> = [
  {
    category: "Suplementos",
    title: "Suplementos",
    description: "Adaptógenos, omega y apoyo diario",
    icon: Salad,
    image: "/categorias/suplementos.png",
  },
  {
    category: "Vitaminas",
    title: "Vitaminas",
    description: "Defensas y energía esencial",
    icon: Pill,
    image: "/categorias/vitaminas.png",
  },
  {
    category: "Cosmética Natural",
    title: "Cosmética Natural",
    description: "Cuidado botánico sin agresivos",
    icon: Flower2,
    image: "/categorias/cosmetica-natural.png",
  },
  {
    category: "Proteínas",
    title: "Proteínas",
    description: "Rendimiento y recuperación",
    icon: Dumbbell,
    image: "/categorias/proteinas.png",
  },
];

export function Categories() {
  return (
    <section className="leaf-pattern">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <Reveal className="glass-panel mb-12 max-w-2xl rounded-2xl px-7 py-7">
          <p className="font-script text-2xl text-leaf">Categorías destacadas</p>
          <h2 className="font-display mt-1 text-4xl font-bold text-forest md:text-5xl">
            Elige tu camino de bienestar
          </h2>
          <p className="mt-4 text-lg text-ink/65">
            Explora nuestras líneas más pedidas, pensadas para el clima y ritmo de
            vida en La Paz.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.category} delay={i * 80} className="h-full">
                <Link
                  href={`/catalogo?categoria=${encodeURIComponent(item.category)}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-white/45 transition hover:shadow-xl hover:shadow-forest/20"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/10" />
                  <div className="relative flex min-h-[300px] flex-col justify-end p-6 text-white">
                    <span className="glass-panel mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full border-white/30 bg-leaf/70 text-white">
                      <Icon size={23} />
                    </span>
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="text-stroke-thin mt-1.5 min-h-12 text-base text-white/80">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
