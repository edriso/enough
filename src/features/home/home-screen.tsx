import { Icon } from '@/components/icon';

interface HomeScreenProps {
  remaining: number;
  allowance: number;
  used: number;
  saved: number;
  streak: number;
  onBegin: () => void;
}

export function HomeScreen({
  remaining,
  allowance,
  used,
  saved,
  streak,
  onBegin,
}: HomeScreenProps) {
  return (
    <div className="en-home en-rise">
      <div className="en-word">Enough</div>
      <div className="en-budget">
        <div className="en-remaining">{remaining}</div>
        <div className="en-remaining-label">
          {remaining === 1 ? 'check left today' : 'checks left today'}
        </div>
      </div>
      <div className="en-dots" aria-hidden="true">
        {Array.from({ length: allowance }, (_, i) => (
          <span key={i} className={'en-dot' + (i < used ? ' is-spent' : '')} />
        ))}
      </div>
      <button className="en-cta en-tap" type="button" onClick={onBegin}>
        <Icon name="phone" size={20} /> I want to check
      </button>
      <div className="en-meta">
        {saved > 0 && <span>{saved} let pass today</span>}
        {streak > 1 && <span>{streak}-day streak within Enough</span>}
      </div>
    </div>
  );
}
