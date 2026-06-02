import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '@/App';
import { AFFIRM_INTENT, AFFIRM_SAVED } from '@/lib/content';
import { createDefaultState } from '@/lib/repository';
import { useEnoughStore } from '@/store/enough-store';

function reset() {
  localStorage.clear();
  const defaults = createDefaultState();
  useEnoughStore.setState({ settings: defaults.settings, app: defaults.app });
}

beforeEach(() => {
  reset();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

function advance(seconds: number) {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000);
  });
}

/** Walk from home through the pause to the confirm step. */
function toConfirm(reason = 'Look something up') {
  fireEvent.click(screen.getByRole('button', { name: /I want to check/ }));
  // The pause is unskippable: not on the why step yet.
  expect(screen.queryByRole('heading', { name: /What.?s it for/ })).not.toBeInTheDocument();
  advance(5); // default pause is 5s → auto-advances to "why"
  fireEvent.click(screen.getByRole('button', { name: reason }));
}

describe('home', () => {
  it('shows the budget and is visible (no opacity-freeze regression)', () => {
    render(<App />);
    expect(screen.getByText('8')).toBeVisible();
    expect(screen.getByText('checks left today')).toBeInTheDocument();
  });
});

describe('the speed-bump', () => {
  it('pauses, asks why, and reaches the confirm step', () => {
    render(<App />);
    toConfirm();
    expect(screen.getByText(/Still want to/)).toBeInTheDocument();
  });

  it('shows the gentle nudge for a reflex reason', () => {
    render(<App />);
    toConfirm('Just a reflex');
    expect(screen.getByText(/usually passes in a minute/)).toBeInTheDocument();
  });

  it('shows a no-penalty awareness nudge when already over budget', () => {
    useEnoughStore.setState({
      app: { day: createDefaultState().app.day, used: 8, saved: 0, history: {} },
    });
    render(<App />);
    toConfirm();
    expect(screen.getByText(/no penalty/)).toBeInTheDocument();
  });
});

describe('deciding', () => {
  it('"No, I\'m good" lets it pass and increments saved', () => {
    render(<App />);
    toConfirm();
    fireEvent.click(screen.getByRole('button', { name: /No, I.?m good/ }));
    expect(
      screen.getByText((t) => AFFIRM_SAVED.includes(t as (typeof AFFIRM_SAVED)[number])),
    ).toBeInTheDocument();
    expect(useEnoughStore.getState().app.saved).toBe(1);
    expect(useEnoughStore.getState().app.used).toBe(0); // unchanged
  });

  it('"Yes, use one" spends a check', () => {
    render(<App />);
    toConfirm();
    fireEvent.click(screen.getByRole('button', { name: 'Yes, use one' }));
    expect(
      screen.getByText((t) => AFFIRM_INTENT.includes(t as (typeof AFFIRM_INTENT)[number])),
    ).toBeInTheDocument();
    expect(useEnoughStore.getState().app.used).toBe(1);
  });
});

describe('settings', () => {
  it('changes the allowance and toggles the theme', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.change(screen.getByLabelText('Checks per day'), { target: { value: '5' } });
    expect(useEnoughStore.getState().settings.allowance).toBe(5);
    fireEvent.click(screen.getByRole('button', { name: 'Day' }));
    expect(useEnoughStore.getState().settings.theme).toBe('day');
  });
});
