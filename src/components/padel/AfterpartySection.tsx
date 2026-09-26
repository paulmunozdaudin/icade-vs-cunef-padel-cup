import { Equalizer } from "./IncludedSection";

const MOMENTS = [
  { icon: "🎧", label: "DJ Set" },
  { icon: "🥂", label: "2 copas incluidas" },
  { icon: "🌴", label: "Zona social" },
  { icon: "📸", label: "Ambiente universitario" },
];

export default function AfterpartySection() {
  return (
    <section id="tardeo" className="relative isolate overflow-hidden bg-[#0c0b09] py-20 text-paper sm:py-28">
      {/* Luz cálida de atardecer: mismo ADN, otro ambiente */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(233,190,120,0.28),transparent_70%),radial-gradient(ellipse_60%_50%_at_90%_100%,rgba(220,242,79,0.12),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="eyebrow text-[#e9be78]" data-reveal>
          El pádel es solo el principio
        </p>
        <h2 className="font-display mx-auto mt-4 max-w-4xl text-[clamp(44px,11vw,100px)]" data-reveal>
          Cuando termina el partido, <span className="text-ball">empieza el tardeo.</span>
        </h2>
        <div className="mt-10 flex justify-center" data-reveal>
          <Equalizer bars={22} />
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {MOMENTS.map((m, i) => (
            <li
              key={m.label}
              className="rounded-3xl border border-paper/10 bg-paper/[0.04] px-4 py-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9be78]/40"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
            >
              <span className="text-4xl" aria-hidden="true">{m.icon}</span>
              <p className="mt-3 text-[13px] font-extrabold uppercase tracking-[0.14em]">{m.label}</p>
            </li>
          ))}
        </ul>

        <p className="mt-12 text-sm font-semibold uppercase tracking-[0.2em] text-paper/60" data-reveal>
          Torneo + DJ + 2 copas
        </p>
      </div>
    </section>
  );
}
