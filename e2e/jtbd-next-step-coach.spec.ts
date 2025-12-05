import { test, expect } from "@playwright/test";

/**
 * JTBD 1: Next Step Coach
 *
 * Job Statement:
 * "When I have brain-dump notes about a networking conversation,
 *  I want to get clear, actionable follow-up recommendations,
 *  so I can maintain relationships and close deals."
 *
 * These E2E tests validate the complete user journey for this job.
 */

test.describe("JTBD: Next Step Coach - Turn conversations into follow-ups", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user can discover and select Next Step Coach feature", async ({
    page,
  }) => {
    // Feature should be visible on dashboard
    await expect(page.getByText("Sales Coaching Suite")).toBeVisible();
    await expect(page.getByText("Next Step Coach")).toBeVisible();
    await expect(
      page.getByText("Turn raw brain-dump notes about networking"),
    ).toBeVisible();

    // Click to select the feature
    await page.getByText("Next Step Coach").click();

    // Verify navigation to Next Step Coach
    await expect(page).toHaveTitle("Next Step Coach");
    await expect(page.getByRole("heading", { name: "Next Step Coach" })).toBeVisible();
  });

  test("user sees helpful example prompts on empty state", async ({ page }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Verify example prompts are shown
    await expect(page.getByText("Try saying:")).toBeVisible();
    await expect(
      page.getByText(/Had coffee with Sarah from Acme Corp/),
    ).toBeVisible();
    await expect(
      page.getByText(/Met John at the conference/),
    ).toBeVisible();
  });

  test("user can click example prompt to populate input", async ({ page }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Click an example prompt
    const exampleButton = page.getByText(/Had coffee with Sarah from Acme Corp/);
    await exampleButton.click();

    // Verify input is populated
    const textarea = page.locator("textarea");
    await expect(textarea).toHaveValue(/Had coffee with Sarah from Acme Corp/);
  });

  test("user can navigate back to feature dashboard", async ({ page }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Click home button
    await page.getByRole("button", { name: "Back to features" }).click();

    // Verify back on dashboard
    await expect(page.getByText("Sales Coaching Suite")).toBeVisible();
    await expect(page).toHaveTitle("Sales Coaching Suite");
  });

  test("user can submit brain-dump notes and see loading state", async ({
    page,
  }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Type brain-dump notes
    const textarea = page.locator("textarea");
    await textarea.fill(
      "Had coffee with Sarah from Acme Corp. She mentioned they need help with DevOps.",
    );

    // Submit
    await page.getByRole("button", { name: "Send" }).click();

    // Verify loading state appears (button changes to Cancel)
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("user can start a new thread while in a conversation", async ({
    page,
  }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Click new thread button
    await page.getByRole("button", { name: "New thread" }).click();

    // Verify empty state is shown again
    await expect(page.getByText("Try saying:")).toBeVisible();
  });
});
