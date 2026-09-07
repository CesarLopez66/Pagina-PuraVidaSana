"use client";

import type { SVGProps } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/store/useStore";

function IconInstagram({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 3h-2a5 5 0 0 0-5 5v3H6v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconTikTok({
  size = 24,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18a4 4 0 1 0 4-4V4" />
      <path d="M13 4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function Footer() {
  const storeInfo = useStore((s) => s.storeInfo);

  const socialLinks = [
    { name: "Instagram", href: storeInfo.instagram, Icon: IconInstagram },
    { name: "Facebook", href: storeInfo.facebook, Icon: IconFacebook },
    { name: "TikTok", href: storeInfo.tiktok, Icon: IconTikTok },
  ];

  return (
    <footer className="footer-glow relative mt-auto overflow-hidden bg-forest text-white">
      <div className="mx-auto max-w-7xl px-4 py-9 md:px-6">
        <div className="grid gap-10 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <Logo size="lg" onDark />
            <p className="mt-4 max-w-sm text-base leading-relaxed text-white/70">
              Suplementos, vitaminas y cosmética natural para tu bienestar
              diario en La Paz y todo Bolivia.
            </p>
          </div>

          <div className="sm:border-l sm:border-white/10 sm:pl-10">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-leaf">
              Contacto
            </h3>
            <ul className="space-y-3 text-base text-white/70">
              {(storeInfo.branches ?? []).map((b) => (
                <li key={b.id} className="flex items-start gap-2">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-leaf" />
                  <span>
                    <span className="block font-medium text-white/90">
                      {b.name}
                    </span>
                    {b.address}
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Phone size={18} className="shrink-0 text-leaf" />
                {storeInfo.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="shrink-0 text-leaf" />
                {storeInfo.email}
              </li>
            </ul>
          </div>

          <div className="sm:border-l sm:border-white/10 sm:pl-10">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-leaf">
              Redes sociales
            </h3>
            <div className="flex flex-col gap-3">
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="pop-glow flex items-center gap-3 text-base text-white/70 hover:text-leaf"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-current">
                    <Icon size={24} />
                  </span>
                  {name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 px-4 py-3 text-center text-sm text-white/45 md:px-6">
        © {new Date().getFullYear()} Casa de Pura Vida Sana · Demo comercial ·{" "}
        <Link href="/terminos" className="pop-glow hover:text-leaf">
          Términos y Privacidad
        </Link>{" "}
        ·{" "}
        <Link href="/admin" className="pop-glow hover:text-leaf">
          Acceso administrador
        </Link>
      </div>
    </footer>
  );
}
