"use client";

import { useCheckout } from "./CheckoutProvider";

export default function CtaButton({
  children = "Comprar entrada",
  className = "",
  size = "lg",
}: {
  children?: React.ReactNode;
  className?: string;
  size?: "md" | "lg" | "xl";
}) {
  const { open } = useCheckout();
  const sizes = {
    md: "min-h-11 px-5 text-[13px]",
    lg: "min-h-14 px-8 text-base",
    xl: "min-h-16 px-10 text-lg sm:min-h-[72px] sm:px-12 sm:text-xl",
  };
  return (
    <button type="button" onClick={open} className={`btn-ball ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}
