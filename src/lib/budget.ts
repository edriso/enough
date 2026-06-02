import type { AppState } from '@/types/domain';
import { addDays, dayKey } from './date';

/*
 * The pure budget logic, kept out of components so the day-boundary, streak, and
 * spend/let-pass behaviour are all testable. Nothing here ever penalizes going
 * over budget; the streak simply stops, and awareness does the rest.
 */

/** On a new calendar day, archive the prior day and reset the counters. */
export function rollover(state: AppState, now: Date = new Date()): AppState {
  const key = dayKey(now);
  if (state.day === key) {
    return state;
  }
  return {
    day: key,
    used: 0,
    saved: 0,
    history: { ...state.history, [state.day]: { used: state.used, saved: state.saved } },
  };
}

/** Spend one check (no upper bound — used may exceed allowance, with no penalty). */
export function spend(state: AppState): AppState {
  return { ...state, used: state.used + 1 };
}

/** Let the urge pass — increments the day's let-pass count. */
export function letPass(state: AppState): AppState {
  return { ...state, saved: state.saved + 1 };
}

/** Checks remaining today (never negative). */
export function remaining(used: number, allowance: number): number {
  return Math.max(0, allowance - used);
}

/**
 * Consecutive days kept within the allowance (used ≤ allowance), counting back
 * from today. Today counts once it is within budget; a missing today is skipped
 * (the streak from yesterday still stands) but any earlier gap or over-budget
 * day ends it.
 */
export function computeStreak(
  history: Record<string, { used: number }>,
  used: number,
  allowance: number,
  now: Date = new Date(),
): number {
  const map: Record<string, { used: number }> = { ...history, [dayKey(now)]: { used } };
  let count = 0;
  for (let i = 0; i < 400; i += 1) {
    const key = dayKey(addDays(now, -i));
    const record = map[key];
    if (record == null) {
      if (i === 0) {
        continue; // nothing logged today yet; keep looking back
      }
      break;
    }
    if (record.used <= allowance) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}
