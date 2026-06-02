import { Icon } from '@/components/icon';

interface ResultScreenProps {
  kind: 'go' | 'saved';
  affirm: string;
  reasonLabel?: string;
  onHome: () => void;
}

/** The calm close: an intentional "go" or a let-it-pass "saved" affirmation. */
export function ResultScreen({ kind, affirm, reasonLabel, onHome }: ResultScreenProps) {
  if (kind === 'saved') {
    return (
      <div className="en-result en-rise">
        <div className="en-saved-mark">
          <Icon name="leaf" size={40} />
        </div>
        <p className="en-result-big">{affirm}</p>
        <button className="en-done en-tap" type="button" onClick={onHome}>
          Back
        </button>
      </div>
    );
  }
  return (
    <div className="en-result en-rise">
      <p className="en-result-big">{affirm}</p>
      {reasonLabel && <p className="en-result-sub">For: {reasonLabel.toLowerCase()}</p>}
      <button className="en-done en-tap" type="button" onClick={onHome}>
        <Icon name="check" size={18} /> Done
      </button>
    </div>
  );
}
