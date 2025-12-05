import { test, expect } from "@playwright/test";

/**
 * JTBD 2: Call Coach
 *
 * Job Statement:
 * "When I've finished a sales call,
 *  I want expert AI feedback on what I did well and what to improve,
 *  so I can close more deals on future calls."
 *
 * These E2E tests validate the complete user journey for this job.
 */

test.describe("JTBD: Call Coach - Get AI feedback on sales calls", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("user can discover and select Call Coach feature", async ({ page }) => {
    // Feature should be visible on dashboard
    await expect(page.getByText("Call Coach")).toBeVisible();
    await expect(
      page.getByText("Get expert AI feedback on your sales calls"),
    ).toBeVisible();

    // Click to select the feature
    await page.getByText("Call Coach").click();

    // Verify navigation to Call Coach
    await expect(page).toHaveTitle("Call Coach");
    await expect(page.getByRole("heading", { name: "Call Coach" })).toBeVisible();
  });

  test("user sees helpful example prompts for call review", async ({
    page,
  }) => {
    // Navigate to Call Coach
    await page.getByText("Call Coach").click();

    // Verify example prompts are shown
    await expect(page.getByText("Try saying:")).toBeVisible();
    await expect(
      page.getByText(/transcript from my discovery call/),
    ).toBeVisible();
    await expect(page.getByText(/price was too high/)).toBeVisible();
  });

  test("user can click example to ask about objection handling", async ({
    page,
  }) => {
    // Navigate to Call Coach
    await page.getByText("Call Coach").click();

    // Click the objection handling example
    const exampleButton = page.getByText(/price was too high/);
    await exampleButton.click();

    // Verify input is populated
    const textarea = page.locator("textarea");
    await expect(textarea).toHaveValue(/price was too high/);
  });

  test("user can submit call transcript for review", async ({ page }) => {
    // Navigate to Call Coach
    await page.getByText("Call Coach").click();

    // Type a mini transcript
    const textarea = page.locator("textarea");
    await textarea.fill(`Sales Rep: Thanks for taking my call today.
Customer: Sure, what did you want to discuss?
Sales Rep: I'd like to show you our new product...`);

    // Submit
    await page.getByRole("button", { name: "Send" }).click();

    // Verify loading state
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("user can navigate between features", async ({ page }) => {
    // Start with Call Coach
    await page.getByText("Call Coach").click();
    await expect(page).toHaveTitle("Call Coach");

    // Go back to dashboard
    await page.getByRole("button", { name: "Back to features" }).click();

    // Now select Next Step Coach
    await page.getByText("Next Step Coach").click();
    await expect(page).toHaveTitle("Next Step Coach");
  });
});
