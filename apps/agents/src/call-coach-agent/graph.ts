import { RunnableConfig } from "@langchain/core/runnables";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";

import { ConfigurationSchema, ensureConfiguration } from "./configuration.js";
import { loadChatModel } from "./utils.js";

/**
 * Next Step Coach - A simple conversational coaching agent.
 * No tools needed - just pure conversation with the coaching prompt.
 */
async function callModel(
  state: typeof MessagesAnnotation.State,
  config: RunnableConfig,
): Promise<typeof MessagesAnnotation.Update> {
  const configuration = ensureConfiguration(config);

  const model = await loadChatModel(configuration.model);

  const response = await model.invoke([
    {
      role: "system",
      content: configuration.systemPromptTemplate.replace(
        "{system_time}",
        new Date().toISOString(),
      ),
    },
    ...state.messages,
  ]);

  return { messages: [response] };
}

// Simple graph: start -> callModel -> end
const workflow = new StateGraph(MessagesAnnotation, ConfigurationSchema)
  .addNode("callModel", callModel)
  .addEdge("__start__", "callModel")
  .addEdge("callModel", "__end__");

export const graph = workflow.compile();
