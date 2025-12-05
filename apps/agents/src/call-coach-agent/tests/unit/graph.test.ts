import { describe, it, expect } from "vitest";
import { ensureConfiguration } from "../../configuration.js";
import { SYSTEM_PROMPT_TEMPLATE } from "../../prompts.js";

/**
 * Unit Tests for Call Coach Configuration
 *
 * Testing Trophy Pattern - Unit tests (base layer):
 * - Test configuration defaults and overrides
 * - Fast, isolated, no external dependencies
 */
describe("Call Coach Configuration", () => {
  describe("ensureConfiguration", () => {
    it("should return default values when no configurable provided", () => {
      const config = ensureConfiguration({});

      expect(config.systemPromptTemplate).toBe(SYSTEM_PROMPT_TEMPLATE);
      expect(config.model).toBe("claude-sonnet-4-20250514");
    });

    it("should return default values when configurable is empty", () => {
      const config = ensureConfiguration({ configurable: {} });

      expect(config.systemPromptTemplate).toBe(SYSTEM_PROMPT_TEMPLATE);
      expect(config.model).toBe("claude-sonnet-4-20250514");
    });

    it("should allow overriding the model", () => {
      const config = ensureConfiguration({
        configurable: { model: "gpt-4" },
      });

      expect(config.model).toBe("gpt-4");
      expect(config.systemPromptTemplate).toBe(SYSTEM_PROMPT_TEMPLATE);
    });

    it("should allow overriding the system prompt", () => {
      const customPrompt = "You are a helpful assistant.";
      const config = ensureConfiguration({
        configurable: { systemPromptTemplate: customPrompt },
      });

      expect(config.systemPromptTemplate).toBe(customPrompt);
      expect(config.model).toBe("claude-sonnet-4-20250514");
    });

    it("should allow overriding both model and prompt", () => {
      const customPrompt = "Custom prompt";
      const customModel = "custom-model";

      const config = ensureConfiguration({
        configurable: {
          systemPromptTemplate: customPrompt,
          model: customModel,
        },
      });

      expect(config.systemPromptTemplate).toBe(customPrompt);
      expect(config.model).toBe(customModel);
    });
  });
});

describe("CALL_COACH_SYSTEM_PROMPT", () => {
  it("should contain placeholder for system time", () => {
    expect(SYSTEM_PROMPT_TEMPLATE).toContain("{system_time}");
  });

  it("should mention Call Coach or Sales Coach role", () => {
    expect(SYSTEM_PROMPT_TEMPLATE).toMatch(/call coach|sales.?call/i);
  });

  it("should include coaching framework elements", () => {
    // Check for key coaching elements mentioned in the prompt
    expect(SYSTEM_PROMPT_TEMPLATE).toMatch(/opening|discovery|objection|closing/i);
  });

  it("should include scorecard rating system", () => {
    expect(SYSTEM_PROMPT_TEMPLATE).toMatch(/score|rating/i);
  });
});
