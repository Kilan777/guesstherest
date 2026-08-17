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



/* ── third wave ───────────────────────────────────────────────────────────── */

function Country() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="18" y="24" width="284" height="132" rx="8" fill="currentColor" opacity="0.1" />
      <path d="M18 128 L74 96 L128 118 L182 78 L238 104 L302 72" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.4" />
      <path d="M18 156 L302 156" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      {[60, 120, 180, 240].map((x, i) => (
        <rect key={x} x={x} y={100 - i * 6} width="26" height={56 + i * 6} rx="2" fill="currentColor" opacity="0.22" />
      ))}
      <circle cx="228" cy="58" r="17" fill="currentColor" opacity="0.9" />
      <path d="M228 41 a17 17 0 0 1 0 34 z" fill="#ffffff" opacity="0.35" />
      <line x1="150" y1="150" x2="150" y2="166" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Language() {
  const glyphs = ['あ', 'Ω', 'д', 'ᜀ', 'क', '한'];
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {glyphs.map((g, i) => (
        <text key={i} x={26 + (i % 3) * 98} y={74 + Math.floor(i / 3) * 66} fontSize={44}
          fill="currentColor" opacity={i === 0 ? 0.95 : 0.28}>{g}</text>
      ))}
    </svg>
  );
}

function Slogan() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <path d="M40 46 h198 a12 12 0 0 1 12 12 v52 a12 12 0 0 1 -12 12 h-142 l-34 28 v-28 h-22 a12 12 0 0 1 -12 -12 v-52 a12 12 0 0 1 12 -12 z"
        fill="currentColor" opacity="0.14" />
      <rect x="62" y="68" width="120" height="9" rx="4.5" fill="currentColor" opacity="0.85" />
      <rect x="62" y="88" width="164" height="9" rx="4.5" fill="currentColor" opacity="0.4" />
      <path d="M262 58 l30 -14 v58 l-30 -14 z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

function Plot() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="46" y="20" width="228" height="140" rx="7" fill="currentColor" opacity="0.09" />
      <rect x="46" y="20" width="228" height="140" rx="7" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
      {[46, 64, 82, 100, 118, 136].map((y, i) => (
        <rect key={y} x="70" y={y} width={i === 0 ? 150 : 180 - (i % 3) * 34} height="8" rx="4"
          fill="currentColor" opacity={i === 0 ? 0.85 : 0.2} />
      ))}
    </svg>
  );
}


function Car() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <defs><filter id="a-car"><feGaussianBlur stdDeviation="6" /></filter></defs>
      <g filter="url(#a-car)" opacity="0.75">
        <path d="M40 118 q10 -30 34 -32 l30 -22 q46 -10 88 0 l32 24 q30 4 36 30 z" fill="currentColor" />
      </g>
      <circle cx="92" cy="122" r="20" fill="currentColor" opacity="0.85" />
      <circle cx="222" cy="122" r="20" fill="currentColor" opacity="0.85" />
      <circle cx="92" cy="122" r="8" fill="#ffffff" opacity="0.4" />
      <circle cx="222" cy="122" r="8" fill="#ffffff" opacity="0.4" />
      <line x1="20" y1="146" x2="300" y2="146" stroke="currentColor" strokeWidth="3" opacity="0.35" />
    </svg>
  );
}

function Sport() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <circle cx="160" cy="88" r="52" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.8" />
      <path d="M160 36 l30 22 -11 36 h-38 l-11 -36 z" fill="currentColor" opacity="0.75" />
      <path d="M108 74 l22 20 M212 74 l-22 20 M141 124 l-14 30 M179 124 l14 30" stroke="currentColor" strokeWidth="4" opacity="0.4" />
      <rect x="44" y="146" width="232" height="8" rx="4" fill="currentColor" opacity="0.25" />
    </svg>
  );
}


