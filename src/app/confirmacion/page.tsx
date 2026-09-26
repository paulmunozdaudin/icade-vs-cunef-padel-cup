import type { Metadata } from "next";
import Link from "next/link";
import Confirmation from "@/components/padel/Confirmation";
import { getPaidRegistration, isStripeConfigured } from "@/lib/padel/stripe";

export const metadata: Metadata = {
  title: "Estás dentro — ICADE vs CUNEF Padel Cup",
  robots: { index: false },
};

// La confirmación solo se muestra si Stripe confirma que el pago está hecho.
export default async function ConfirmationPage({ searchParams }: PageProps<"/confirmacion">) {
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : null;

  let player = null;
  let failed = false;
  if (sessionId && isStripeConfigured()) {
    try {
      player = await getPaidRegistration(sessionId);
    } catch (err) {
      console.error("[confirmacion] No se pudo verificar la sesión de Stripe", err);
      failed = true;
    }
  }

  if (player) return <Confirmation player={player} />;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-court px-4 text-center text-white">
      <div className="max-w-md">
        <h1 className="font-display text-5xl">No encontramos tu pago</h1>
        <p className="mt-4 text-white/75">
          {failed
            ? "No hemos podido verificar el pago ahora mismo. Si se te ha cobrado, recibirás el recibo de Stripe en tu email; vuelve a abrir el enlace en unos minutos."
            : "Este enlace no corresponde a ningún pago completado. Si acabas de pagar, revisa tu email: allí tienes el recibo."}
        </p>
        <Link href="/" className="btn-ball mt-8">
          Volver a la web
        </Link>
      </div>
    </main>
  );
}
