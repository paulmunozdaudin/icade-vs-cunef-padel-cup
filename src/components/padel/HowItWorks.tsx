const STEPS = [
  { n: "01", title: "Compra tu entrada", text: "Reserva tu plaza." },
  { n: "02", title: "Indica tu pareja", text: "Escribe el nombre de tu pareja." },
  { n: "03", title: "Representa a tu universidad", text: "Selecciona ICADE o CUNEF." },
];

export default function HowItWorks() {
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="eyebrow text-court" data-reveal>
          Cómo funciona
        </p>
        <h2 className="font-display mt-3 text-[clamp(48px,12vw,96px)]" data-reveal>
          3 pasos. 1 pista.
        </h2>

        <ol className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4">
          {STEPS.map((step, i) => (
            <li
              key={step.n}
              className="rounded-3xl bg-white p-7 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="font-display text-5xl text-court">{step.n}</span>
              <h3 className="mt-4 text-lg font-extrabold uppercase leading-tight">{step.title}</h3>
              <p className="mt-1.5 text-ink/65">{step.text}</p>
            </li>
          ))}
        </ol>

        <div
          className="mt-6 flex items-start gap-4 rounded-3xl border-2 border-court bg-court/[0.06] p-6 sm:items-center"
          data-reveal
        >
          <span className="text-3xl" aria-hidden="true">👥</span>
          <p className="text-[15px] sm:text-base">
            <strong className="font-extrabold uppercase">Importante:</strong> cada miembro de la pareja compra{" "}
            <strong>su propia entrada</strong>. Los dos tenéis que elegir la misma universidad y poner el nombre del
            otro.
          </p>
        </div>
      </div>
    </section>
  );
}
