interface PauseScreenProps {
  secondsLeft: number;
}

/** The unskippable breathe step. The countdown is announced to screen readers. */
export function PauseScreen({ secondsLeft }: PauseScreenProps) {
  return (
    <div className="en-pause en-rise">
      <div className="en-orb-wrap">
        <div className="en-orb" />
        <div className="en-orb-num" aria-live="polite" aria-label={`${secondsLeft} seconds`}>
          {secondsLeft > 0 ? secondsLeft : ''}
        </div>
      </div>
      <p className="en-pause-text">Breathe. There&rsquo;s no rush.</p>
    </div>
  );
}
