import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (key: string) => map.get(key) ?? null,
    key: (index: number) => Array.from(map.keys())[index] ?? null,
    removeItem: (key: string) => {
      map.delete(key);
    },
    setItem: (key: string, value: string) => {
      map.set(key, value);
    },
  } as Storage;
}

const NOW = new Date(2026, 2, 10, 12, 0, 0);

describe('localStorage repository', () => {
  let repo: Repository;
  let storage: Storage;

  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });

  it('returns sensible defaults when nothing is stored', () => {
    const state = repo.getState(NOW);
    expect(state.version).toBe(1);
    expect(state.settings.allowance).toBe(8);
    expect(state.settings.theme).toBe('night');
    expect(state.app.used).toBe(0);
  });

  it('falls back to defaults on corrupt JSON', () => {
    storage.setItem('enough-v1', 'not json');
    expect(repo.getState(NOW).settings.accent).toBe('#5fa3c0');
  });

  it('falls back to defaults on a wrong shape', () => {
    storage.setItem('enough-v1', JSON.stringify({ version: 1, settings: {} }));
    expect(repo.getState(NOW).settings.allowance).toBe(8);
  });

  it('rejects an out-of-range allowance', () => {
    storage.setItem(
      'enough-v1',
      JSON.stringify({
        version: 1,
        settings: { allowance: 99, pauseSecs: 5, askWhy: true, theme: 'night', accent: '#5fa3c0' },
        app: { day: '2026-03-10', used: 0, saved: 0, history: {} },
      }),
    );
    expect(repo.getState(NOW).settings.allowance).toBe(8);
  });

  it('applies the daily rollover on read', () => {
    repo.setApp({ day: '2026-03-09', used: 5, saved: 2, history: {} });
    const next = repo.getState(NOW);
    expect(next.app.used).toBe(0);
    expect(next.app.history['2026-03-09']).toEqual({ used: 5, saved: 2 });
  });

  it('round-trips settings', () => {
    repo.setSettings({ theme: 'day', pauseSecs: 10 });
    const after = repo.getState(NOW);
    expect(after.settings.theme).toBe('day');
    expect(after.settings.pauseSecs).toBe(10);
  });
});
