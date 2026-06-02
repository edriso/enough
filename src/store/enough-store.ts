import { create } from 'zustand';
import { letPass, spend } from '@/lib/budget';
import { repository } from '@/lib/repository';
import type { AppState, Accent, Settings, Theme } from '@/types/domain';

interface EnoughState {
  settings: Settings;
  app: AppState;
  spendCheck: () => void;
  letItPass: () => void;
  setAllowance: (n: number) => void;
  setPauseSecs: (n: number) => void;
  setAskWhy: (on: boolean) => void;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useEnoughStore = create<EnoughState>((set, get) => {
  function patchSettings(patch: Partial<Settings>): void {
    set({ settings: repository.setSettings(patch).settings });
  }
  function commitApp(app: AppState): void {
    set({ app: repository.setApp(app).app });
  }

  return {
    settings: initial.settings,
    app: initial.app,

    spendCheck: () => commitApp(spend(get().app)),
    letItPass: () => commitApp(letPass(get().app)),

    setAllowance: (allowance) => patchSettings({ allowance }),
    setPauseSecs: (pauseSecs) => patchSettings({ pauseSecs }),
    setAskWhy: (askWhy) => patchSettings({ askWhy }),
    setTheme: (theme) => patchSettings({ theme }),
    setAccent: (accent) => patchSettings({ accent }),
  };
});
