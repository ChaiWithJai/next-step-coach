import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest Configuration for Integration Tests
 *
 * Integration tests require API keys and make real LLM calls.
 * Run with: yarn test:integration
 *
 * Required environment variables:
 * - ANTHROPIC_API_KEY: For Claude models
 * - OPENAI_API_KEY: For OpenAI models (optional)
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.int.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/e2e/**", "**/playwright-report/**"],
    testTimeout: 60000, // Integration tests may take longer due to API calls
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/web/src"),
    },
  },
});
