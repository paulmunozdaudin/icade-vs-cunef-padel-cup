// =============================================================================
// ICADE VS CUNEF — PADEL CUP · Configuración del evento
// =============================================================================
// Todo lo editable del evento vive aquí. Cambia un valor y se actualiza en
// toda la landing, en el resumen de compra y en el cobro de Stripe.
// =============================================================================

/**
 * Precio de la entrada en euros (por persona).
 *
 * Mientras sea `null`, la web muestra "XX €" y el pago queda bloqueado:
 * no se puede cobrar un precio que no existe. Pon aquí el importe real,
 * por ejemplo `25` o `19.9`.
 */
export const TICKET_PRICE_EUR: number | null = null;

export const EVENT = {
  name: "ICADE vs CUNEF — Padel Cup",
  shortName: "ICADE × CUNEF",
  /**
   * Fecha y hora de inicio en formato ISO con zona horaria, por ejemplo
   * "2026-11-14T16:00:00+01:00". Mientras sea `null` no se muestra ninguna
   * fecha y el botón "Añadir al calendario" queda desactivado.
   */
  startsAt: null as string | null,
  /** Duración total (torneo + tardeo) en horas, para el evento de calendario. */
  durationHours: 6,
  /** Nombre del club o dirección. `null` = aún sin anunciar. */
  venue: null as string | null,
} as const;

export const UNIVERSITIES = ["ICADE", "CUNEF"] as const;
export type University = (typeof UNIVERSITIES)[number];

/**
 * Rango de edad aceptado por el formulario. Solo sirve para descartar
 * valores imposibles (0, 250, decimales...). No es un requisito de acceso.
 */
export const AGE_RANGE = { min: 1, max: 120 } as const;

export function formatPrice(price: number | null = TICKET_PRICE_EUR): string {
  if (price === null) return "XX €";
  const hasDecimals = !Number.isInteger(price);
  return `${price.toLocaleString("es-ES", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })} €`;
}

export function priceInCents(price: number | null = TICKET_PRICE_EUR): number | null {
  return price === null ? null : Math.round(price * 100);
}
