"use client";

import { useEffect, useState } from "react";
import { useCheckout } from "./CheckoutProvider";

const LINKS = [
  { href: "#evento", label: "El evento" },
  { href: "#formato", label: "Formato" },
  { href: "#tardeo", label: "Tardeo" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const { open } = useCheckout();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? "border-b border-white/10 bg-court-deep/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Principal">
        <a href="#top" className="font-display text-[22px] text-white" onClick={() => setMenuOpen(false)}>
          ICADE <span className="text-ball">×</span> CUNEF
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" onClick={open} className="btn-ball min-h-10 px-4 text-[12px] sm:px-5">
            Comprar entrada
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-white md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 block h-0.5 w-5 rounded bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 block h-0.5 w-5 rounded bg-current transition ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`overflow-hidden transition-[max-height] duration-300 md:hidden ${menuOpen ? "max-h-80" : "max-h-0"}`}
      >
        <ul className="space-y-1 px-4 pb-6 pt-2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display block py-2.5 text-3xl text-white/90 transition hover:text-ball"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
