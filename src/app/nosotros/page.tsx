import { Heart, Mountain, Users } from "lucide-react";
import { PageBackground } from "@/components/layout/PageBackground";

export default function NosotrosPage() {
  return (
    <div>
      <PageBackground />
      <section className="relative isolate overflow-hidden py-24 md:py-32">
        <div className="relative mx-auto max-w-3xl px-4 text-center text-white md:px-6">
          <p className="text-stroke-thin font-script text-2xl text-leaf drop-shadow-md">
            Nuestra esencia
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold drop-shadow-lg md:text-5xl">
            Casa de Pura Vida Sana
          </h1>
          <p className="text-stroke-thin mt-5 text-lg leading-relaxed text-white/90 drop-shadow-md">
            Nacimos en La Paz con una idea simple: acercar bienestar natural
            confiable a familias bolivianas, con asesoría cercana y productos
            seleccionados para la vida en altura.
          </p>
        </div>
      </section>

      <section className="leaf-pattern">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 py-16 sm:grid-cols-2 md:px-6 md:py-20 lg:grid-cols-3">
          {[
            {
              icon: Mountain,
              title: "Hechos en altura",
              text: "Entendemos el clima seco, el ritmo paceño y las necesidades reales de energía e hidratación.",
            },
            {
              icon: Heart,
              title: "Natural primero",
              text: "Priorizamos fórmulas limpias, cosméticos botánicos y suplementos de calidad verificable.",
            },
            {
              icon: Users,
              title: "Comunidad local",
              text: "Acompañamos a cada cliente con recomendaciones honestas y atención humana.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="glass-panel rounded-2xl p-7">
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
