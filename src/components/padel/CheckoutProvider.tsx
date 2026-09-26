"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Checkout from "./Checkout";

interface CheckoutContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

export function useCheckout() {
  return useContext(CheckoutContext);
}

/**
 * Hace que cualquier CTA de la página abra el mismo checkout.
 * `paymentsEnabled` llega del servidor: true solo si hay precio y Stripe.
 */
export default function CheckoutProvider({
  children,
  paymentsEnabled,
}: {
  children: React.ReactNode;
  paymentsEnabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Vuelta desde Stripe tras cancelar: reabrimos el resumen para no perder datos.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("pago") !== "cancelado") return;
    url.searchParams.delete("pago");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCancelled(true);
    setIsOpen(true);
  }, []);

  return (
    <CheckoutContext.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && (
        <Checkout
          onClose={() => {
            close();
            setCancelled(false);
          }}
          paymentsEnabled={paymentsEnabled}
          returnedFromCancel={cancelled}
        />
      )}
    </CheckoutContext.Provider>
  );
}
