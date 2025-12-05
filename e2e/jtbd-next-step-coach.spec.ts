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

  test("user sees structured form for context input", async ({ page }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Verify structured form is shown (not example prompts)
    await expect(page.getByText("Who do you need next steps on?")).toBeVisible();
    await expect(page.getByText("What's your goal for this relationship?")).toBeVisible();
    await expect(page.getByText("What happened? (brain dump everything)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Get My Next Steps" })).toBeVisible();
  });

  test("user can select relationship type from dropdown", async ({ page }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Click the relationship type dropdown
    await page.getByRole("combobox").click();

    // Verify options are visible
    await expect(page.getByRole("option", { name: "Customer" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Funder / Investor" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Candidate" })).toBeVisible();
    await expect(page.getByRole("option", { name: "Champion / Advisor" })).toBeVisible();

    // Select an option
    await page.getByRole("option", { name: "Customer" }).click();

    // Verify selection
    await expect(page.getByRole("combobox")).toHaveText(/Customer/);
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

  test("user can submit structured form and see loading state", async ({
    page,
  }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Select relationship type
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: "Customer" }).click();

    // Fill in goal
    await page.getByLabel("What's your goal for this relationship?").fill("Close the deal by end of quarter");

    // Fill in context
    await page.getByLabel("What happened? (brain dump everything)").fill(
      "Had coffee with Sarah from Acme Corp. She mentioned they need help with DevOps.",
    );

    // Submit
    await page.getByRole("button", { name: "Get My Next Steps" }).click();

    // Verify form submission triggered - button changes to "Analyzing..."
    await expect(page.getByRole("button", { name: "Analyzing..." })).toBeVisible();
  });

  test("user can start a new thread while in a conversation", async ({
    page,
  }) => {
    // Navigate to Next Step Coach
    await page.getByText("Next Step Coach").click();

    // Click new thread button
    await page.getByRole("button", { name: "New thread" }).click();

    // Verify structured form is shown again
    await expect(page.getByText("Who do you need next steps on?")).toBeVisible();
  });
});
