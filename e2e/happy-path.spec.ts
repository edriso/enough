import { expect, test } from '@playwright/test';

test('home is visible, the speed-bump runs, and a let-pass keeps the budget', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');

  // The budget is visible on load.
  const number = page.locator('.en-remaining');
  await expect(number).toBeVisible();
  await expect(number).toHaveText('8');

  // I want to check → the pause (unskippable), then it auto-advances.
  await page.getByRole('button', { name: /I want to check/ }).click();
  await expect(page.locator('.en-orb')).toBeVisible();
  await page.clock.runFor(5000);

  // Pick a reason → confirm → "No, I'm good" lets it pass.
  await page.getByRole('button', { name: 'Look something up' }).click();
  await expect(page.getByText(/Still want to/)).toBeVisible();
  await page.getByRole('button', { name: /No, I.?m good/ }).click();
  await expect(page.getByText(/whole practice|urge faded|attention stays|restraint/)).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();

  // Budget unchanged; the let-pass count shows.
  await expect(number).toHaveText('8');
  await expect(page.getByText(/let pass today/)).toBeVisible();
});

test('a "Yes, use one" spends a check and it persists', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');

  await page.getByRole('button', { name: /I want to check/ }).click();
  await page.clock.runFor(5000);
  await page.getByRole('button', { name: 'Make a call' }).click();
  await page.getByRole('button', { name: 'Yes, use one' }).click();
  await page.getByRole('button', { name: 'Done' }).click();

  await expect(page.locator('.en-remaining')).toHaveText('7');
  await page.reload();
  await expect(page.locator('.en-remaining')).toHaveText('7');
});
