import type { CustomFont } from "@/types";

export type FontRole = "body" | "display" | "script";

export const CUSTOM_FONT_FORMATS = {
  woff2: "woff2",
  woff: "woff",
  ttf: "truetype",
  otf: "opentype",
} as const;

export interface FontOption {
  id: string;
  label: string;
  variable: string;
}

export const BODY_FONTS: FontOption[] = [
  { id: "montserrat", label: "Montserrat", variable: "--font-montserrat" },
  { id: "nunito", label: "Nunito", variable: "--font-nunito" },
  { id: "outfit", label: "Outfit", variable: "--font-outfit" },
  { id: "source-sans", label: "Source Sans", variable: "--font-source-sans" },
  { id: "lora", label: "Lora", variable: "--font-lora" },
];

export const DISPLAY_FONTS: FontOption[] = [
  { id: "fredoka", label: "Fredoka", variable: "--font-fredoka" },
  { id: "playfair", label: "Playfair Display", variable: "--font-playfair" },
  { id: "montserrat", label: "Montserrat", variable: "--font-montserrat" },
  { id: "nunito", label: "Nunito", variable: "--font-nunito" },
  { id: "outfit", label: "Outfit", variable: "--font-outfit" },
  { id: "lora", label: "Lora", variable: "--font-lora" },
];

export const SCRIPT_FONTS: FontOption[] = [
  { id: "kaushan", label: "Kaushan Script", variable: "--font-kaushan" },
  { id: "great-vibes", label: "Great Vibes", variable: "--font-great-vibes" },
  { id: "pacifico", label: "Pacifico", variable: "--font-pacifico" },
  { id: "dancing-script", label: "Dancing Script", variable: "--font-dancing-script" },
  { id: "caveat", label: "Caveat", variable: "--font-caveat" },
  { id: "courgette", label: "Courgette (logo)", variable: "--font-courgette" },
];

const BY_ROLE: Record<FontRole, FontOption[]> = {
  body: BODY_FONTS,
  display: DISPLAY_FONTS,
  script: SCRIPT_FONTS,
};

export function fontsFor(role: FontRole): FontOption[] {
  return BY_ROLE[role];
}

export function isFontId(role: FontRole, id: string | undefined): id is string {
  return !!id && BY_ROLE[role].some((font) => font.id === id);
}

export function fontVariable(role: FontRole, id: string): string {
  return (
    BY_ROLE[role].find((font) => font.id === id)?.variable ??
    BY_ROLE[role][0].variable
  );
}

export function isCustomFontId(id: string | undefined, fonts: CustomFont[]): boolean {
  return !!id && fonts.some((font) => font.id === id);
}

// Familia lista para usarse en font-family: la subida por el admin, o la
// variable de una fuente incluida en el sitio.
export function activeFontFamily(
  role: FontRole,
  id: string,
  fonts: CustomFont[]
): string {
  if (isCustomFontId(id, fonts)) return `"${id}"`;
  return `var(${fontVariable(role, id)})`;
}

export function customFontFaceCss(fonts: CustomFont[]): string {
  return fonts
    .map(
      (font) =>
        `@font-face{font-family:"${font.id}";src:url("${font.url}") format("${font.format}");font-display:swap;}`
    )
    .join("\n");
}
