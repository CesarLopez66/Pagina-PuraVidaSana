import type { Metadata } from "next";
import { Fredoka, Kaushan_Script, Montserrat } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { StoreHydration } from "@/components/providers/StoreHydration";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const kaushanScript = Kaushan_Script({
  variable: "--font-kaushan",
  subsets: ["latin"],
  weight: "400",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Casa de Pura Vida Sana | Salud integral en La Paz",
  description:
    "Tienda de suplementos, vitaminas y productos naturales en La Paz, Bolivia. Pide online y coordina el pago por WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${kaushanScript.variable} ${fredoka.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <StoreHydration>
          <SiteChrome>{children}</SiteChrome>
        </StoreHydration>
      </body>
    </html>
  );
}
