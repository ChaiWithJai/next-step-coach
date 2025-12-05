import { describe, it, expect } from "vitest";
import {
  ensureToolCallsHaveResponses,
  DO_NOT_RENDER_ID_PREFIX,
} from "../ensure-tool-responses";
import { Message } from "@langchain/langgraph-sdk";

/**
 * Unit Tests for Tool Response Utility
 *
 * Testing Trophy Pattern - Unit tests (base layer):
 * - Test message processing logic
 * - Ensure tool calls get proper responses
 */
describe("ensureToolCallsHaveResponses", () => {
  it("should return empty array for messages without tool calls", () => {
    const messages: Message[] = [
      { id: "1", type: "human", content: "Hello" },
      { id: "2", type: "ai", content: "Hi there!" },
    ];

    const result = ensureToolCallsHaveResponses(messages);
    expect(result).toEqual([]);
  });

  it("should return empty array when AI tool call has following tool message", () => {
    const messages: Message[] = [
      { id: "1", type: "human", content: "What's the weather?" },
      {
        id: "2",
        type: "ai",
        content: "",
        tool_calls: [{ id: "tc1", name: "get_weather", args: {} }],
      },
      {
        id: "3",
        type: "tool",
        tool_call_id: "tc1",
        content: "Sunny, 72°F",
        name: "get_weather",
      },
    ];

    const result = ensureToolCallsHaveResponses(messages);
    expect(result).toEqual([]);
  });

  it("should create tool response when AI tool call has no following tool message", () => {
    const messages: Message[] = [
      { id: "1", type: "human", content: "What's the weather?" },
      {
        id: "2",
        type: "ai",
        content: "",
        tool_calls: [{ id: "tc1", name: "get_weather", args: {} }],
      },
    ];

    const result = ensureToolCallsHaveResponses(messages);

    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("tool");
    expect(result[0].tool_call_id).toBe("tc1");
    expect(result[0].name).toBe("get_weather");
    expect(result[0].content).toBe("Successfully handled tool call.");
    expect(result[0].id).toContain(DO_NOT_RENDER_ID_PREFIX);
  });

  it("should handle multiple tool calls in one message", () => {
    const messages: Message[] = [
      {
        id: "1",
        type: "ai",
        content: "",
        tool_calls: [
          { id: "tc1", name: "tool_a", args: {} },
          { id: "tc2", name: "tool_b", args: {} },
        ],
      },
    ];

    const result = ensureToolCallsHaveResponses(messages);

    expect(result).toHaveLength(2);
    expect(result[0].tool_call_id).toBe("tc1");
    expect(result[1].tool_call_id).toBe("tc2");
  });

  it("should handle empty tool_calls array", () => {
    const messages: Message[] = [
      {
        id: "1",
        type: "ai",
        content: "Hello",
        tool_calls: [],
      },
    ];

    const result = ensureToolCallsHaveResponses(messages);
    expect(result).toEqual([]);
  });

  it("should handle mixed message types", () => {
    const messages: Message[] = [
      { id: "1", type: "human", content: "Query 1" },
      {
        id: "2",
        type: "ai",
        content: "",
        tool_calls: [{ id: "tc1", name: "tool_a", args: {} }],
      },
      {
        id: "3",
        type: "tool",
        tool_call_id: "tc1",
        content: "Result",
        name: "tool_a",
      },
      { id: "4", type: "ai", content: "Based on the result..." },
      { id: "5", type: "human", content: "Thanks!" },
      {
        id: "6",
        type: "ai",
        content: "",
        tool_calls: [{ id: "tc2", name: "tool_b", args: {} }],
      },
      // No tool response for tc2!
    ];

    const result = ensureToolCallsHaveResponses(messages);

    expect(result).toHaveLength(1);
    expect(result[0].tool_call_id).toBe("tc2");
  });
});
