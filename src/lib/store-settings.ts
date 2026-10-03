import mockData from "@/data/mockData.json";
import type { Branch, StoreInfo, StoreSettings } from "@/types";
import { WHEEL_PRIZES, type WheelPrize } from "@/lib/wheel";

export const STORE_SETTINGS_KEY = "store-settings.json";

export const defaultStoreInfo: StoreInfo = {
  name: mockData.storeInfo.name,
  tagline: mockData.storeInfo.tagline,
  phone: mockData.storeInfo.phone,
  whatsapp: mockData.storeInfo.whatsapp,
  email: mockData.storeInfo.email,
  branches: mockData.storeInfo.branches as Branch[],
  instagram: "",
  facebook: "",
  tiktok: "",
  shippingFee: 0,
};

export const defaultStoreSettings: StoreSettings = {
  storeInfo: defaultStoreInfo,
  wheelPrizes: WHEEL_PRIZES,
  wheelEnabled: true,
};

function text(value: unknown, fallback: string, max = 300): string {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function num(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
}

function sanitizeBranch(value: unknown, index: number): Branch | null {
  if (!value || typeof value !== "object") return null;
  const b = value as Record<string, unknown>;
  return {
    id: text(b.id, "", 60) || `branch-${index}`,
    name: text(b.name, ""),
    address: text(b.address, ""),
    phone: text(b.phone, "", 60),
    hours: text(b.hours, ""),
    lat: num(b.lat, 0, -90, 90),
    lon: num(b.lon, 0, -180, 180),
  };
}

// Valida y completa lo que llega del panel (o lo guardado) con los valores
// por defecto, para que un dato faltante o malformado nunca rompa el sitio.
export function sanitizeStoreSettings(input: unknown): StoreSettings {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const info = (raw.storeInfo && typeof raw.storeInfo === "object"
    ? raw.storeInfo
    : {}) as Record<string, unknown>;
  const d = defaultStoreInfo;

  const branches = Array.isArray(info.branches)
    ? (info.branches
        .slice(0, 20)
        .map(sanitizeBranch)
        .filter(Boolean) as Branch[])
    : d.branches;

  const prizes: WheelPrize[] = Array.isArray(raw.wheelPrizes)
    ? raw.wheelPrizes
        .slice(0, 12)
        .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
        .map((p) => ({
          label: text(p.label, "", 60),
          weight: num(p.weight, 0, 0, 1000),
        }))
        .filter((p) => p.label)
    : [];

  return {
    storeInfo: {
      name: text(info.name, d.name),
      tagline: text(info.tagline, d.tagline),
      phone: text(info.phone, d.phone, 60),
      whatsapp: text(info.whatsapp, d.whatsapp, 30).replace(/\D/g, ""),
      email: text(info.email, d.email, 120),
      branches,
      instagram: text(info.instagram, d.instagram),
      facebook: text(info.facebook, d.facebook),
      tiktok: text(info.tiktok, d.tiktok),
      shippingFee: num(info.shippingFee, d.shippingFee, 0, 100000),
    },
    wheelPrizes: prizes.length >= 2 ? prizes : WHEEL_PRIZES,
    wheelEnabled:
      typeof raw.wheelEnabled === "boolean" ? raw.wheelEnabled : true,
  };
}
