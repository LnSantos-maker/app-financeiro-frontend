import { test, expect } from '@playwright/test';

test('login page has title and login form', async ({ page }) => {
  await page.goto('/');

  // Check title
  await expect(page.locator('h1').filter({ hasText: 'PrivateFinance.' })).toBeVisible();

  // Check form inputs
  await expect(page.getByPlaceholder('usuario@email.com')).toBeVisible();
  await expect(page.getByPlaceholder('••••••••')).toBeVisible();

  // Check button
  const loginButton = page.getByRole('button', { name: 'Autenticar' });
  await expect(loginButton).toBeVisible();
});
