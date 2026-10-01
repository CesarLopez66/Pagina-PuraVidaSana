"use client";

import { useEffect, useRef } from "react";
import { DEFAULT_BACKGROUND } from "@/lib/site-content";
import { useStore } from "@/store/useStore";

export function PageBackground() {
  const imageRef = useRef<HTMLDivElement>(null);
  const backgroundImage = useStore(
    (s) => s.siteContent.hero.backgroundImage || DEFAULT_BACKGROUND
  );
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const updateTarget = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      targetProgress.current =
        scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    };

    let raf = 0;
    const tick = () => {
      // Easing: la posición sigue al scroll con una leve inercia, como si
      // la mirada subiera hacia la copa del árbol y bajara hacia el
      // sendero en vez de saltar de golpe.
      currentProgress.current +=
        (targetProgress.current - currentProgress.current) * 0.06;
      // Rango centrado en la franja de troncos (donde está la copa clara y
      // el sendero, los dos puntos de interés de la foto). En pantallas muy
      // anchas y bajas, "cover" recorta mucho más el alto de la imagen que
      // el ancho; un rango extremo (p.ej. 15%) dejaba la copa o el sendero
      // completamente fuera de encuadre, mostrando solo troncos.
      const positionY = 35 + currentProgress.current * 30;
      image.style.backgroundPosition = `center ${positionY}%`;
      raf = requestAnimationFrame(tick);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={imageRef}
        className="h-full w-full scale-105 bg-cover blur-sm"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition: "center 35%",
        }}
      />
    </div>
  );
}
