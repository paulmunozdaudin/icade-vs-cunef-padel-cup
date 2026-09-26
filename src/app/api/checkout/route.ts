import { TICKET_PRICE_EUR } from "@/lib/padel/config";
import { findUniversityClash } from "@/lib/padel/pairing";
import { validateRegistration } from "@/lib/padel/registration";
import {
  PaymentsNotConfiguredError,
  createCheckoutSession,
  isStripeConfigured,
  listPaidRegistrations,
} from "@/lib/padel/stripe";

/**
 * Crea la sesión de pago de Stripe para una entrada.
 * - 400: datos inválidos (mismas reglas que el formulario).
 * - 409: la pareja ya compró por la otra universidad -> sería una pareja mixta.
 * - 503: pagos sin configurar (sin precio o sin STRIPE_SECRET_KEY). Nunca se simula un pago.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return Response.json({ message: "Petición inválida." }, { status: 400 });
  }

  const result = validateRegistration(body);
  if (!result.ok) {
    return Response.json({ message: "Revisa los datos marcados.", errors: result.errors }, { status: 400 });
  }

  if (TICKET_PRICE_EUR === null || !isStripeConfigured()) {
    return Response.json({ code: "payments_not_configured" }, { status: 503 });
  }

  try {
    const clash = findUniversityClash(result.data, await listPaidRegistrations());
    if (clash) {
      return Response.json({ message: clash, errors: { university: clash } }, { status: 409 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? new URL(request.url).origin;
    const session = await createCheckoutSession(result.data, origin);
    return Response.json({ url: session.url });
  } catch (err) {
    if (err instanceof PaymentsNotConfiguredError) {
      return Response.json({ code: "payments_not_configured" }, { status: 503 });
    }
    console.error("[checkout] Error creando la sesión de Stripe", err);
    return Response.json({ message: "No se pudo iniciar el pago." }, { status: 502 });
  }
}
