"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";

export function WheelStatusSettings() {
  const wheelEnabled = useStore((s) => s.wheelEnabled);
  const setWheelEnabled = useStore((s) => s.setWheelEnabled);
  const hasPlayedWheel = useStore((s) => s.hasPlayedWheel);
  const resetWheelPlayed = useStore((s) => s.resetWheelPlayed);
  const [justReset, setJustReset] = useState(false);

  const handleReset = () => {
    resetWheelPlayed();
    setJustReset(true);
    setTimeout(() => setJustReset(false), 2000);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-forest">
            Ruleta visible en el sitio
          </p>
          <p className="mt-0.5 text-xs text-ink/55">
            Actívala para lanzar una promoción y desactívala cuando no haya
            premios vigentes. El botón flotante aparece o desaparece al
            instante, sin tocar código.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={wheelEnabled}
          aria-label="Activar o desactivar la ruleta"
          onClick={() => setWheelEnabled(!wheelEnabled)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            wheelEnabled ? "bg-leaf" : "bg-ink/20"
          }`}
        >
          <span
            className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              wheelEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3 border-t border-soft pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-forest">
            Reiniciar participación en este navegador
          </p>
          <p className="mt-0.5 text-xs text-ink/55">
            Cada cliente nuevo ya puede jugar por su cuenta: el límite de
            &quot;una vez&quot; se guarda por navegador, no de forma global.
            Usa esto solo para volver a probar la ruleta desde este mismo
            dispositivo, por ejemplo al preparar una nueva promoción.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          disabled={!hasPlayedWheel}
          className="shrink-0"
        >
          <RotateCcw size={14} />
          {justReset ? "Listo" : "Permitir jugar de nuevo"}
        </Button>
      </div>
    </div>
  );
}
