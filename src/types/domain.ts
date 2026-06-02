import { z } from 'zod';

/** A reason to check. `good` marks intentional reasons vs honest reflex ones. */
export interface Reason {
  id: string;
  label: string;
  good: boolean;
}

/** The one-page phase machine. */
export type Phase = 'home' | 'pause' | 'why' | 'confirm' | 'go' | 'saved';

export const dayRecordSchema = z.object({
  used: z.number().int().nonnegative(),
  saved: z.number().int().nonnegative(),
});
export type DayRecord = z.infer<typeof dayRecordSchema>;

export const THEMES = ['night', 'day'] as const;
export const themeSchema = z.enum(THEMES);
export type Theme = z.infer<typeof themeSchema>;

/** Calm accent swatches. */
export const ACCENTS = ['#5fa3c0', '#7e9cc4', '#8a9a7e', '#b59b7a', '#9a8fb0'] as const;
export const accentSchema = z.enum(ACCENTS);
export type Accent = z.infer<typeof accentSchema>;

export const settingsSchema = z.object({
  allowance: z.number().int().min(3).max(20),
  pauseSecs: z.number().int().min(3).max(15),
  askWhy: z.boolean(),
  theme: themeSchema,
  accent: accentSchema,
});
export type Settings = z.infer<typeof settingsSchema>;

/** Today's counters plus the archive of past days. */
export const appStateSchema = z.object({
  day: z.string(),
  used: z.number().int().nonnegative(),
  saved: z.number().int().nonnegative(),
  history: z.record(z.string(), dayRecordSchema),
});
export type AppState = z.infer<typeof appStateSchema>;

export const persistedStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  app: appStateSchema,
});
export type PersistedState = z.infer<typeof persistedStateSchema>;
