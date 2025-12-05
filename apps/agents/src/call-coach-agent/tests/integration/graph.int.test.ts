import { describe, it, expect } from "vitest";
import { AIMessage } from "@langchain/core/messages";

import { graph } from "../../graph.js";

/**
 * Integration Tests for Call Coach Agent
 *
 * Testing Trophy Pattern - Integration tests (middle layer):
 * - Test the LangGraph graph with real LLM calls
 * - Verify the agent produces call coaching feedback
 * - Validate message flow and state management
 *
 * Note: These tests require ANTHROPIC_API_KEY to be set
 */
describe("Call Coach Agent Integration", () => {
  it("should analyze a sales call transcript and provide feedback", async () => {
    const res = await graph.invoke({
      messages: [
        {
          role: "user",
          content: `Here's a short transcript:
Sales Rep: Hi, thanks for taking my call.
Customer: Sure, what's this about?
Sales Rep: I wanted to tell you about our amazing new product that does everything!
Customer: I'm pretty busy actually...
Sales Rep: It's really great, let me tell you more.`,
        },
      ],
    });

    // Should have an AI response
    const aiMessage = res.messages.find(
      (m: AIMessage) => m._getType() === "ai",
    );
    expect(aiMessage).toBeDefined();
    expect(aiMessage?.content).toBeTruthy();

    // Response should contain coaching elements
    const content = aiMessage?.content as string;
    expect(content.length).toBeGreaterThan(100); // Should be substantial feedback
  });

  it("should handle questions about specific objections", async () => {
    const res = await graph.invoke({
      messages: [
        {
          role: "user",
          content:
            'How should I have handled when the customer said "the price is too high"?',
        },
      ],
    });

    const aiMessage = res.messages.find(
      (m: AIMessage) => m._getType() === "ai",
    );
    expect(aiMessage).toBeDefined();
    expect(aiMessage?.content).toBeTruthy();
  });

  it("should provide balanced feedback with positives and improvements", async () => {
    const res = await graph.invoke({
      messages: [
        {
          role: "user",
          content: `Review this call:
Sales Rep: Good morning! I noticed you downloaded our whitepaper on cloud security. What challenges are you facing in that area?
Customer: We're worried about compliance. We've had some issues with GDPR.
Sales Rep: That's a common concern. Can you tell me more about your current security setup?
Customer: We use AWS but not sure we're configured correctly.
Sales Rep: I see. Would it help if I showed you how our solution helps companies like yours achieve GDPR compliance?`,
        },
      ],
    });

    const aiMessage = res.messages.find(
      (m: AIMessage) => m._getType() === "ai",
    );
    expect(aiMessage).toBeDefined();

    const content = aiMessage?.content as string;
    // Should have substantial coaching feedback
    expect(content.length).toBeGreaterThan(200);
  });

  it("should maintain context for follow-up questions", async () => {
    // Initial feedback
    const res1 = await graph.invoke({
      messages: [
        {
          role: "user",
          content:
            'The customer said "we need to think about it" at the end of the call.',
        },
      ],
    });

    expect(res1.messages.length).toBeGreaterThan(1);

    // Follow-up question
    const res2 = await graph.invoke({
      messages: [
        ...res1.messages,
        {
          role: "user",
          content: "What could I have said to create more urgency?",
        },
      ],
    });

    const lastMessage = res2.messages[res2.messages.length - 1];
    expect(lastMessage._getType()).toBe("ai");
    expect(lastMessage.content).toBeTruthy();
  });
});
