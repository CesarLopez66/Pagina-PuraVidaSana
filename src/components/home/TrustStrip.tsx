import { Leaf, MapPinned, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: MapPinned, label: "Envíos a La Paz y todo el país" },
  { icon: Leaf, label: "100% Natural" },
  { icon: MessageCircle, label: "Pedido y pago por WhatsApp" },
];

export function TrustStrip() {
  return (
    <section className="px-4 py-10 md:px-6">
      <Reveal className="glass-panel mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 rounded-2xl px-7 py-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 text-base font-medium text-forest"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold">
                <Icon size={19} />
              </span>
              {item.label}
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
