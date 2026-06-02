import { describe, expect, it } from 'vitest';
import type { AppState } from '@/types/domain';
import { computeStreak, letPass, remaining, rollover, spend } from './budget';

const NOW = new Date(2026, 2, 10, 12, 0, 0); // "2026-03-10"

function state(overrides: Partial<AppState> = {}): AppState {
  return { day: '2026-03-10', used: 2, saved: 1, history: {}, ...overrides };
}

describe('rollover', () => {
  it('is a no-op on the same day', () => {
    expect(rollover(state(), NOW)).toEqual(state());
  });

  it('archives the prior day and resets counters on a new day', () => {
    const next = rollover(state({ day: '2026-03-09', used: 5, saved: 3 }), NOW);
    expect(next.day).toBe('2026-03-10');
    expect(next.used).toBe(0);
    expect(next.saved).toBe(0);
    expect(next.history['2026-03-09']).toEqual({ used: 5, saved: 3 });
  });

  it('handles a multi-day gap (archives only the last recorded day)', () => {
    const next = rollover(state({ day: '2026-03-01', used: 4, saved: 0 }), NOW);
    expect(next.history['2026-03-01']).toEqual({ used: 4, saved: 0 });
    expect(next.used).toBe(0);
  });
});

describe('spend / letPass / remaining', () => {
  it('spend increments used with no upper bound (over budget is allowed)', () => {
    expect(spend(state({ used: 8 })).used).toBe(9);
  });
  it('letPass increments saved', () => {
    expect(letPass(state({ saved: 1 })).saved).toBe(2);
  });
  it('remaining never goes negative', () => {
    expect(remaining(2, 8)).toBe(6);
    expect(remaining(10, 8)).toBe(0);
  });
});

describe('computeStreak', () => {
  it('counts consecutive under-allowance days ending today', () => {
    const history = {
      '2026-03-08': { used: 3 },
      '2026-03-09': { used: 8 },
    };
    expect(computeStreak(history, 1, 8, NOW)).toBe(3); // 8th, 9th, today
  });

  it('breaks the streak on a day that exceeded the allowance', () => {
    const history = {
      '2026-03-08': { used: 12 }, // over
      '2026-03-09': { used: 4 },
    };
    expect(computeStreak(history, 1, 8, NOW)).toBe(2); // today + 9th, stops at the 8th
  });

  it('today still counts only while within allowance', () => {
    expect(computeStreak({}, 8, 8, NOW)).toBe(1); // exactly at allowance is within
    expect(computeStreak({}, 9, 8, NOW)).toBe(0); // over today → no streak
  });

  it('counts across a month boundary', () => {
    const now = new Date(2026, 2, 1, 12, 0, 0); // 2026-03-01
    const history = { '2026-02-27': { used: 2 }, '2026-02-28': { used: 2 } };
    expect(computeStreak(history, 1, 8, now)).toBe(3);
  });
});
