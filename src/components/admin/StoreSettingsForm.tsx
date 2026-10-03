"use client";

import { useState } from "react";
import { Plus, RotateCcw, Save, Store, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useStore } from "@/store/useStore";
import mockData from "@/data/mockData.json";
import type { Branch, StoreInfo } from "@/types";

const mockBranches = mockData.storeInfo.branches as Branch[];

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase text-forest/70">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-forest/15 bg-surface px-3 py-2.5 text-sm outline-none focus:border-leaf"
      />
    </label>
  );
}

function emptyBranch(): Branch {
  return {
    id: `branch-${Date.now().toString(36)}`,
    name: "",
    address: "",
    phone: "",
    hours: "",
    lat: 0,
    lon: 0,
  };
}

export function StoreSettingsForm() {
  const ready = useStore((s) => s.settingsReady);
  if (!ready) {
    return (
      <p className="rounded-2xl border border-forest/10 bg-white p-5 text-sm text-ink/50 shadow-sm">
        Cargando datos guardados...
      </p>
    );
  }
  return <StoreSettingsFields />;
}

function StoreSettingsFields() {
  const storeInfo = useStore((s) => s.storeInfo);
  const updateStoreInfo = useStore((s) => s.updateStoreInfo);
  const [form, setForm] = useState<StoreInfo>({
    ...storeInfo,
    branches: storeInfo.branches ?? [],
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const set = <K extends keyof StoreInfo>(key: K, value: string) =>
    setForm((f) => ({
      ...f,
      [key]: key === "shippingFee" ? Number(value) || 0 : value,
    }));

  const updateBranch = (id: string, updates: Partial<Branch>) =>
    setForm((f) => ({
      ...f,
      branches: f.branches.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));

  const addBranch = () =>
    setForm((f) => ({ ...f, branches: [...f.branches, emptyBranch()] }));

  const removeBranch = (id: string) =>
    setForm((f) => ({
      ...f,
      branches: f.branches.filter((b) => b.id !== id),
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    const result = await updateStoreInfo(form);
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
      className="space-y-6 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Teléfono" value={form.phone} onChange={(v) => set("phone", v)} />
        <Field
          label="WhatsApp (solo números, con código de país)"
          value={form.whatsapp}
          onChange={(v) => set("whatsapp", v)}
        />
        <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
        <Field
          label="Costo de envío (Bs., 0 = gratis)"
          type="number"
          value={form.shippingFee}
          onChange={(v) => set("shippingFee", v)}
        />
        <Field
          label="Instagram (URL)"
          value={form.instagram}
          onChange={(v) => set("instagram", v)}
        />
        <Field
          label="Facebook (URL)"
          value={form.facebook}
          onChange={(v) => set("facebook", v)}
        />
        <Field
          label="TikTok (URL)"
          value={form.tiktok}
          onChange={(v) => set("tiktok", v)}
        />
      </div>

      <div className="border-t border-soft pt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-forest/70">
            Sucursales
          </h3>
          <Button type="button" variant="outline" size="sm" onClick={addBranch}>
            <Plus size={14} />
            Agregar sucursal
          </Button>
        </div>

        {form.branches.length === 0 ? (
          <div className="rounded-xl border border-dashed border-forest/20 bg-surface px-4 py-8 text-center">
            <Store size={22} className="mx-auto mb-2 text-ink/40" />
            <p className="text-sm text-ink/50">
              No hay sucursales registradas. Agrega la primera con el botón de
              arriba.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.branches.map((b, i) => (
              <div
                key={b.id}
                className="rounded-xl border border-forest/10 bg-surface p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-forest">
                    Sucursal {i + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeBranch(b.id)}
                    className="rounded p-1 text-red-600"
                    aria-label="Eliminar sucursal"
                  >
                    <Trash2 size={16} className="pop-glow hover:text-red-500" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Nombre"
                    value={b.name}
                    onChange={(v) => updateBranch(b.id, { name: v })}
                  />
                  <Field
                    label="Teléfono"
                    value={b.phone}
                    onChange={(v) => updateBranch(b.id, { phone: v })}
                  />
                  <Field
                    label="Dirección"
                    value={b.address}
                    onChange={(v) => updateBranch(b.id, { address: v })}
                  />
                  <Field
                    label="Horario"
                    value={b.hours}
                    onChange={(v) => updateBranch(b.id, { hours: v })}
                  />
                  <Field
                    label="Latitud (mapa)"
                    type="number"
                    value={b.lat}
                    onChange={(v) => updateBranch(b.id, { lat: Number(v) || 0 })}
                  />
                  <Field
                    label="Longitud (mapa)"
                    type="number"
                    value={b.lon}
                    onChange={(v) => updateBranch(b.id, { lon: Number(v) || 0 })}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-soft pt-4">
        <Button type="submit" variant="secondary" disabled={saving}>
          <Save size={16} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        {saved && (
          <span className="text-sm text-leaf">Guardado — ya está en vivo.</span>
        )}
        {saveError && <span className="text-sm text-red-600">{saveError}</span>}
      </div>
    </form>
  );
}
