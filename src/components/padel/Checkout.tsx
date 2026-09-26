"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AGE_RANGE, EVENT, UNIVERSITIES, formatPrice, type University } from "@/lib/padel/config";
import {
  EMPTY_DRAFT,
  validateRegistration,
  type Registration,
  type RegistrationDraft,
  type RegistrationErrors,
} from "@/lib/padel/registration";

const DRAFT_KEY = "padel-cup:checkout-draft";

type Step = "form" | "summary";
type Notice = { tone: "info" | "error"; text: string } | null;

function loadDraft(): RegistrationDraft {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY_DRAFT, ...JSON.parse(raw) } : EMPTY_DRAFT;
  } catch {
    return EMPTY_DRAFT;
  }
}

function saveDraft(draft: RegistrationDraft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* modo privado: no pasa nada, solo no se recuerda */
  }
}

export default function Checkout({
  onClose,
  paymentsEnabled,
  returnedFromCancel,
}: {
  onClose: () => void;
  paymentsEnabled: boolean;
  returnedFromCancel: boolean;
}) {
  const [draft, setDraft] = useState<RegistrationDraft>(loadDraft);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [confirmed, setConfirmed] = useState<Registration | null>(() => {
    if (!returnedFromCancel) return null;
    const result = validateRegistration(loadDraft());
    return result.ok ? result.data : null;
  });
  const [step, setStep] = useState<Step>(confirmed ? "summary" : "form");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<Notice>(
    returnedFromCancel ? { tone: "info", text: "Has cancelado el pago. No se ha cobrado nada y tu plaza aún no está reservada." } : null,
  );
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Bloquea el scroll de fondo, cierra con Escape y enfoca el diálogo.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !submitting && onClose();
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, submitting]);

  useEffect(() => saveDraft(draft), [draft]);

  function update<K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) {
    setDraft((d) => {
      const next = { ...d, [key]: value };
      // Cambiar de universidad obliga a volver a confirmar la de la pareja.
      if (key === "university" && value !== d.university) next.partnerSameUniversity = false;
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function goToSummary(e: React.FormEvent) {
    e.preventDefault();
    const result = validateRegistration(draft);
    if (!result.ok) {
      setErrors(result.errors);
      const firstField = Object.keys(result.errors)[0];
      dialogRef.current?.querySelector<HTMLElement>(`[data-field="${firstField}"]`)?.focus();
      return;
    }
    setErrors({});
    setConfirmed(result.data);
    setNotice(null);
    setStep("summary");
    dialogRef.current?.scrollTo({ top: 0 });
  }

  async function pay() {
    if (!confirmed || submitting) return;
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(confirmed),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && typeof data.url === "string") {
        window.location.assign(data.url); // -> Stripe Checkout
        return;
      }
      if (res.status === 400 || res.status === 409) {
        setErrors(data.errors ?? {});
        setStep("form");
        setNotice({ tone: "error", text: data.message ?? "Revisa los datos marcados." });
      } else if (res.status === 503) {
        setNotice({
          tone: "info",
          text: "El pago online todavía no está activo. No se ha realizado ningún cargo y tu plaza aún no está reservada.",
        });
      } else {
        setNotice({ tone: "error", text: "No hemos podido iniciar el pago. Inténtalo de nuevo en unos segundos." });
      }
    } catch {
      setNotice({ tone: "error", text: "Sin conexión. Revisa tu internet e inténtalo de nuevo." });
    }
    setSubmitting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <div className="animate-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !submitting && onClose()} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-sheet relative flex max-h-[94dvh] w-full max-w-lg flex-col overflow-y-auto overscroll-contain rounded-t-[2rem] bg-paper outline-none sm:rounded-[2rem]"
      >
        {/* Cabecera */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-court px-5 py-4 text-white sm:px-7">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
              Paso {step === "form" ? "1" : "2"} de 2
            </p>
            <h2 id={titleId} className="font-display mt-1 text-2xl">
              {step === "form" ? "Consigue tu entrada" : "Tu entrada"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20 disabled:opacity-40"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="h-1 bg-court-deep">
          <div className={`h-full bg-ball transition-all duration-500 ${step === "form" ? "w-1/2" : "w-full"}`} />
        </div>

        <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))] pt-6 sm:px-7">
          {notice && (
            <p
              role="status"
              className={`mb-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                notice.tone === "error" ? "bg-red-50 text-red-800" : "bg-court/10 text-court"
              }`}
            >
              {notice.text}
            </p>
          )}

          {step === "form" ? (
            <CheckoutForm draft={draft} errors={errors} update={update} onSubmit={goToSummary} />
          ) : (
            confirmed && (
              <Summary
                registration={confirmed}
                paymentsEnabled={paymentsEnabled}
                submitting={submitting}
                onPay={pay}
                onEdit={() => {
                  setNotice(null);
                  setStep("form");
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-700">
      {message}
    </p>
  );
}

function CheckoutForm({
  draft,
  errors,
  update,
  onSubmit,
}: {
  draft: RegistrationDraft;
  errors: RegistrationErrors;
  update: <K extends keyof RegistrationDraft>(key: K, value: RegistrationDraft[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const uni = draft.university;
  const label = "mb-1.5 block text-[12px] font-bold uppercase tracking-[0.14em] text-ink/70";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="fullName" className={label}>
          Nombre y apellidos
        </label>
        <input
          id="fullName"
          data-field="fullName"
          className="field"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={80}
          value={draft.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby="fullName-error"
          required
        />
        <FieldError id="fullName-error" message={errors.fullName} />
      </div>

      <div className="grid grid-cols-[1fr_110px] gap-3">
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            data-field="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={120}
            className="field"
            value={draft.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-error"
            required
          />
        </div>
        <div>
          <label htmlFor="age" className={label}>
            Edad
          </label>
          <input
            id="age"
            data-field="age"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            className="field text-center"
            placeholder="—"
            value={draft.age}
            onChange={(e) => update("age", e.target.value.replace(/\D/g, "").slice(0, 3))}
            aria-invalid={Boolean(errors.age)}
            aria-describedby="age-error"
            aria-label={`Edad (número entre ${AGE_RANGE.min} y ${AGE_RANGE.max})`}
            required
          />
        </div>
        <div className="col-span-2 -mt-2 empty:hidden">
          <FieldError id="email-error" message={errors.email} />
          <FieldError id="age-error" message={errors.age} />
        </div>
      </div>

      <fieldset>
        <legend className={label}>Universidad</legend>
        <div role="radiogroup" className="grid grid-cols-2 gap-3" aria-describedby="university-error">
          {UNIVERSITIES.map((u, i) => {
            const selected = uni === u;
            return (
              <button
                key={u}
                type="button"
                role="radio"
                aria-checked={selected}
                data-field={i === 0 ? "university" : undefined}
                onClick={() => update("university", u)}
                className={`font-display flex min-h-20 items-center justify-center rounded-2xl border-2 text-4xl transition duration-200 ${
                  selected
                    ? "border-court bg-court text-white shadow-[0_12px_30px_-12px_rgba(15,61,46,0.7)]"
                    : "border-ink/10 bg-white text-ink/80 hover:border-court/50"
                } ${errors.university ? "border-red-400" : ""}`}
              >
                {u}
                {selected && <span className="ml-2 text-lg text-ball" aria-hidden="true">✓</span>}
              </button>
            );
          })}
        </div>
        <FieldError id="university-error" message={errors.university} />
      </fieldset>

      <div>
        <label htmlFor="partnerName" className={label}>
          Nombre y apellidos de tu pareja{uni && <span className="text-court"> ({uni})</span>}
        </label>
        <input
          id="partnerName"
          data-field="partnerName"
          className="field"
          autoCapitalize="words"
          autoComplete="off"
          maxLength={80}
          placeholder="Ej. Juan García López"
          value={draft.partnerName}
          onChange={(e) => update("partnerName", e.target.value)}
          aria-invalid={Boolean(errors.partnerName)}
          aria-describedby="partnerName-error partnerName-hint"
          required
        />
        <FieldError id="partnerName-error" message={errors.partnerName} />
        <p id="partnerName-hint" className="mt-1.5 text-sm text-ink/60">
          👥 Tu pareja también debe comprar su propia entrada.
        </p>
      </div>

      <label
        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
          draft.partnerSameUniversity ? "border-court bg-court/[0.06]" : errors.partnerSameUniversity ? "border-red-400 bg-white" : "border-ink/10 bg-white"
        } ${!uni ? "opacity-60" : ""}`}
      >
        <input
          type="checkbox"
          data-field="partnerSameUniversity"
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#0f3d2e]"
          checked={draft.partnerSameUniversity}
          disabled={!uni}
          onChange={(e) => update("partnerSameUniversity", e.target.checked)}
          aria-describedby="partnerSameUniversity-error"
        />
        <span className="text-sm leading-snug">
          <strong>Mi pareja también es de {uni || "mi universidad"}.</strong>{" "}
          <span className="text-ink/60">
            Las parejas representan a una sola universidad: {uni ? `${uni} + ${uni}` : "ICADE + ICADE o CUNEF + CUNEF"}.
          </span>
        </span>
      </label>
      <FieldError id="partnerSameUniversity-error" message={errors.partnerSameUniversity} />

      <button type="submit" className="btn-ball w-full min-h-16 text-lg">
        Continuar
      </button>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/50">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}

function Summary({
  registration,
  paymentsEnabled,
  submitting,
  onPay,
  onEdit,
}: {
  registration: Registration;
  paymentsEnabled: boolean;
  submitting: boolean;
  onPay: () => void;
  onEdit: () => void;
}) {
  const uni: University = registration.university;
  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_40px_-30px_rgba(0,0,0,0.4)]">
        <div className="bg-ink px-5 py-5 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">Tu entrada</p>
          <p className="font-display mt-1 text-2xl sm:text-3xl">{EVENT.name}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="chip border-white/15">🎾 Torneo</span>
            <span className="chip border-white/15">🎧 Tardeo con DJ</span>
            <span className="chip border-white/15">🥂 2 copas</span>
          </div>
        </div>
        <dl className="divide-y divide-ink/5 px-5">
          <SummaryRow label="Participante" value={registration.fullName} />
          <SummaryRow label="Edad" value={String(registration.age)} />
          <SummaryRow label="Universidad" value={uni} />
          <SummaryRow label="Pareja" value={`${registration.partnerName} (${uni})`} />
        </dl>
        <div className="flex items-center justify-between border-t-2 border-dashed border-ink/10 px-5 py-4">
          <span className="text-sm font-extrabold uppercase tracking-[0.16em]">Total</span>
          <span className="font-display text-4xl">{formatPrice()}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-ink/60">
        Recuerda: <strong className="text-ink">{registration.partnerName}</strong> tiene que comprar su propia entrada
        eligiendo {uni} y poniendo tu nombre.
      </p>

      {paymentsEnabled ? (
        <button type="button" onClick={onPay} disabled={submitting} className="btn-ball mt-6 w-full min-h-16 text-base disabled:opacity-70">
          {submitting ? "Conectando con el pago seguro…" : "Pagar y reservar mi plaza"}
        </button>
      ) : (
        <div className="mt-6 rounded-2xl border border-court/30 bg-court/[0.06] p-4 text-sm text-court">
          <p className="font-bold">El pago online se activará muy pronto.</p>
          <p className="mt-1 text-court/80">
            Todavía no se pueden comprar entradas: no se ha realizado ningún cargo y tu plaza aún no está reservada.
          </p>
          <button type="button" disabled className="btn-ball mt-4 w-full min-h-14 cursor-not-allowed opacity-40">
            Pagar y reservar mi plaza
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onEdit}
        disabled={submitting}
        className="mt-3 w-full py-3 text-sm font-bold uppercase tracking-[0.14em] text-ink/60 transition hover:text-ink"
      >
        ← Editar mis datos
      </button>

      {paymentsEnabled && (
        <p className="mt-2 text-center text-xs text-ink/45">Pago seguro con Stripe. Recibirás el recibo en tu email.</p>
      )}
    </div>
  );
}
