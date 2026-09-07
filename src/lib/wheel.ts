export interface WheelPrize {
  label: string;
  weight: number;
}

export const WHEEL_PRIZES: WheelPrize[] = [
  { label: "5% de descuento", weight: 30 },
  { label: "10% de descuento", weight: 25 },
  { label: "Envío gratis", weight: 15 },
  { label: "15% de descuento", weight: 15 },
  { label: "Sigue participando", weight: 10 },
  { label: "20% de descuento", weight: 5 },
];

export function pickWeightedPrize(
  prizes: WheelPrize[] = WHEEL_PRIZES
): { prize: WheelPrize; index: number } {
  const total = prizes.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < prizes.length; i++) {
    roll -= prizes[i].weight;
    if (roll <= 0) return { prize: prizes[i], index: i };
  }
  return { prize: prizes[prizes.length - 1], index: prizes.length - 1 };
}

export function generateWheelCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `RUEDA-${code}`;
}
