"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquareOff,
  RefreshCw,
  Star,
  TriangleAlert,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import type { GoogleReviewsResponse, Review } from "@/types";

type Status = "loading" | "error" | "ready";

const AUTO_ADVANCE_MS = 2500;

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="glass-panel flex h-full flex-col rounded-2xl p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-soft text-base font-semibold text-forest">
          {review.author.charAt(0).toUpperCase()}
        </span>
        <div>
          <p className="text-base font-semibold text-forest">{review.author}</p>
          <p className="text-sm text-ink/45">{review.relativeDate}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-0.5 text-amber-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
        ))}
      </div>
      <p className="mt-3 text-base leading-relaxed text-ink/65">{review.comment}</p>
    </div>
  );
}

// Cuántos "asientos" tiene la rueda 3D. Con solo 2 reseñas reales, se
// reparten cíclicamente entre los asientos (mismo contenido real, sin
// fabricar nada nuevo) para que la rueda se vea poblada en vez de vacía.
const RING_SLOTS = 8;
const STEP_DEG = 360 / RING_SLOTS;
const RADIUS = 480;
// Más allá de esta distancia angular al frente, la tarjeta se desvanece
// (da la ilusión de "estar lejos, del otro lado del círculo").
const FADE_RANGE_DEG = 100;
// Cuánto "caen" verticalmente las tarjetas mientras se alejan del frente,
// siguiendo una curva (1 - cos) en vez de una rotación plana: sin esto,
// las tarjetas solo giran en el sitio y no se siente un círculo real.
const ARC_DEPTH = 40;

