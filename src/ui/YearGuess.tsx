import { useEffect, useState } from 'react';
import type { Option } from '../engine/types';

export function YearGuess(props: {
  range: [number, number];
  onGuess: (year: number) => void;
  tried: Option[];
  accent: string;
  disabled: boolean;
  /** Resets the dial between rounds. */
  roundId: string;
}) {
  const [min, max] = props.range;
  const [year, setYear] = useState(() => Math.round((min + max) / 2));

  useEffect(() => setYear(Math.round((min + max) / 2)), [props.roundId, min, max]);

  const triedYears = props.tried.map((t) => Number(t.label)).filter(Number.isFinite);

  return (
    <div className="year-guess">
      <div className="year-dial">
        <button
          type="button"
          className="year-step"
          onClick={() => setYear((y) => Math.max(min, y - 1))}
          disabled={props.disabled}
          aria-label="One year earlier"
        >
          −
        </button>
        <output className="year-value" style={{ color: props.accent }}>
          {year}
        </output>
        <button
          type="button"
          className="year-step"
          onClick={() => setYear((y) => Math.min(max, y + 1))}
          disabled={props.disabled}
          aria-label="One year later"
        >
          +
        </button>
      </div>

      <input
        className="year-slider"
        type="range"
        min={min}
        max={max}
        value={year}
        disabled={props.disabled}
        onChange={(e) => setYear(Number(e.target.value))}
        style={{ accentColor: props.accent }}
        aria-label="Release year"
      />
      <div className="year-scale">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      {triedYears.length > 0 && (
        <p className="year-tried">
          Already tried:{' '}
          {triedYears.map((y) => (
            <span key={y} className="year-chip">
              {y}
            </span>
          ))}
        </p>
      )}

      <button
        type="button"
        className="btn btn-primary"
        style={{ background: props.accent }}
        disabled={props.disabled || triedYears.includes(year)}
        onClick={() => props.onGuess(year)}
      >
        Lock in {year}
      </button>
    </div>
  );
}
