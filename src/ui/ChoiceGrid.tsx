import type { Option } from '../engine/types';

export function ChoiceGrid(props: {
  choices: Option[];
  onGuess: (option: Option) => void;
  disabledIds: Set<string>;
  answerId: string;
  revealed: boolean;
  accent: string;
  /** True when the round is over — locks input and paints the answer. */
  locked: boolean;
}) {
  const { choices, onGuess, disabledIds, answerId, revealed, accent, locked } = props;

  return (
    <div className={`choice-grid ${choices.some((c) => c.image) ? 'with-art' : ''}`}>
      {choices.map((c) => {
        const wrong = disabledIds.has(c.id);
        const isAnswer = c.id === answerId;
        const state = revealed && isAnswer ? 'right' : wrong ? 'wrong' : '';
        return (
          <button
            key={c.id}
            type="button"
            className={`choice ${state}`}
            style={state === 'right' ? { borderColor: accent, boxShadow: `0 0 0 2px ${accent}55` } : undefined}
            disabled={wrong || locked}
            onClick={() => onGuess(c)}
          >
            {c.image ? (
              <img className="choice-art" src={c.image} alt="" draggable={false} />
            ) : (
              <span className="choice-art choice-art-empty" aria-hidden>
                {c.label.slice(0, 1)}
              </span>
            )}
            <span className="choice-text">
              <span className="choice-label">{c.label}</span>
              {c.sublabel && <span className="choice-sub">{c.sublabel}</span>}
            </span>
            {state === 'wrong' && (
              <span className="choice-mark" aria-label="wrong">
                ✕
              </span>
            )}
            {state === 'right' && (
              <span className="choice-mark" aria-label="correct">
                ✓
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
