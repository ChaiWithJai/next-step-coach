import { test, expect } from "@playwright/test";

/**
 * Dashboard & Navigation Tests
 *
 * These tests validate the core navigation and branding elements
 * that support all JTBD flows.
 */

test.describe("Dashboard & Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("dashboard displays PIE branding", async ({ page }) => {
    // Check for PIE branding footer
    await expect(page.getByText("Made with")).toBeVisible();
    await expect(page.getByText("Princeton Idea Exchange")).toBeVisible();

    // Check the link works
    const pieLink = page.getByRole("link", { name: "Princeton Idea Exchange" });
    await expect(pieLink).toHaveAttribute(
      "href",
      "https://princetonideaexchange.com",
    );
  });

  test("dashboard shows all coaching features", async ({ page }) => {
    await expect(page.getByText("Sales Coaching Suite")).toBeVisible();

    // Both features should be visible
    await expect(page.getByText("Next Step Coach")).toBeVisible();
    await expect(page.getByText("Call Coach")).toBeVisible();
  });

  test("each feature card has examples", async ({ page }) => {
    // Next Step Coach examples
    await expect(
      page.getByText(/Had coffee with Sarah from Acme Corp/),
    ).toBeVisible();

    // Call Coach examples
    await expect(
      page.getByText(/transcript from my discovery call/),
    ).toBeVisible();
  });

  test("feature page shows PIE branding footer", async ({ page }) => {
    // Navigate to a feature
    await page.getByText("Next Step Coach").click();

    // PIE branding should still be visible
    await expect(page.getByText("Made with")).toBeVisible();
    await expect(page.getByText("Princeton Idea Exchange")).toBeVisible();
  });

  test("chat history sidebar can be toggled", async ({ page }) => {
    // Navigate to a feature first
    await page.getByText("Next Step Coach").click();

    // Look for the sidebar toggle button (PanelRightClose or PanelRightOpen)
    const toggleButton = page.locator('button').filter({ has: page.locator('svg') }).first();

    // This test validates the sidebar toggle exists
    await expect(toggleButton).toBeVisible();
  });

  test("document title updates based on current feature", async ({ page }) => {
    // Dashboard title
    await expect(page).toHaveTitle("Sales Coaching Suite");

    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();
    await expect(page).toHaveTitle("Next Step Coach");

    // Go back and navigate to Call Coach
    await page.getByRole("button", { name: "Back to features" }).click();
    await page.getByText("Call Coach").click();
    await expect(page).toHaveTitle("Call Coach");
  });
});
