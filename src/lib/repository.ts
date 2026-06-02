import {
  type AppState,
  type PersistedState,
  persistedStateSchema,
  type Settings,
} from '@/types/domain';
import { dayKey } from './date';
import { rollover } from './budget';

/*
 * The persistence seam. Components and the store never touch storage directly.
 * Saved data is parsed with Zod, so a corrupt, partial, or out-of-date shape
 * safely falls back to defaults. The daily rollover is applied on read.
 */
const STORAGE_KEY = 'enough-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: { allowance: 8, pauseSecs: 5, askWhy: true, theme: 'night', accent: '#5fa3c0' },
    app: { day: dayKey(), used: 0, saved: 0, history: {} },
  };
}

export interface Repository {
  getState(now?: Date): PersistedState;
  saveState(state: PersistedState): void;
  setSettings(patch: Partial<Settings>): PersistedState;
  setApp(app: AppState): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function read(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }

  function getState(now: Date = new Date()): PersistedState {
    const state = read();
    return { ...state, app: rollover(state.app, now) };
  }

  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can be unavailable (private mode, quota); the app still works.
    }
  }

  function setSettings(patch: Partial<Settings>): PersistedState {
    const current = read();
    const next: PersistedState = { ...current, settings: { ...current.settings, ...patch } };
    saveState(next);
    return next;
  }

  function setApp(app: AppState): PersistedState {
    const current = read();
    const next: PersistedState = { ...current, app };
    saveState(next);
    return next;
  }

  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors.
    }
  }

  return { getState, saveState, setSettings, setApp, clear };
}

export const repository: Repository = createLocalStorageRepository();
