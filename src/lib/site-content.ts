import type { CustomFont, SiteContent } from "@/types";
import { CUSTOM_FONT_FORMATS, isCustomFontId, isFontId } from "@/lib/fonts";

export const DEFAULT_BACKGROUND =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&q=80";

// El inicio pasó de "frase chica + título largo" a "nombre grande + lema +
// descripción". Si lo guardado conserva el título de la versión anterior,
// se reemplazan los tres textos por los nuevos para que encajen en ese orden.
const LEGACY_HERO_TITLE = "Salud integral natural en el corazón de La Paz";

function migrateHero(hero: SiteContent["hero"]): SiteContent["hero"] {
  if (hero.title !== LEGACY_HERO_TITLE) return hero;
  const { eyebrow, title, subtitle } = defaultSiteContent.hero;
  return { ...hero, eyebrow, title, subtitle };
}

export const defaultSiteContent: SiteContent = {
  nav: {
    logoUrl: "/logo.png",
    brandName: "",
    brandTagline: "",
    home: "Inicio",
    catalog: "Catálogo",
    about: "Nosotros",
    searchPlaceholder: "Buscar vitaminas, suplementos...",
  },
  typography: {
    body: "montserrat",
    display: "fredoka",
    script: "kaushan",
  },
  customFonts: [],
  hero: {
    eyebrow: "Pura Vida Sana",
    title: "Tu casa natural, más cerca de ti.",
    subtitle:
      "Productos naturales, suplementos y vitaminas para acompañarte en tu bienestar.",
    footnote: "Envíos a La Paz y todo el país · Pedido y pago por WhatsApp",
    backgroundImage: DEFAULT_BACKGROUND,
  },
  about: {
    eyebrow: "Nuestra esencia",
    title: "Casa de Pura Vida Sana",
    intro:
      "Nacimos en La Paz con una idea simple: acercar bienestar natural confiable a familias bolivianas, con asesoría cercana y productos seleccionados para la vida en altura.",
    pillars: [
      {
        title: "Hechos en altura",
        text: "Entendemos el clima seco, el ritmo paceño y las necesidades reales de energía e hidratación.",
      },
      {
        title: "Natural primero",
        text: "Priorizamos fórmulas limpias, cosméticos botánicos y suplementos de calidad verificable.",
      },
      {
        title: "Comunidad local",
        text: "Acompañamos a cada cliente con recomendaciones honestas y atención humana.",
      },
    ],
  },
  benefits: {
    eyebrow: "Por qué elegirnos",
    title: "Beneficios que se sienten",
    items: [
      {
        title: "Envíos a La Paz y todo el país",
        text: "Entrega local rápida y despacho nacional con seguimiento.",
      },
      {
        title: "Productos 100% Naturales",
        text: "Selección cuidada de fórmulas limpia y origen confiable.",
      },
      {
        title: "Confirmación directa por WhatsApp",
        text: "Coordina tu pedido y la forma de pago con nuestro equipo.",
      },
    ],
  },
  footer: {
    description:
      "Suplementos, vitaminas y cosmética natural para tu bienestar diario en La Paz y todo Bolivia.",
  },
};

const FONT_FORMATS = new Set<string>(Object.values(CUSTOM_FONT_FORMATS));

function sanitizeCustomFonts(value: unknown): CustomFont[] {
  if (!Array.isArray(value)) return [];
  const fonts: CustomFont[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const font = item as Partial<CustomFont>;
    if (
      typeof font.id !== "string" ||
      !/^custom-[a-z0-9]+$/.test(font.id) ||
      typeof font.label !== "string" ||
      !font.label.trim() ||
      typeof font.url !== "string" ||
      !/^\/api\/uploads\/[\w-]+\.(woff2|woff|ttf|otf)$/.test(font.url) ||
      typeof font.format !== "string" ||
      !FONT_FORMATS.has(font.format)
    ) {
      continue;
    }
    fonts.push({
      id: font.id,
      label: font.label.trim().slice(0, 60),
      url: font.url,
      format: font.format as CustomFont["format"],
    });
    if (fonts.length >= 12) break;
  }
  return fonts;
}

function threeItems(
  value: { title?: string; text?: string }[] | undefined,
  fallback: { title: string; text: string }[]
) {
  return [0, 1, 2].map((index) => ({
    title: value?.[index]?.title ?? fallback[index].title,
    text: value?.[index]?.text ?? fallback[index].text,
  }));
}

function pickFont(
  role: "body" | "display" | "script",
  id: string | undefined,
  fonts: CustomFont[]
): string {
  if (id && (isFontId(role, id) || isCustomFontId(id, fonts))) return id;
  return defaultSiteContent.typography[role];
}

export function mergeSiteContent(value: Partial<SiteContent> | undefined): SiteContent {
  const pillars = value?.about?.pillars?.filter((p) => p && (p.title || p.text));
  const customFonts = sanitizeCustomFonts(value?.customFonts);
  return {
    nav: {
      ...defaultSiteContent.nav,
      ...value?.nav,
      logoUrl: value?.nav?.logoUrl || defaultSiteContent.nav.logoUrl,
    },
    typography: {
      body: pickFont("body", value?.typography?.body, customFonts),
      display: pickFont("display", value?.typography?.display, customFonts),
      script: pickFont("script", value?.typography?.script, customFonts),
    },
    customFonts,
    hero: migrateHero({ ...defaultSiteContent.hero, ...value?.hero }),
    about: {
      ...defaultSiteContent.about,
      ...value?.about,
      pillars: threeItems(pillars, defaultSiteContent.about.pillars),
    },
    benefits: {
      eyebrow: value?.benefits?.eyebrow ?? defaultSiteContent.benefits.eyebrow,
      title: value?.benefits?.title ?? defaultSiteContent.benefits.title,
      items: threeItems(value?.benefits?.items, defaultSiteContent.benefits.items),
    },
    footer: {
      description:
        value?.footer?.description ?? defaultSiteContent.footer.description,
    },
  };
}