function Skyline() {
  const towers: [number, number, number][] = [
    [30, 96, 30], [66, 66, 26], [98, 112, 22], [126, 44, 34], [166, 84, 26],
    [198, 60, 30], [234, 104, 24], [264, 74, 30],
  ];
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {towers.map(([x, y, w], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={158 - y} fill="currentColor" opacity={0.2 + (i % 3) * 0.22} />
          {[0, 1, 2].map((r) => (
            <rect key={r} x={x + 5} y={y + 10 + r * 18} width={w - 10} height="6" fill="#ffffff" opacity="0.3" />
          ))}
        </g>
      ))}
      <rect x="14" y="158" width="292" height="6" rx="3" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function Outline() {
  const open = new Set([4, 9, 16]);
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <path d="M92 34 q54 -14 88 12 q40 24 26 62 q-12 34 -50 44 q-44 12 -68 -18 q-24 -30 -12 -62 q6 -26 16 -38 z"
        fill="currentColor" opacity="0.3" />
      {Array.from({ length: 24 }, (_, i) => {
        const c = i % 6;
        const r = Math.floor(i / 6);
        return (
          <rect key={i} x={22 + c * 46} y={26 + r * 33} width="42" height="29" rx="3"
            fill="currentColor" opacity={open.has(i) ? 0 : 0.16} />
        );
      })}
    </svg>
  );
}

function BoardGame() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 32 }, (_, i) => {
        const c = i % 8;
        const r = Math.floor(i / 8);
        return (
          <rect key={i} x={40 + c * 30} y={26 + r * 30} width="30" height="30"
            fill="currentColor" opacity={(c + r) % 2 ? 0.26 : 0.07} />
        );
      })}
      <circle cx="115" cy="71" r="13" fill="currentColor" opacity="0.9" />
      <circle cx="205" cy="101" r="13" fill="currentColor" opacity="0.55" />
      <rect x="242" y="118" width="34" height="34" rx="6" fill="currentColor" opacity="0.85"
        transform="rotate(14 259 135)" />
    </svg>
  );
}


function AppIcon() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        return (
          <rect key={i} x={92 + c * 50} y={16 + r * 50} width="42" height="42" rx="11"
            fill="currentColor" opacity={i === 4 ? 0.95 : 0.16} />
        );
      })}
      <circle cx="163" cy="87" r="9" fill="#ffffff" opacity="0.55" />
    </svg>
  );
}

function Logo() {
  const open = new Set([7, 14]);
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <circle cx="118" cy="90" r="40" fill="currentColor" opacity="0.6" />
      <rect x="150" y="66" width="110" height="16" rx="8" fill="currentColor" opacity="0.5" />
      <rect x="150" y="94" width="76" height="16" rx="8" fill="currentColor" opacity="0.3" />
      {Array.from({ length: 24 }, (_, i) => {
        const c = i % 6;
        const r = Math.floor(i / 6);
        return (
          <rect key={i} x={22 + c * 46} y={26 + r * 33} width="42" height="29" rx="3"
            fill="currentColor" opacity={open.has(i) ? 0 : 0.2} />
        );
      })}
    </svg>
  );
}


/* ── fourth wave ──────────────────────────────────────────────────────────── */

function Bird() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {/* Overlapping feather shapes, the texture the game actually shows. */}
      {Array.from({ length: 18 }, (_, i) => {
        const c = i % 6;
        const r = Math.floor(i / 6);
        return (
          <ellipse key={i} cx={54 + c * 42} cy={44 + r * 44 + (c % 2) * 12} rx="24" ry="15"
            fill="currentColor" opacity={0.1 + ((i * 5) % 4) * 0.07}
            transform={`rotate(-24 ${54 + c * 42} ${44 + r * 44 + (c % 2) * 12})`} />
        );
      })}
      <circle cx="206" cy="66" r="26" fill="currentColor" opacity="0.85" />
      <circle cx="206" cy="66" r="9" fill="#ffffff" opacity="0.9" />
      <circle cx="209" cy="63" r="3.5" fill="currentColor" />
      <path d="M232 68 l34 8 -34 10 z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function Plant() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <path d="M160 168 L160 62" stroke="currentColor" strokeWidth="7" opacity="0.55" strokeLinecap="round" />
      {[[0, 96, 1], [1, 122, -1], [2, 74, 1], [3, 100, -1]].map(([i, y, dir]) => (
        <path key={i as number}
          d={`M160 ${y} q${(dir as number) * 46} -22 ${(dir as number) * 74} 6 q${-(dir as number) * 40} 26 ${-(dir as number) * 74} -6 z`}
          fill="currentColor" opacity={0.24 + (i as number) * 0.12} />
      ))}
      <circle cx="160" cy="52" r="19" fill="currentColor" opacity="0.9" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse key={i} cx={160 + Math.cos((i / 6) * 6.28) * 30} cy={52 + Math.sin((i / 6) * 6.28) * 30}
          rx="13" ry="9" fill="currentColor" opacity="0.4"
          transform={`rotate(${(i / 6) * 360} ${160 + Math.cos((i / 6) * 6.28) * 30} ${52 + Math.sin((i / 6) * 6.28) * 30})`} />
      ))}
    </svg>
  );
}

