import type { Reason } from '@/types/domain';

/*
 * Reasons and affirmations, ported from the prototype. The voice is calm and
 * lightly affirming, never shaming, with no em dashes. "Good" reasons are
 * intentional; the others are honest reflex reasons that earn a gentler nudge.
 */
export const REASONS: Reason[] = [
  { id: 'message', label: 'Message someone', good: true },
  { id: 'lookup', label: 'Look something up', good: true },
  { id: 'photo', label: 'Take a photo', good: true },
  { id: 'call', label: 'Make a call', good: true },
  { id: 'bored', label: "I'm bored", good: false },
  { id: 'reflex', label: 'Just a reflex', good: false },
];

export const AFFIRM_SAVED = [
  "You let it pass. That's the whole practice.",
  "Nice. The urge faded, didn't it?",
  'One less time. Your attention stays yours.',
  "That's restraint, quietly building.",
] as const;

export const AFFIRM_INTENT = [
  'Go ahead. Do the one thing, then come back.',
  'On purpose. Make it count.',
  'You chose this one. Enjoy it, then set it down.',
] as const;

export const NUDGE_REFLEX =
  "This one's a reflex. The feeling usually passes in a minute. Still want to?";
export const NUDGE_OVER =
  "You've used today's checks. There's no penalty, just notice, and choose freely.";

/** Deterministic pick (seeded) so renders and tests are stable. */
export function pick<T>(list: readonly T[], seed: number): T {
  return list[Math.abs(seed) % list.length];
}
