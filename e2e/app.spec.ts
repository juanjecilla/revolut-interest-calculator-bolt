import { test, expect } from '@playwright/test';

test.describe('Revolut Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page title and heading render', async ({ page }) => {
    await expect(page).toHaveTitle(/Revolut Subscription Calculator/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Revolut Subscription Calculator'
    );
  });

  test('all 5 plan cards render', async ({ page }) => {
    const planNames = ['Standard', 'Plus', 'Premium', 'Metal', 'Ultra'];
    for (const name of planNames) {
      await expect(page.getByRole('heading', { level: 3, name })).toBeVisible();
    }
  });

  test('SVG chart renders path elements for all 5 plans', async ({ page }) => {
    const paths = page.locator('svg path[aria-label]');
    await expect(paths).toHaveCount(5);
  });

  test('Best Choice badge on Standard at low amount', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    await input.fill('1000');
    await expect(page.getByText('Best Choice').first()).toBeVisible();
    const standardCard = page.locator('[data-plan="Standard"]');
    await expect(standardCard.getByText('Best Choice')).toBeVisible();
  });

  test('Best Choice badge moves to Ultra at high amount', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    await input.fill('500000');
    const ultraCard = page.locator('[data-plan="Ultra"]');
    await expect(ultraCard.getByText('Best Choice')).toBeVisible();
  });

  test('negative net profit shown for Plus at low amount', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    await input.fill('100');
    const plusCard = page.locator('[data-plan="Plus"]');
    // Plus charges €3.99/month; at €100 invested gross interest (~€1.25) < annual fee (~€47.88)
    const netProfitEl = plusCard.locator('[data-testid="net-profit"]');
    await expect(netProfitEl).toBeVisible();
    await expect(netProfitEl).toContainText('-');
  });

  test('input amount defaults to 10000', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    await expect(input).toHaveValue('10000');
  });

  test('best plan banner displays recommended plan name', async ({ page }) => {
    const input = page.getByRole('spinbutton');
    await input.fill('10000');
    await expect(page.locator('[data-testid="best-plan-banner"]')).toBeVisible();
  });

  test('Ko-fi link has noopener noreferrer', async ({ page }) => {
    const kofiLink = page.getByRole('link', { name: /ko-fi/i });
    await expect(kofiLink).toHaveAttribute('rel', 'noopener noreferrer');
    await expect(kofiLink).toHaveAttribute('target', '_blank');
  });
});
