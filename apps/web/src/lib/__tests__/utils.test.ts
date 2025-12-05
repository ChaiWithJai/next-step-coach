import { describe, it, expect } from "vitest";
import { cn } from "../utils";

/**
 * Unit Tests for Utility Functions
 *
 * Testing Trophy Pattern - Unit tests (base layer):
 * - Fast, isolated tests
 * - Test pure functions and utilities
 * - High coverage, low complexity
 */
describe("cn utility function", () => {
  it("should merge simple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    const shouldInclude = true;
    const shouldExclude = false;
    expect(cn("base", shouldInclude && "included", shouldExclude && "excluded")).toBe(
      "base included",
    );
  });

  it("should handle undefined and null values", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("should merge tailwind classes correctly", () => {
    // Later classes should override earlier ones for the same utility
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle array of classes", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
  });

  it("should handle object notation for conditional classes", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });

  it("should combine multiple input types", () => {
    expect(
      cn("base", { conditional: true, excluded: false }, ["array", "classes"]),
    ).toBe("base conditional array classes");
  });
});
