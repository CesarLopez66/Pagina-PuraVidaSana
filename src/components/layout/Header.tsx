"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useStore } from "@/store/useStore";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/nosotros", label: "Nosotros" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const cartCount = useStore((s) => s.getCartCount());
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const hydrated = useStore((s) => s.hydrated);
  const [cartBounce, setCartBounce] = useState(false);
  const prevCartCountRef = useRef<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = localSearch.trim();
    setSearchQuery(q);
    setMobileOpen(false);
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : "/catalogo");
  };

  useEffect(() => {
    if (!hydrated) return;
    if (prevCartCountRef.current === null) {
      prevCartCountRef.current = cartCount;
      return;
    }
    if (cartCount > prevCartCountRef.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 400);
      prevCartCountRef.current = cartCount;
      return () => clearTimeout(t);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount, hydrated]);

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
        <Logo size="md" />

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
              placeholder="Buscar vitaminas, suplementos..."
              className="w-full rounded-xl border border-forest/15 bg-white/70 py-3.5 pl-11 pr-3 text-lg outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20"
            />
          </div>
        </form>

        <button
          onClick={() => setCartOpen(true)}
          className="relative ml-auto p-1.5 text-forest md:ml-0"
          aria-label="Abrir carrito"
        >
          <ShoppingBag
            size={28}
            className={`pop-glow hover:text-leaf ${cartBounce ? "animate-cart-bounce" : ""}`}
          />
          {hydrated && cartCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-leaf px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>

        <button
          className="rounded-xl p-2.5 text-forest lg:hidden"
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
                placeholder="Buscar productos..."
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
