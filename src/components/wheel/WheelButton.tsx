"use client";

import { usePathname } from "next/navigation";
import { Gift } from "lucide-react";
import { useStore } from "@/store/useStore";

export function WheelButton() {
  const pathname = usePathname();
  const hasPlayedWheel = useStore((s) => s.hasPlayedWheel);
  const wheelEnabled = useStore((s) => s.wheelEnabled);
  const setWheelOpen = useStore((s) => s.setWheelOpen);

  if (pathname.startsWith("/admin") || hasPlayedWheel || !wheelEnabled)
    return null;

  return (
    <button
      onClick={() => setWheelOpen(true)}
      aria-label="Gana un descuento"
      className="animate-soft-pulse fixed bottom-5 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-white shadow-lg shadow-forest/25 md:bottom-6 md:left-6"
    >
      <Gift size={24} className="pop-glow hover:text-forest" />
    </button>
  );
}
