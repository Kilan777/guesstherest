import type React from 'react';

/**
 * Per-game cover art, drawn as inline SVG.
 *
 * Every panel is built from the game's own mechanic — the song card is a
 * waveform cut short, the poster card is a wall of tiles with two lifted, the
 * year card is a timeline with one tick marked. It reads as a set of games
 * rather than a set of cards, and because it's all vector it costs no requests
 * and stays sharp at any size.
 *
 * `currentColor` inherits the accent, so a new game needs no palette work.
 */

const VB = '0 0 320 180';

function Song() {
  // A waveform that stops a fifth of the way in: all you get is 0.1 seconds.
  const bars = [
    8, 22, 14, 34, 46, 30, 58, 40, 66, 52, 72, 44, 60, 36, 50, 28, 40, 20, 30, 14, 24, 10, 18, 26,
    38, 30, 46, 34, 26, 18, 12, 20,
  ];
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <defs>
        <linearGradient id="a-song" x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="1" />
          <stop offset="0.22" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="0.28" stopColor="currentColor" stopOpacity="0.14" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={12 + i * 9.4}
          y={90 - h}
          width="5"
          height={h * 2}
          rx="2.5"
          fill="url(#a-song)"
        />
      ))}
      <line x1="82" y1="14" x2="82" y2="166" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" opacity="0.8" />
      <circle cx="82" cy="14" r="4" fill="currentColor" />
    </svg>
  );
}

function Scene() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="0" y="34" width="320" height="112" fill="currentColor" opacity="0.07" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={14 + i * 78}
          y="52"
          width="62"
          height="76"
          rx="4"
          fill="currentColor"
          opacity={i === 1 ? 0.85 : 0.13}
        />
      ))}
      {Array.from({ length: 10 }, (_, i) => (
        <g key={i}>
          <rect x={10 + i * 31} y="38" width="14" height="9" rx="2" fill="currentColor" opacity="0.3" />
          <rect x={10 + i * 31} y="133" width="14" height="9" rx="2" fill="currentColor" opacity="0.3" />
        </g>
      ))}
      <path d="M84 76 L84 104 L106 90 Z" fill="#ffffff" opacity="0.85" />
    </svg>
  );
}

function Poster() {
  // Two tiles lifted out of forty-eight — the opening state of the real game.
  const open = new Set([9, 26]);
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 48 }, (_, i) => {
        const c = i % 8;
        const r = Math.floor(i / 8);
        return (
          <rect
            key={i}
            x={16 + c * 36}
            y={12 + r * 26}
            width="32"
            height="22"
            rx="3"
            fill="currentColor"
            opacity={open.has(i) ? 0.9 : 0.13}
          />
        );
      })}
    </svg>
  );
}

function ObjectArt() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 60 }, (_, i) => (
        <circle
          key={i}
          cx={20 + (i % 12) * 26}
          cy={26 + Math.floor(i / 12) * 32}
          r={3}
          fill="currentColor"
          opacity="0.16"
        />
      ))}
      <circle cx="196" cy="88" r="46" fill="currentColor" opacity="0.1" />
      <circle cx="196" cy="88" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <circle
          key={i}
          cx={172 + (i % 2) * 48}
          cy={68 + Math.floor(i / 2) * 42}
          r={9}
          fill="currentColor"
          opacity="0.75"
        />
      ))}
      <line x1="229" y1="121" x2="266" y2="156" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

function Quote() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <text x="8" y="98" fontSize="120" fontWeight="800" fill="currentColor" opacity="0.22">
        “
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} opacity={i === 2 ? 0.9 : 0.2}>
          <circle cx={132 + (i % 2) * 74} cy={58 + Math.floor(i / 2) * 66} r="26" fill="currentColor" />
          <circle cx={132 + (i % 2) * 74} cy={50 + Math.floor(i / 2) * 66} r="9" fill="#ffffff" opacity="0.55" />
          <path
            d={`M${112 + (i % 2) * 74} ${76 + Math.floor(i / 2) * 66} a20 16 0 0 1 40 0 z`}
            fill="#ffffff"
            opacity="0.55"
          />
        </g>
      ))}
    </svg>
  );
}

function Album() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <defs>
        <filter id="a-blur">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g filter="url(#a-blur)" opacity="0.55">
        <rect x="60" y="18" width="90" height="80" rx="10" fill="currentColor" />
        <circle cx="200" cy="120" r="46" fill="currentColor" opacity="0.7" />
        <rect x="150" y="26" width="70" height="52" rx="8" fill="currentColor" opacity="0.5" />
      </g>
      <circle cx="160" cy="90" r="58" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      <circle cx="160" cy="90" r="40" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <circle cx="160" cy="90" r="22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <circle cx="160" cy="90" r="7" fill="currentColor" />
    </svg>
  );
}

