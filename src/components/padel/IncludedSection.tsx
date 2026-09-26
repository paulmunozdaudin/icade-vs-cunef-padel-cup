const ITEMS = [
  { icon: "🎾", title: "Torneo ICADE vs CUNEF", text: "Partidos pareja contra pareja. Tu universidad en juego." },
  { icon: "🥂", title: "2 copas incluidas", text: "Para brindar por tu universidad cuando acaba el partido." },
  { icon: "🏆", title: "Premios para los ganadores", text: "La pareja campeona se lleva premio. Y el orgullo de su universidad." },
];

export default function IncludedSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="eyebrow text-court" data-reveal>
          Todo en una entrada
        </p>
        <h2 className="font-display mt-3 text-[clamp(48px,12vw,96px)]" data-reveal>
          Tu entrada incluye
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {/* El DJ, protagonista */}
          <article
            className="relative overflow-hidden rounded-3xl bg-ink p-7 text-white sm:col-span-2 sm:p-10"
            data-reveal
          >
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ball/20 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-4xl" aria-hidden="true">🎧</span>
                <h3 className="font-display mt-4 text-[clamp(40px,9vw,72px)]">Tardeo con DJ</h3>
                <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-ball">Del pádel al tardeo.</p>
                <p className="mt-3 max-w-md text-white/70">Cuando termina la competición, empieza el after.</p>
              </div>
              <Equalizer />
            </div>
          </article>

          {ITEMS.map((item, i) => (
            <article
              key={item.title}
              className={`rounded-3xl border border-ink/10 bg-paper p-7 ${i === 0 ? "sm:col-span-2" : ""}`}
              data-reveal
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <h3 className="mt-4 text-xl font-extrabold uppercase tracking-tight">{item.title}</h3>
              <p className="mt-1.5 text-ink/65">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Equalizer({ bars = 14 }: { bars?: number }) {
  return (
    <div className="flex h-16 items-end gap-1.5" aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className="animate-eq block w-1.5 rounded-full bg-ball"
          style={{ height: `${40 + ((i * 37) % 60)}%`, animationDelay: `${(i * 113) % 900}ms` }}
        />
      ))}
    </div>
  );
}
