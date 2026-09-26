const QUESTIONS = [
  {
    q: "¿Cómo funciona el torneo?",
    a: "Cada enfrentamiento será siempre una pareja de ICADE contra una pareja de CUNEF.",
  },
  {
    q: "¿Puedo participar solo?",
    a: "Puedes comprar tu entrada, pero debes indicar una pareja. Cada jugador necesita su propia entrada.",
  },
  {
    q: "¿Mi pareja también tiene que comprar entrada?",
    a: "Sí. Cada miembro de la pareja debe comprar su propia entrada.",
  },
  {
    q: "¿Puedo jugar con alguien de la otra universidad?",
    a: "No. Las parejas deben representar a la misma universidad.",
  },
  {
    q: "¿Tengo que indicar mi edad?",
    a: "Sí. La edad del participante se solicita durante el proceso de compra.",
  },
  {
    q: "¿Qué incluye la entrada?",
    a: "Torneo de pádel + tardeo con DJ + 2 copas.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="eyebrow text-court" data-reveal>
          FAQ
        </p>
        <h2 className="font-display mt-3 text-[clamp(48px,12vw,96px)]" data-reveal>
          Preguntas
        </h2>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10" data-reveal>
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-3 text-left text-base font-bold sm:text-lg [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg transition duration-300 group-open:rotate-45 group-open:border-court group-open:bg-court group-open:text-white"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-12 text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
