"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/padel/config";
import { useCheckout } from "./CheckoutProvider";

/** Barra inferior en móvil: el CTA siempre a mano tras pasar el hero. */
export default function MobileStickyCta() {
  const { open, isOpen } = useCheckout();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !isOpen;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-court-deep/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0 text-white">
          <p className="font-display text-2xl leading-none">{formatPrice()}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">Torneo + DJ + 2 copas</p>
        </div>
        <button type="button" onClick={open} tabIndex={show ? 0 : -1} className="btn-ball min-h-12 flex-1 px-4 text-[14px]">
          Comprar entrada
        </button>
      </div>
    </div>
  );
}