function Insect() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <ellipse cx="160" cy="92" rx="13" ry="52" fill="currentColor" opacity="0.85" />
      {[[-1, 0.9], [1, 0.9], [-1, 0.45], [1, 0.45]].map(([dir, op], i) => (
        <path key={i}
          d={i < 2
            ? `M160 66 q${(dir as number) * 74} -34 ${(dir as number) * 84} 22 q${-(dir as number) * 30} 26 ${-(dir as number) * 84} -22 z`
            : `M160 104 q${(dir as number) * 58} 10 ${(dir as number) * 60} 44 q${-(dir as number) * 34} 8 ${-(dir as number) * 60} -44 z`}
          fill="currentColor" opacity={(op as number) * 0.5} />
      ))}
      <circle cx="160" cy="42" r="12" fill="currentColor" />
      <path d="M156 32 q-12 -18 -22 -22 M164 32 q12 -18 22 -22" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Word() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      <rect x="40" y="22" width="240" height="136" rx="6" fill="currentColor" opacity="0.08" />
      <rect x="62" y="42" width="96" height="13" rx="6.5" fill="currentColor" opacity="0.9" />
      <rect x="62" y="66" width="176" height="7" rx="3.5" fill="currentColor" opacity="0.28" />
      <rect x="62" y="82" width="150" height="7" rx="3.5" fill="currentColor" opacity="0.28" />
      <rect x="62" y="106" width="70" height="13" rx="6.5" fill="currentColor" opacity="0.55" />
      <rect x="62" y="130" width="164" height="7" rx="3.5" fill="currentColor" opacity="0.2" />
      <line x1="40" y1="94" x2="280" y2="94" stroke="currentColor" strokeWidth="1.5" opacity="0.18" />
    </svg>
  );
}

function Recipe() {
  return (
    <svg viewBox={VB} className="art" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={i < 2 ? 0.9 : 0.22}>
          <circle cx="72" cy={34 + i * 28} r="7" fill="currentColor" />
          <rect x="90" y={29 + i * 28} width={150 - (i % 3) * 34} height="9" rx="4.5" fill="currentColor" />
        </g>
      ))}
      <path d="M250 40 q22 22 0 44 q-22 -22 0 -44" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  song: Song,
  scene: Scene,
  object: ObjectArt,
  quote: Quote,
  rebus: Rebus,
  year: Year,
  landmark: Landmark,
  animal: Animal,
  dish: Dish,
  videogame: VideoGame,
  celebrity: Actor,
  openingline: OpeningLine,
  filmline: FilmLine,
  capital: Capital,
  country: Country,
  language: Language,
  slogan: Slogan,
  plot: Plot,
  car: Car,
  sport: Sport,
  skyline: Skyline,
  outline: Outline,
  boardgame: BoardGame,
  app: AppIcon,
  logo: Logo,
  bird: Bird,
  plant: Plant,
  insect: Insect,
  word: Word,
  recipe: Recipe,
};

export function CardArt({ slug }: { slug: string }) {
  const Art = ART[slug];
  return <div className="art-wrap">{Art ? <Art /> : null}</div>;
}
