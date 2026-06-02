import type { ReactNode } from 'react';
import { Overlay } from '@/components/overlay';
import { useEnoughStore } from '@/store/enough-store';
import { ACCENTS } from '@/types/domain';

/** Settings: the daily allowance, pause length, the "why" step, theme, accent. */
export function SettingsOverlay({ onClose }: { onClose: () => void }) {
  const settings = useEnoughStore((state) => state.settings);
  const setAllowance = useEnoughStore((state) => state.setAllowance);
  const setPauseSecs = useEnoughStore((state) => state.setPauseSecs);
  const setAskWhy = useEnoughStore((state) => state.setAskWhy);
  const setTheme = useEnoughStore((state) => state.setTheme);
  const setAccent = useEnoughStore((state) => state.setAccent);

  return (
    <Overlay ariaLabel="Settings" onClose={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: 20,
          padding: '24px 24px 26px',
          color: 'var(--ink)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <span style={{ fontFamily: 'var(--serif)', fontSize: 19 }}>Settings</span>
          <button
            onClick={onClose}
            className="en-corner en-tap"
            type="button"
            aria-label="Close"
            style={{ position: 'static' }}
          >
            ✕
          </button>
        </div>

        <Field label={`Checks per day · ${settings.allowance}`} hint="Fewer is the point.">
          <input
            type="range"
            min={3}
            max={20}
            step={1}
            value={settings.allowance}
            onChange={(e) => setAllowance(Number(e.target.value))}
            aria-label="Checks per day"
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </Field>

        <Field label={`Pause length · ${settings.pauseSecs}s`}>
          <input
            type="range"
            min={3}
            max={15}
            step={1}
            value={settings.pauseSecs}
            onChange={(e) => setPauseSecs(Number(e.target.value))}
            aria-label="Pause length"
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
        </Field>

        <Field label="Speed-bump">
          <Toggle
            on={settings.askWhy}
            label="Ask what it's for"
            onChange={() => setAskWhy(!settings.askWhy)}
          />
        </Field>

        <Field label="Theme">
          <div role="group" style={{ display: 'flex', gap: 10 }}>
            {(['night', 'day'] as const).map((option) => (
              <Pill
                key={option}
                selected={settings.theme === option}
                onClick={() => setTheme(option)}
                label={option === 'night' ? 'Night' : 'Day'}
              />
            ))}
          </div>
        </Field>

        <Field label="Accent">
          <div role="group" aria-label="Accent" style={{ display: 'flex', gap: 12 }}>
            {ACCENTS.map((color) => {
              const selected = settings.accent === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccent(color)}
                  aria-pressed={selected}
                  aria-label={color}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: color,
                    border: `2.5px solid ${selected ? 'var(--ink)' : 'transparent'}`,
                    boxShadow: '0 0 0 1px var(--line)',
                  }}
                />
              );
            })}
          </div>
        </Field>
      </div>
    </Overlay>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          fontFamily: 'var(--ui)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--faint)',
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      {children}
      {hint && <p style={{ margin: '6px 0 0', fontSize: 12.5, color: 'var(--faint)' }}>{hint}</p>}
    </div>
  );
}

function Pill({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="en-tap"
      style={{
        padding: '9px 18px',
        borderRadius: 999,
        cursor: 'pointer',
        fontFamily: 'var(--ui)',
        fontSize: 14,
        fontWeight: 600,
        background: selected ? 'var(--accent-soft)' : 'transparent',
        color: selected ? 'var(--accent)' : 'var(--dim)',
        border: `1px solid ${selected ? 'var(--accent)' : 'var(--line)'}`,
      }}
    >
      {label}
    </button>
  );
}

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={on}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--ink)',
        fontFamily: 'var(--ui)',
        fontSize: 15,
      }}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          flexShrink: 0,
          background: on ? 'var(--accent)' : 'var(--surface-2)',
          border: '1px solid var(--line)',
          position: 'relative',
          transition: 'background .25s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            insetInlineStart: on ? 20 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: on ? 'var(--on-accent)' : 'var(--faint)',
            transition: 'inset-inline-start .25s ease',
          }}
        />
      </span>
    </button>
  );
}
