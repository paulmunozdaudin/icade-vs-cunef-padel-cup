// Piezas gráficas inspiradas en el pádel. SVG en línea: pesan casi nada.

export function PadelBall({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="ball-shade" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f1ff9a" />
          <stop offset="60%" stopColor="#dcf24f" />
          <stop offset="100%" stopColor="#a9bf1f" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="url(#ball-shade)" />
      <path d="M5 9c7 4 9 18 1 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
      <path d="M35 7c-8 5-9 20 0 26" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/** Bote de pelota con su sombra: el "pequeño movimiento" de la marca. */
export function BouncingBall({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className="relative inline-flex flex-col items-center" aria-hidden="true">
      <PadelBall className={`animate-ball ${className}`} />
      <span className="animate-ball-shadow mt-1 h-1 w-6 rounded-full bg-black/60 blur-[2px]" />
    </span>
  );
}

/** Líneas de una pista de pádel vista desde arriba (en horizontal). */
export function CourtLines({ className = "", strokeOpacity = 0.14 }: { className?: string; strokeOpacity?: number }) {
  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="white"
      strokeOpacity={strokeOpacity}
      strokeWidth="0.35"
      vectorEffect="non-scaling-stroke"
    >
      <rect x="10" y="10" width="180" height="80" />
      {/* Líneas de saque */}
      <line x1="40" y1="10" x2="40" y2="90" />
      <line x1="160" y1="10" x2="160" y2="90" />
      {/* Línea central de saque */}
      <line x1="40" y1="50" x2="160" y2="50" />
      {/* Red */}
      <line x1="100" y1="6" x2="100" y2="94" strokeOpacity={strokeOpacity * 1.4} strokeWidth="0.5" />
    </svg>
  );
}

/** Pista vertical con las dos parejas: explica el formato de un vistazo. */
export function CourtDiagram() {
  const player = (cx: number, cy: number, label: string, tone: "light" | "ball") => (
    <g>
      <circle cx={cx} cy={cy} r="9" fill={tone === "ball" ? "#dcf24f" : "#f4f0e6"} />
      <text x={cx} y={cy + 3.2} textAnchor="middle" fontSize="8" fontWeight="800" fill="#0b0c0b">
        {label}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 120 220" className="h-auto w-full" role="img" aria-label="Pista de pádel: pareja ICADE en un lado de la red, pareja CUNEF en el otro">
      <rect x="1" y="1" width="118" height="218" rx="6" fill="#0f3d2e" />
      <g fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1">
        <rect x="10" y="10" width="100" height="200" />
        <line x1="10" y1="45" x2="110" y2="45" />
        <line x1="10" y1="175" x2="110" y2="175" />
        <line x1="60" y1="45" x2="60" y2="175" />
      </g>
      <line x1="4" y1="110" x2="116" y2="110" stroke="#fff" strokeWidth="2.2" strokeDasharray="3 2" />
      <text x="60" y="30" textAnchor="middle" fontSize="7.5" fontWeight="800" letterSpacing="1.5" fill="#f4f0e6">PAREJA ICADE</text>
      {player(38, 78, "I", "light")}
      {player(82, 78, "I", "light")}
      {player(38, 142, "C", "ball")}
      {player(82, 142, "C", "ball")}
      <text x="60" y="196" textAnchor="middle" fontSize="7.5" fontWeight="800" letterSpacing="1.5" fill="#dcf24f">PAREJA CUNEF</text>
    </svg>
  );
}

export function PlayerIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
    </svg>
  );
}