function Painting() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="26" y="16" width="268" height="148" rx="6" fill="currentColor" opacity="0.08" />
      <rect x="26" y="16" width="268" height="148" rx="6" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5" />
      {[
        'M46 128 q34 -54 72 -26 t70 -34',
        'M52 146 q46 -30 92 -14 t96 -40',
        'M60 100 q30 -40 66 -18 t74 -30',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={13 - i * 3}
          strokeLinecap="round"
          opacity={0.75 - i * 0.2}
        />
      ))}
      <circle cx="238" cy="56" r="17" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function Rebus() {
  const marks = ['🦁', '👑', '🚢', '🧊', '🎈', '🏠'];
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {marks.map((m, i) => (
        <text
          key={i}
          x={30 + (i % 3) * 96}
          y={72 + Math.floor(i / 3) * 68}
          fontSize={Math.floor(i / 3) === 0 ? 46 : 38}
          opacity={i < 2 ? 1 : 0.35}
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

function Year() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <line x1="18" y1="98" x2="302" y2="98" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      {Array.from({ length: 18 }, (_, i) => {
        const big = i % 4 === 0;
        return (
          <line
            key={i}
            x1={22 + i * 16.4}
            y1={big ? 82 : 90}
            x2={22 + i * 16.4}
            y2={big ? 114 : 106}
            stroke="currentColor"
            strokeWidth={big ? 3 : 2}
            opacity={big ? 0.5 : 0.25}
          />
        );
      })}
      <g>
        <line x1="186" y1="52" x2="186" y2="128" stroke="currentColor" strokeWidth="4" />
        <circle cx="186" cy="44" r="11" fill="currentColor" />
        <rect x="150" y="136" width="72" height="26" rx="6" fill="currentColor" opacity="0.9" />
      </g>
    </svg>
  );
}


/* ── the second wave of games ─────────────────────────────────────────────── */

function Flag() {
  const open = new Set([5, 12]);
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 24 }, (_, i) => {
        const c = i % 6;
        const r = Math.floor(i / 6);
        return (
          <rect key={i} x={22 + c * 46} y={26 + r * 33} width="42" height="29" rx="3"
            fill="currentColor" opacity={open.has(i) ? 0.9 : 0.14} />
        );
      })}
      <line x1="14" y1="18" x2="14" y2="166" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function Landmark() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <line x1="20" y1="150" x2="300" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      <path d="M160 26 L196 150 L124 150 Z" fill="currentColor" opacity="0.75" />
      <path d="M160 26 L172 68 L148 68 Z" fill="#ffffff" opacity="0.5" />
      <rect x="60" y="96" width="34" height="54" rx="3" fill="currentColor" opacity="0.3" />
      <rect x="228" y="82" width="30" height="68" rx="3" fill="currentColor" opacity="0.3" />
      <circle cx="243" cy="70" r="13" fill="currentColor" opacity="0.45" />
      <circle cx="196" cy="60" r="42" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.55" />
      <line x1="226" y1="90" x2="252" y2="116" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function Animal() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 40 }, (_, i) => (
        <ellipse key={i} cx={26 + (i % 8) * 39} cy={30 + Math.floor(i / 8) * 30}
          rx={11} ry={7} fill="currentColor" opacity={0.1 + ((i * 7) % 5) * 0.05}
          transform={`rotate(${(i % 3) * 22 - 22} ${26 + (i % 8) * 39} ${30 + Math.floor(i / 8) * 30})`} />
      ))}
      <circle cx="196" cy="90" r="40" fill="#ffffff" opacity="0.55" />
      <circle cx="196" cy="90" r="22" fill="currentColor" opacity="0.9" />
      <circle cx="196" cy="90" r="9" fill="#ffffff" />
      <circle cx="205" cy="80" r="4" fill="#fff" opacity="0.75" />
    </svg>
  );
}

