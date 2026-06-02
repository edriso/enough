import { useEffect, useState } from 'react';
import { Icon } from '@/components/icon';
import { SettingsOverlay } from '@/components/settings-overlay';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { computeStreak, remaining as remainingOf } from '@/lib/budget';
import { AFFIRM_INTENT, AFFIRM_SAVED, pick } from '@/lib/content';
import { HomeScreen } from '@/features/home/home-screen';
import { PauseScreen } from '@/features/pause/pause-screen';
import { WhyScreen } from '@/features/why/why-screen';
import { ConfirmScreen } from '@/features/confirm/confirm-screen';
import { ResultScreen } from '@/features/result/result-screen';
import { useEnoughStore } from '@/store/enough-store';
import type { Phase, Reason } from '@/types/domain';

export function App() {
  useApplyTheme();
  const settings = useEnoughStore((state) => state.settings);
  const app = useEnoughStore((state) => state.app);
  const spendCheck = useEnoughStore((state) => state.spendCheck);
  const letItPass = useEnoughStore((state) => state.letItPass);
  const setTheme = useEnoughStore((state) => state.setTheme);

  const [phase, setPhase] = useState<Phase>('home');
  const [pauseLeft, setPauseLeft] = useState(settings.pauseSecs);
  const [reason, setReason] = useState<Reason | null>(null);
  const [affirm, setAffirm] = useState('');
  const [seed, setSeed] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const allowance = settings.allowance;
  const remaining = remainingOf(app.used, allowance);
  const over = app.used >= allowance;
  const streak = computeStreak(app.history, app.used, allowance);

  // The unskippable pause countdown auto-advances to the next step.
  useEffect(() => {
    if (phase !== 'pause') {
      return;
    }
    setPauseLeft(settings.pauseSecs);
    let secondsLeft = settings.pauseSecs;
    const id = setInterval(() => {
      secondsLeft -= 1;
      setPauseLeft(secondsLeft);
      if (secondsLeft <= 0) {
        clearInterval(id);
        setPhase(settings.askWhy ? 'why' : 'confirm');
      }
    }, 1000);
    return () => clearInterval(id);
  }, [phase, settings.pauseSecs, settings.askWhy]);

  function begin() {
    setReason(null);
    setPhase('pause');
  }
  function chooseReason(r: Reason) {
    setReason(r);
    setPhase('confirm');
  }
  function useOne() {
    spendCheck();
    setAffirm(pick(AFFIRM_INTENT, seed));
    setSeed((s) => s + 1);
    setPhase('go');
  }
  function letPass() {
    letItPass();
    setAffirm(pick(AFFIRM_SAVED, seed));
    setSeed((s) => s + 1);
    setPhase('saved');
  }
  const home = () => setPhase('home');

  return (
    <div className="en-app">
      {phase === 'home' && (
        <button
          className="en-corner en-corner-l en-tap"
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          <Icon name="sliders" size={18} />
        </button>
      )}
      <button
        className="en-corner en-tap"
        type="button"
        onClick={() => setTheme(settings.theme === 'night' ? 'day' : 'night')}
        aria-label="Theme"
      >
        <Icon name={settings.theme === 'night' ? 'sun' : 'moon'} size={18} />
      </button>

      <div className="en-stage">
        {phase === 'home' && (
          <HomeScreen
            remaining={remaining}
            allowance={allowance}
            used={app.used}
            saved={app.saved}
            streak={streak}
            onBegin={begin}
          />
        )}
        {phase === 'pause' && <PauseScreen secondsLeft={pauseLeft} />}
        {phase === 'why' && <WhyScreen onChoose={chooseReason} onBack={home} />}
        {phase === 'confirm' && (
          <ConfirmScreen
            remaining={remaining}
            over={over}
            reason={reason}
            onLetPass={letPass}
            onUseOne={useOne}
            onBack={home}
          />
        )}
        {phase === 'go' && (
          <ResultScreen kind="go" affirm={affirm} reasonLabel={reason?.label} onHome={home} />
        )}
        {phase === 'saved' && <ResultScreen kind="saved" affirm={affirm} onHome={home} />}
      </div>

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
