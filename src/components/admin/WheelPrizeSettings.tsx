"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import type { WheelPrize } from "@/lib/wheel";

export function WheelPrizeSettings() {
  const ready = useStore((s) => s.settingsReady);
  if (!ready) {
    return (
      <p className="rounded-2xl border border-forest/10 bg-white p-5 text-sm text-ink/50 shadow-sm">
        Cargando datos guardados...
      </p>
    );
  }
  return <WheelPrizeFields />;
}

function WheelPrizeFields() {
  const wheelPrizes = useStore((s) => s.wheelPrizes);
  const updateWheelPrizes = useStore((s) => s.updateWheelPrizes);
  const [prizes, setPrizes] = useState<WheelPrize[]>(wheelPrizes);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updatePrize = (index: number, updates: Partial<WheelPrize>) => {
    setPrizes((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const result = await updateWheelPrizes(prizes);
    setSaving(false);
    if (!result.ok) {
      setSaveError(result.message ?? "No se pudo guardar.");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm"
    >
      <p className="text-sm text-ink/60">
        Ajusta el texto y la probabilidad relativa (peso) de cada premio. A
        mayor peso, más probable que salga.
      </p>
      <div className="space-y-2">
        {prizes.map((prize, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={prize.label}
              onChange={(e) => updatePrize(i, { label: e.target.value })}
              className="flex-1 rounded-xl border border-forest/15 bg-surface px-3 py-2 text-sm outline-none focus:border-leaf"
            />
            <input
              type="number"
              min={0}
              value={prize.weight}
              onChange={(e) =>
                updatePrize(i, { weight: Number(e.target.value) || 0 })
              }
              className="w-24 rounded-xl border border-forest/15 bg-surface px-3 py-2 text-sm outline-none focus:border-leaf"
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-soft pt-4">
        <Button type="submit" variant="secondary" disabled={saving}>
          <Save size={16} />
          {saving ? "Guardando..." : "Guardar premios"}
        </Button>
        {saved && (
          <span className="text-sm text-leaf">Guardado — ya está en vivo.</span>
        )}
        {saveError && <span className="text-sm text-red-600">{saveError}</span>}
      </div>
    </form>
  );
}
