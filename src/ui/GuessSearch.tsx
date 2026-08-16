import { useEffect, useMemo, useRef, useState } from 'react';
import type { Option } from '../engine/types';
import { normalize } from '../content/cache';

/**
 * Type-to-filter guess box. The catalog is small enough (a few hundred rows)
 * that filtering on every keystroke is free, so there's no debounce here.
 */
export function GuessSearch(props: {
  catalog: Option[];
  onGuess: (option: Option) => void;
  disabledIds: Set<string>;
  accent: string;
  disabled?: boolean;
}) {
  const { catalog, onGuess, disabledIds, accent, disabled } = props;
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const index = useMemo(
    () => catalog.map((o) => ({ o, hay: normalize(`${o.label} ${o.sublabel ?? ''}`) })),
    [catalog],
  );

  const matches = useMemo(() => {
    const q = normalize(query);
    if (!q) return [];
    const starts: Option[] = [];
    const contains: Option[] = [];
    for (const { o, hay } of index) {
      if (hay.startsWith(q)) starts.push(o);
      else if (hay.includes(q)) contains.push(o);
      if (starts.length >= 8) break;
    }
    return [...starts, ...contains].slice(0, 8);
  }, [query, index]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row inside the scroll box.
  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function commit(option: Option) {
    if (disabledIds.has(option.id)) return;
    onGuess(option);
    setQuery('');
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="guess-search">
      <div className="guess-input-wrap" style={{ borderColor: open && matches.length ? accent : undefined }}>
        <span className="guess-icon" aria-hidden>
          ⌕
        </span>
        <input
          ref={inputRef}
          className="guess-input"
          type="text"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls="guess-listbox"
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          placeholder={disabled ? 'Round over' : 'Start typing your answer…'}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={(e) => {
            if (!matches.length) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => (a + 1) % matches.length);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => (a - 1 + matches.length) % matches.length);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const chosen = matches[active];
              if (chosen) commit(chosen);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
      </div>

      {open && matches.length > 0 && (
        <ul className="guess-list" id="guess-listbox" role="listbox" ref={listRef}>
          {matches.map((o, i) => {
            const used = disabledIds.has(o.id);
            return (
              <li
                key={o.id}
                role="option"
                aria-selected={i === active}
                className={`guess-item ${i === active ? 'active' : ''} ${used ? 'used' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  commit(o);
                }}
                onMouseEnter={() => setActive(i)}
              >
                <span className="guess-item-label">{o.label}</span>
                {o.sublabel && <span className="guess-item-sub">{o.sublabel}</span>}
                {used && <span className="guess-item-flag">tried</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
