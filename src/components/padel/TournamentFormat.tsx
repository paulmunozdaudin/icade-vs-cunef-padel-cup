import { CourtDiagram } from "./Visuals";

const RULES = [
  { ok: true, text: "Pareja ICADE 🆚 Pareja CUNEF" },
  { ok: false, text: "ICADE vs ICADE" },
  { ok: false, text: "CUNEF vs CUNEF" },
  { ok: false, text: "Parejas mixtas ICADE + CUNEF" },
];

export default function TournamentFormat() {
  return (
    <section id="formato" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 sm:px-6 md:grid-cols-[1fr_300px] md:gap-16">
        <div>
          <p className="eyebrow text-ball" data-reveal>
            El formato
          </p>
          <h2 className="font-display mt-3 text-[clamp(44px,11vw,88px)]" data-reveal>
            <span className="block">🎾 Pareja ICADE</span>
            <span className="block py-3 text-[0.5em] leading-none text-ball">vs</span>
            <span className="block">🎾 Pareja CUNEF</span>
          </h2>

          <p className="mt-6 text-lg text-white/75" data-reveal>
            Cada partido enfrentará siempre:
          </p>
          <p className="mt-2 text-xl font-extrabold sm:text-2xl" data-reveal>
            2 jugadores de ICADE <span aria-hidden="true">🆚</span>
            <span className="sr-only">contra</span> 2 jugadores de CUNEF
          </p>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2" data-reveal>
            {RULES.map((rule) => (
              <li
                key={rule.text}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  rule.ok ? "border-ball/40 bg-ball/10 text-white" : "border-white/10 text-white/45 line-through decoration-white/30"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black no-underline ${
                    rule.ok ? "bg-ball text-ink" : "bg-white/10 text-white/60"
                  }`}
                  aria-label={rule.ok ? "Permitido" : "No permitido"}
                >
                  {rule.ok ? "✓" : "✕"}
                </span>
                {rule.text}
              </li>
            ))}
          </ul>

          <p className="mt-8 border-l-2 border-ball pl-4 text-base text-white/80 sm:text-lg" data-reveal>
            Compra tu entrada, indica tu pareja y representa a tu universidad.
          </p>
        </div>

        <div className="mx-auto w-full max-w-[260px] md:max-w-none" data-reveal>
          <CourtDiagram />
        </div>
      </div>
    </section>
  );
}
