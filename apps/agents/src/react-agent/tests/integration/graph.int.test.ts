import { describe, it, expect } from "vitest";
import { AIMessage } from "@langchain/core/messages";

import { graph } from "../../graph.js";

/**
 * Integration Tests for Next Step Coach Agent
 *
 * Testing Trophy Pattern - Integration tests (middle layer):
 * - Test the LangGraph graph with real LLM calls
 * - Verify the agent produces coaching responses
 * - Validate message flow and state management
 *
 * Note: These tests require ANTHROPIC_API_KEY to be set
 */
describe("Next Step Coach Agent Integration", () => {
  it("should process a networking conversation and provide coaching", async () => {
    const res = await graph.invoke({
      messages: [
        {
          role: "user",
          content:
            "Had coffee with Sarah from Acme Corp. She mentioned they need help with DevOps. Seemed interested when I talked about our CI/CD expertise.",
        },
      ],
    });

    // Should have an AI response
    const aiMessage = res.messages.find(
      (m: AIMessage) => m._getType() === "ai",
    );
    expect(aiMessage).toBeDefined();
    expect(aiMessage?.content).toBeTruthy();

    // Response should be string content (coaching advice)
    expect(typeof aiMessage?.content).toBe("string");
  });

  it("should maintain conversation context across messages", async () => {
    // First message
    const res1 = await graph.invoke({
      messages: [
        {
          role: "user",
          content: "Met John at the tech conference yesterday.",
        },
      ],
    });

    expect(res1.messages.length).toBeGreaterThan(1);

    // Continue conversation
    const res2 = await graph.invoke({
      messages: [
        ...res1.messages,
        {
          role: "user",
          content:
            "He works at a startup that just raised Series A. What should I follow up with?",
        },
      ],
    });

    const lastMessage = res2.messages[res2.messages.length - 1];
    expect(lastMessage._getType()).toBe("ai");
    expect(lastMessage.content).toBeTruthy();
  });

  it("should handle minimal input gracefully", async () => {
    const res = await graph.invoke({
      messages: [
        {
          role: "user",
          content: "Talked to someone today.",
        },
      ],
    });

    const aiMessage = res.messages.find(
      (m: AIMessage) => m._getType() === "ai",
    );
    expect(aiMessage).toBeDefined();
    // Should still provide some response, possibly asking for more details
    expect(aiMessage?.content).toBeTruthy();
  });
});