function Dish() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <circle cx="160" cy="92" r="66" fill="currentColor" opacity="0.1" />
      <circle cx="160" cy="92" r="66" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.55" />
      <circle cx="160" cy="92" r="44" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={160 + Math.cos((i / 6) * 6.28) * 26} cy={92 + Math.sin((i / 6) * 6.28) * 26}
          r={9} fill="currentColor" opacity="0.65" />
      ))}
      <circle cx="160" cy="92" r="11" fill="currentColor" />
      <rect x="34" y="60" width="6" height="64" rx="3" fill="currentColor" opacity="0.4" />
      <rect x="280" y="60" width="6" height="64" rx="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function VideoGame() {
  const open = new Set([10, 27]);
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 48 }, (_, i) => {
        const c = i % 8;
        const r = Math.floor(i / 8);
        return (
          <rect key={i} x={16 + c * 36} y={12 + r * 26} width="32" height="22" rx="2"
            fill="currentColor" opacity={open.has(i) ? 0.9 : 0.13} />
        );
      })}
    </svg>
  );
}

function Actor() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <defs>
        <filter id="a-face"><feGaussianBlur stdDeviation="11" /></filter>
      </defs>
      <g filter="url(#a-face)" opacity="0.7">
        <circle cx="160" cy="76" r="42" fill="currentColor" />
        <path d="M92 172 a68 56 0 0 1 136 0 z" fill="currentColor" opacity="0.8" />
      </g>
      <circle cx="160" cy="76" r="58" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    </svg>
  );
}

function OpeningLine() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="44" y="18" width="232" height="146" rx="5" fill="currentColor" opacity="0.08" />
      <line x1="160" y1="18" x2="160" y2="164" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <rect x="62" y="40" width="82" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
      <rect x="62" y="56" width="60" height="7" rx="3.5" fill="currentColor" opacity="0.85" />
      {[76, 92, 108, 124].map((y) => (
        <rect key={y} x="62" y={y} width={84 - ((y / 8) % 3) * 14} height="6" rx="3" fill="currentColor" opacity="0.16" />
      ))}
      {[40, 56, 72, 88, 104, 120].map((y) => (
        <rect key={y} x="176" y={y} width={86 - ((y / 8) % 4) * 12} height="6" rx="3" fill="currentColor" opacity="0.16" />
      ))}
    </svg>
  );
}

function FilmLine() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="26" y="30" width="268" height="92" rx="10" fill="currentColor" opacity="0.1" />
      <rect x="26" y="30" width="268" height="92" rx="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
      <path d="M132 122 L160 150 L172 122 Z" fill="currentColor" opacity="0.4" />
      <rect x="52" y="56" width="150" height="9" rx="4.5" fill="currentColor" opacity="0.85" />
      <rect x="52" y="76" width="196" height="9" rx="4.5" fill="currentColor" opacity="0.5" />
      <rect x="52" y="96" width="104" height="9" rx="4.5" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

function Capital() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <circle cx="160" cy="90" r="64" fill="currentColor" opacity="0.1" />
      <circle cx="160" cy="90" r="64" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
      <ellipse cx="160" cy="90" rx="26" ry="64" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="96" y1="90" x2="224" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <line x1="106" y1="54" x2="214" y2="54" stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
      <line x1="106" y1="126" x2="214" y2="126" stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
      <path d="M186 44 l0 -22 l16 8 z" fill="currentColor" />
      <circle cx="186" cy="52" r="9" fill="currentColor" />
    </svg>
  );
}

function Element() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="106" y="24" width="108" height="132" rx="7" fill="currentColor" opacity="0.12" />
      <rect x="106" y="24" width="108" height="132" rx="7" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />
      <text x="160" y="112" fontSize="60" fontWeight="800" textAnchor="middle" fill="currentColor">
        ?
      </text>
      <text x="120" y="48" fontSize="17" fill="currentColor" opacity="0.7">
        26
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={30 + i * 18} y={60 + i * 20} width="14" height="14" rx="2" fill="currentColor" opacity="0.16" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={262 - i * 18} y={60 + i * 20} width="14" height="14" rx="2" fill="currentColor" opacity="0.16" />
      ))}
    </svg>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  song: Song,
  scene: Scene,
  poster: Poster,
  object: ObjectArt,
  quote: Quote,
  album: Album,
  painting: Painting,
  rebus: Rebus,
  year: Year,
  flag: Flag,
  landmark: Landmark,
  animal: Animal,
  dish: Dish,
  videogame: VideoGame,
  actor: Actor,
  openingline: OpeningLine,
  filmline: FilmLine,
  capital: Capital,
  element: Element,
};

export function CardArt({ slug }: { slug: string }) {
  const Art = ART[slug];
  return <div className="art-wrap">{Art ? <Art /> : null}</div>;
}
