"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
  // "glass": vidrio esmerilado, para vitrina/experiencia de compra
  // (detalle de producto, ruleta). "solid": panel opaco y estable,
  // para formularios con muchos campos donde importa más la
  // claridad y la confianza que el estilo (checkout, alta de
  // producto en el admin).
  variant?: "glass" | "solid";
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
  variant = "glass",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const width =
    size === "xl" ? "max-w-3xl" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] animate-backdrop-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-modal-in relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl shadow-2xl sm:rounded-2xl ${
          variant === "glass"
            ? "glass-panel"
            : "border border-forest/10 bg-white"
        } ${width}`}
      >
        <div
          className={`sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 ${
            variant === "glass"
              ? "border-white/40 bg-white/70 backdrop-blur-sm"
              : "border-soft bg-white"
          }`}
        >
          <h2 className="text-lg font-semibold text-forest">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink/60"
            aria-label="Cerrar"
          >
            <X size={18} className="pop-glow hover:text-leaf" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
