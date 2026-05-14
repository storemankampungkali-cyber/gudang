import { test, expect } from '@playwright/test';

/**
 * Frontend E2E & API Data Fetching Tests
 * Run with: npx playwright test tests/frontend.spec.ts
 */

test.describe('Frontend API Data Fetching & UI Non-blocking', () => {

  test('Should load login page and check API connectivity', async ({ page, request }) => {
    // 1. Visit the app root
    await page.goto('/');

    // 2. Ensure the UI loads properly without blocking (e.g., login form is visible)
    await expect(page.locator('text=Login to GudangPro')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // 3. Test data fetching directly via Playwright request context to ensure backend is reachable from frontend network
    const healthResponse = await request.get('/api/v1/health');
    expect(healthResponse.ok()).toBeTruthy();
    
    // Parse the JSON body
    const baseResp = await healthResponse.json();
    expect(baseResp).toHaveProperty('success', true);
    expect(baseResp.status).toBe('UP');
  });

  test('UI should handle missing/unauthorized data gracefully without crashing', async ({ page }) => {
    // Simulate user trying to access a secure route directly without auth
    await page.goto('/dashboard');
    
    // Wait for auto redirect to login or an error message handled by UI gracefully
    await expect(page).toHaveURL(/.*\/login/); 
    // This proves the frontend correctly intercepts API unauthorized errors and redirects, rather than freezing
  });
});
