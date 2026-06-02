import { Icon } from '@/components/icon';
import { REASONS } from '@/lib/content';
import type { Reason } from '@/types/domain';

interface WhyScreenProps {
  onChoose: (reason: Reason) => void;
  onBack: () => void;
}

export function WhyScreen({ onChoose, onBack }: WhyScreenProps) {
  return (
    <div className="en-why en-rise">
      <button className="en-back en-tap" type="button" onClick={onBack} aria-label="Back">
        <Icon name="back" size={18} />
      </button>
      <h2 className="en-q">What&rsquo;s it for?</h2>
      <div className="en-reasons">
        {REASONS.map((reason) => (
          <button
            key={reason.id}
            className="en-reason en-tap"
            type="button"
            onClick={() => onChoose(reason)}
          >
            {reason.label}
          </button>
        ))}
      </div>
    </div>
  );
}
