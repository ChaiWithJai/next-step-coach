import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest Configuration for Unit & Integration Tests
 *
 * Testing Trophy Pattern:
 * - Unit tests (base): Fast, isolated, test utilities and helpers
 * - Integration tests (middle): Test module interactions without UI
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // Exclude integration tests by default (they require API keys)
    // Run with: yarn test:integration
    exclude: [
      "**/node_modules/**",
      "**/e2e/**",
      "**/playwright-report/**",
      "**/*.int.test.{ts,tsx}",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["apps/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/node_modules/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/web/src"),
    },
  },
});
