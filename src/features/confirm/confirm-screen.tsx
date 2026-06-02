import { Icon } from '@/components/icon';
import { NUDGE_OVER, NUDGE_REFLEX } from '@/lib/content';
import type { Reason } from '@/types/domain';

interface ConfirmScreenProps {
  remaining: number;
  over: boolean;
  reason: Reason | null;
  onLetPass: () => void;
  onUseOne: () => void;
  onBack: () => void;
}

export function ConfirmScreen({
  remaining,
  over,
  reason,
  onLetPass,
  onUseOne,
  onBack,
}: ConfirmScreenProps) {
  const isReflex = reason !== null && !reason.good;
  return (
    <div className="en-confirm en-rise">
      <button className="en-back en-tap" type="button" onClick={onBack} aria-label="Back">
        <Icon name="back" size={18} />
      </button>
      <p className="en-confirm-lead">
        {over ? (
          NUDGE_OVER
        ) : isReflex ? (
          NUDGE_REFLEX
        ) : (
          <>
            You have <b>{remaining}</b> {remaining === 1 ? 'check' : 'checks'} left today.
            <br />
            Still want to?
          </>
        )}
      </p>
      <div className="en-confirm-actions">
        <button className="en-no en-tap" type="button" onClick={onLetPass}>
          <Icon name="leaf" size={18} /> No, I&rsquo;m good
        </button>
        <button className="en-yes en-tap" type="button" onClick={onUseOne}>
          Yes, use one
        </button>
      </div>
    </div>
  );
}
