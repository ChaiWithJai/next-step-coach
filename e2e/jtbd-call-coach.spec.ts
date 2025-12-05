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

  test("user sees structured form for transcript input", async ({
    page,
  }) => {
    // Navigate to Call Coach
    await page.getByText("Call Coach").click();

    // Verify structured form is shown (not example prompts)
    await expect(page.getByText("Call Transcript")).toBeVisible();
    await expect(page.getByRole("button", { name: "Paste" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Upload" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Get Call Feedback" })).toBeVisible();
  });

  test("user can toggle between paste and upload modes", async ({
    page,
  }) => {
    // Navigate to Call Coach
    await page.getByText("Call Coach").click();

    // Paste should be active by default
    await expect(page.locator("textarea").first()).toBeVisible();

    // Click Upload toggle
    await page.getByRole("button", { name: "Upload" }).click();

    // Verify upload zone is shown
    await expect(page.getByText("Drop file or click to browse")).toBeVisible();

    // Click Paste toggle to go back
    await page.getByRole("button", { name: "Paste" }).click();

    // Verify textarea is visible again
    await expect(page.locator("textarea").first()).toBeVisible();
  });

  test("user can submit call transcript for review", async ({ page }) => {
    // Navigate to Call Coach
    await page.getByText("Call Coach").click();

    // Type a mini transcript in the paste mode
    const textarea = page.locator("textarea").first();
    await textarea.fill(`Sales Rep: Thanks for taking my call today.
Customer: Sure, what did you want to discuss?
Sales Rep: I'd like to show you our new product...`);

    // Submit
    await page.getByRole("button", { name: "Get Call Feedback" }).click();

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
