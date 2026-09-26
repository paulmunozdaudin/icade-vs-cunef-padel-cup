// =============================================================================
// Integración con Stripe Checkout (solo servidor)
// =============================================================================
// Se usa la API REST de Stripe directamente, sin SDK. Para activarla basta con
// definir STRIPE_SECRET_KEY en las variables de entorno (ver .env.local.example).
// Sin esa variable, la web NUNCA simula un pago: el checkout avisa de que el
// pago online todavía no está activo.
// =============================================================================

import { EVENT, UNIVERSITIES, priceInCents, type University } from "./config";
import type { PaidRegistration } from "./pairing";
import type { Registration } from "./registration";

const STRIPE_API = "https://api.stripe.com/v1";
/** Marca que identifica en Stripe los pagos de este evento. */
export const STRIPE_EVENT_TAG = "icade-cunef-padel-cup";

export class PaymentsNotConfiguredError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = "PaymentsNotConfiguredError";
  }
}

function secretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new PaymentsNotConfiguredError("Falta STRIPE_SECRET_KEY.");
  return key;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

async function stripeRequest<T>(path: string, init?: { method?: "GET" | "POST"; body?: URLSearchParams }): Promise<T> {
  const res = await fetch(`${STRIPE_API}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: init?.body,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Stripe ${res.status}: ${json?.error?.message ?? "error desconocido"}`);
  }
  return json as T;
}

interface StripeCheckoutSession {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  created: number;
  customer_email: string | null;
  customer_details: { email: string | null } | null;
  metadata: Record<string, string>;
}

export async function createCheckoutSession(registration: Registration, origin: string) {
  const amount = priceInCents();
  if (amount === null) {
    throw new PaymentsNotConfiguredError("El precio de la entrada aún no está definido.");
  }

  const body = new URLSearchParams({
    mode: "payment",
    customer_email: registration.email,
    locale: "es",
    success_url: `${origin}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?pago=cancelado`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "eur",
    "line_items[0][price_data][unit_amount]": String(amount),
    "line_items[0][price_data][product_data][name]": `Entrada · ${EVENT.name}`,
    "line_items[0][price_data][product_data][description]":
      "Torneo + Tardeo con DJ + 2 copas",
    "metadata[event]": STRIPE_EVENT_TAG,
    "metadata[full_name]": registration.fullName,
    "metadata[age]": String(registration.age),
    "metadata[university]": registration.university,
    "metadata[partner_name]": registration.partnerName,
    "metadata[partner_same_university]": "true",
  });

  const session = await stripeRequest<StripeCheckoutSession>("/checkout/sessions", {
    method: "POST",
    body,
  });
  if (!session.url) throw new Error("Stripe no devolvió la URL de pago.");
  return { id: session.id, url: session.url };
}

function toPaidRegistration(session: StripeCheckoutSession): PaidRegistration | null {
  const m = session.metadata ?? {};
  if (m.event !== STRIPE_EVENT_TAG || session.payment_status !== "paid") return null;
  if (!UNIVERSITIES.includes(m.university as University)) return null;
  return {
    id: session.id,
    paidAt: session.created * 1000,
    fullName: m.full_name ?? "",
    email: session.customer_details?.email ?? session.customer_email ?? "",
    age: Number(m.age),
    university: m.university as University,
    partnerName: m.partner_name ?? "",
    partnerSameUniversity: true,
  };
}

/** Recupera una sesión y la devuelve SOLO si el pago está confirmado. */
export async function getPaidRegistration(sessionId: string): Promise<PaidRegistration | null> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  const session = await stripeRequest<StripeCheckoutSession>(
    `/checkout/sessions/${encodeURIComponent(sessionId)}`,
  );
  return toPaidRegistration(session);
}

/** Todas las entradas pagadas de este evento (paginando la API de Stripe). */
export async function listPaidRegistrations(): Promise<PaidRegistration[]> {
  const result: PaidRegistration[] = [];
  let startingAfter: string | null = null;

  for (let page = 0; page < 50; page++) {
    const params = new URLSearchParams({ status: "complete", limit: "100" });
    if (startingAfter) params.set("starting_after", startingAfter);

    const list = await stripeRequest<{ data: StripeCheckoutSession[]; has_more: boolean }>(
      `/checkout/sessions?${params}`,
    );
    for (const session of list.data) {
      const reg = toPaidRegistration(session);
      if (reg) result.push(reg);
    }
    if (!list.has_more || list.data.length === 0) break;
    startingAfter = list.data[list.data.length - 1].id;
  }

  return result;
}
