"use client";

import { activeFontFamily, customFontFaceCss } from "@/lib/fonts";
import { defaultSiteContent } from "@/lib/site-content";
import { useStore } from "@/store/useStore";

export function FontTheme() {
  const typography = useStore(
    (s) => s.siteContent.typography ?? defaultSiteContent.typography
  );
  const customFonts = useStore(
    (s) => s.siteContent.customFonts ?? defaultSiteContent.customFonts
  );

  const css = [
    customFontFaceCss(customFonts),
    `:root{--font-body-active:${activeFontFamily("body", typography.body, customFonts)};--font-display-active:${activeFontFamily("display", typography.display, customFonts)};--font-script-active:${activeFontFamily("script", typography.script, customFonts)};}`,
  ].join("\n");

  return <style>{css}</style>;
}