function normalizeAngle(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Ángulo de rotación de la rueda: crece o decrece sin límite, así que
  // "volver de la última reseña a la primera" no es un salto que corregir
  // — es, matemáticamente, el mismo giro continuo que cualquier otro paso.
  const angleRef = useRef(0);
  const animRef = useRef<number | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slots = Array.from({ length: RING_SLOTS }, (_, idx) => ({
    key: `slot-${idx}`,
    review: reviews[idx % reviews.length],
    angle: idx * STEP_DEG,
  }));

  const applyLook = useCallback(() => {
    const current = angleRef.current;
    slots.forEach((slot, idx) => {
      const card = cardRefs.current[idx];
      if (!card) return;
      // Ángulo efectivo del asiento respecto al frente de la cámara,
      // llevado al rango (-180, 180] para medir "qué tan de lado está".
      let effective = normalizeAngle(slot.angle + current);
      if (effective > 180) effective -= 360;
      const distDeg = Math.min(Math.abs(effective), FADE_RANGE_DEG);
      const linear = 1 - distDeg / FADE_RANGE_DEG;
      // smoothstep: caída más orgánica que una interpolación lineal
      const ratio = linear * linear * (3 - 2 * linear);
      const opacity = 0.1 + ratio * 0.9;
      const visible = ratio > 0.04;

      // El arco vertical se aplica en la función de traslado más externa
      // (fuera del rotateY), así queda en coordenadas de pantalla planas
      // y no se deforma por la rotación 3D de la propia tarjeta.
      const rad = (effective * Math.PI) / 180;
      const arcY = (1 - Math.cos(rad)) * ARC_DEPTH;

      card.style.transform = `translate(-50%, calc(-50% + ${arcY}px)) rotateY(${effective}deg) translateZ(${RADIUS}px)`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(Math.round(ratio * 100));
      card.style.pointerEvents = visible ? "auto" : "none";
    });
  }, [slots]);

  const animateBy = useCallback(
    (direction: 1 | -1, duration: number) => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);

      const start = angleRef.current;
      // Signo invertido: para que el contenido fluya de derecha a
      // izquierda (el siguiente elemento "entra" desde la derecha), la
      // rueda gira en sentido contrario al índice que avanza.
      const delta = -direction * STEP_DEG;
      const startTime = performance.now();
      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

      const frame = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        angleRef.current = start + delta * easeInOutSine(t);
        applyLook();
        if (t < 1) {
          animRef.current = requestAnimationFrame(frame);
        } else {
          animRef.current = null;
          // Higiene: un giro de 360° es visualmente idéntico, así que
          // esto no cambia nada en pantalla.
          angleRef.current = normalizeAngle(angleRef.current);
        }
      };
      animRef.current = requestAnimationFrame(frame);
    },
    [applyLook]
  );

  const restartAutoAdvance = useCallback(() => {
    if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    if (reviews.length <= 1) return;
    autoTimerRef.current = setInterval(() => animateBy(1, 1400), AUTO_ADVANCE_MS);
  }, [reviews.length, animateBy]);

  const handleArrow = (direction: 1 | -1) => {
    animateBy(direction, 550);
    restartAutoAdvance();
  };

  useLayoutEffect(() => {
    applyLook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews]);

  useEffect(() => {
    restartAutoAdvance();
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [restartAutoAdvance]);

  if (reviews.length === 0) return null;

  return (
    <div
      className="relative mx-auto h-80 max-w-5xl"
      onMouseEnter={() => {
        if (autoTimerRef.current) clearInterval(autoTimerRef.current);
      }}
      onMouseLeave={restartAutoAdvance}
    >
      <button
        type="button"
        aria-label="Reseña anterior"
        onClick={() => handleArrow(-1)}
        className="absolute left-1 top-1/2 z-20 -translate-y-1/2 p-1.5 text-forest sm:-left-10"
      >
        <ChevronLeft
          size={40}
          strokeWidth={2.5}
          className="pop-glow drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] hover:text-leaf"
        />
      </button>

      <div
        className="relative h-full"
        style={{ perspective: "1800px" }}
      >
        {slots.map((slot, idx) => (
          <div
            key={slot.key}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="absolute left-1/2 top-1/2 w-72 transition-opacity duration-200 sm:w-80"
            style={{ backfaceVisibility: "hidden" }}
          >
            <ReviewCard review={slot.review} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Siguiente reseña"
        onClick={() => handleArrow(1)}
        className="absolute right-1 top-1/2 z-20 -translate-y-1/2 p-1.5 text-forest sm:-right-10"
      >
        <ChevronRight
          size={40}
          strokeWidth={2.5}
          className="pop-glow drop-shadow-[0_1px_4px_rgba(0,0,0,0.45)] hover:text-leaf"
        />
      </button>
    </div>
  );
}

export function Reviews() {
  const [data, setData] = useState<GoogleReviewsResponse | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const load = useCallback(() => {
    let active = true;
    setStatus("loading");
    fetch("/api/reviews")
      .then((r) => {
        if (!r.ok) throw new Error("No se pudieron cargar las reseñas.");
        return r.json();
      })
      .then((d: GoogleReviewsResponse) => {
        if (!active) return;
        setData(d);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => load(), [load]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <Reveal className="glass-panel mx-auto mb-12 max-w-xl rounded-2xl px-7 py-7 text-center">
        <p className="font-script text-2xl text-leaf">Lo que dicen de nosotros</p>
        <h2 className="font-display mt-1 text-4xl font-bold text-forest md:text-5xl">
          Reseñas de clientes
        </h2>
        {status === "ready" && data && (
          <div className="mt-4 flex items-center justify-center gap-2 text-base text-ink/60">
            <span className="flex items-center gap-0.5 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={19}
                  fill={i < Math.round(data.rating) ? "currentColor" : "none"}
                />
              ))}
            </span>
            <span>
              {data.rating.toFixed(1)} de 5 · {data.totalReviews} reseñas
              {data.source === "mock" ? " (muestra)" : ""}
            </span>
          </div>
        )}
      </Reveal>

      {status === "loading" && (
        <div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Cargando reseñas"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="glass-panel h-48 animate-pulse rounded-2xl p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 rounded-full bg-soft" />
                <div className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-soft" />
                  <div className="h-3 w-16 rounded bg-soft" />
                </div>
              </div>
              <div className="mt-4 h-3 w-full rounded bg-soft" />
              <div className="mt-2 h-3 w-5/6 rounded bg-soft" />
              <div className="mt-2 h-3 w-2/3 rounded bg-soft" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="glass-panel mx-auto max-w-md rounded-2xl p-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <TriangleAlert size={22} />
          </span>
          <p className="text-base text-ink/65">
            No pudimos cargar las reseñas. Revisa tu conexión e intenta de
            nuevo.
          </p>
          <Button variant="outline" className="mt-4" onClick={load}>
            <RefreshCw size={16} />
            Reintentar
          </Button>
        </div>
      )}

      {status === "ready" && data && data.reviews.length === 0 && (
        <div className="glass-panel mx-auto max-w-md rounded-2xl p-8 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-soft text-leaf">
            <MessageSquareOff size={22} />
          </span>
          <p className="text-base text-ink/65">
            Todavía no tenemos reseñas para mostrar aquí.
          </p>
        </div>
      )}

      {status === "ready" && data && data.reviews.length > 0 && (
        <ReviewsCarousel reviews={data.reviews} />
      )}
    </section>
  );
}
