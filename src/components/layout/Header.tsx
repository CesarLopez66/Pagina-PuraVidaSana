"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/store/useStore";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const nav = useStore((s) => s.siteContent.nav);
  const links = [
    { href: "/", label: nav.home },
    { href: "/catalogo", label: nav.catalog },
    { href: "/nosotros", label: nav.about },
  ];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const [scrolled, setScrolled] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localSearch.trim();
    setSearchQuery(q);
    setMobileOpen(false);
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 rounded-b-3xl bg-white/60 backdrop-blur-sm transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-forest/10" : "shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-5 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Logo size="md" />
          {(nav.brandName || nav.brandTagline) && (
            <Link href="/" className="hidden min-w-0 leading-tight sm:block">
              {nav.brandName && (
                <p className="font-display truncate text-xl font-bold text-forest">
                  {nav.brandName}
                </p>
              )}
              {nav.brandTagline && (
                <p className="font-script truncate text-base text-leaf">
                  {nav.brandTagline}
                </p>
              )}
            </Link>
          )}
        </div>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-5 py-3 text-lg font-medium ${
                  active
                    ? "pop-glow-active text-leaf"
                    : "pop-glow text-ink/70 hover:text-leaf"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden min-w-0 flex-1 max-w-md items-center md:flex"
        >
          <div className="relative w-full">
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={nav.searchPlaceholder}
              className="w-full rounded-xl border border-forest/15 bg-white/70 py-3.5 pl-11 pr-3 text-lg outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20"
            />
          </div>
        </form>

        <button
          className="ml-auto rounded-xl p-2.5 text-forest md:ml-0 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menú"
        >
          {mobileOpen ? (
            <X size={30} className="pop-glow hover:text-leaf" />
          ) : (
            <Menu size={30} className="pop-glow hover:text-leaf" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-dropdown-in rounded-b-3xl border-t border-white/40 bg-white/80 px-5 py-5 backdrop-blur-xl lg:hidden">
          <form onSubmit={submitSearch} className="mb-3">
            <div className="relative">
              <Search
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder={nav.searchPlaceholder}
                className="w-full rounded-xl border border-forest/15 bg-white/70 py-3.5 pl-11 pr-3 text-lg outline-none focus:border-leaf"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-5 py-3.5 text-lg font-medium ${
                  pathname === link.href
                    ? "pop-glow-active text-leaf"
                    : "pop-glow text-ink/80 hover:text-leaf"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
