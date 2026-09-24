import OpenAI from "openai";
import config from "../../config.js";
import { desktopService } from "../desktop/desktop.service.js";
import { aiTools } from "./ai.tools.js";

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

const executeTool = async (name, argumentObject) => {
  switch (name) {
    case "list_projects":
      return desktopService.execute("list_projects", argumentObject);

    case "get_current_project":
      return desktopService.execute("get_current_project", argumentsObject);

    case "open_project":
      return desktopService.execute("open_project", argumentsObject);

    case "open_terminal":
      return desktopService.execute("open_terminal", argumentsObject);

    case "start_dev_server":
      return desktopService.execute("start_dev_server", argumentsObject);

    case "stop_dev_server":
      return desktopService.execute("stop_dev_server", argumentsObject);

    case "get_git_status":
      return desktopService.execute("get_git_status", argumentsObject);

    case "get_git_log":
      return desktopService.execute("get_git_log", argumentsObject);

    case "run_tests":
      return desktopService.execute("run_tests", argumentsObject);

    case "get_system_info":
      return desktopService.execute("get_system_info", argumentsObject);

    default:
      throw new Error(`Tool not allowed: ${name}`);
  }
};

export const chatWithAI = async (message) => {
  const messages = [
    {
      role: "system",
      content: `
    You are an AI Developer Room Assistant.
    
    You help the user manage their development
    environment.
    
    You have access to a limited set of computer
    tools.
    
    Use tools when they are required.
    
    Never invent tool results.
    
    Never execute tools that are not provided.
    
    For destructive or potentially dangerous
    operations, request explicit user confirmation.
    
    Be concise and practical.
    `,
    },
    {
      role: "user",
      content: message,
    },
  ];

  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model: config.openaiModel,
      messages,
      tools: aiTools,
      tool_choice: "auto",
    });

    const assistantMessage = response.choices[0].message;

    messages.push(assistantMessage);

    if (
      !assistantMessage.tool_calls ||
      assistantMessage.tool_calls.length === 0
    ) {
      return assistantMessage.content;
    }

    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;

      let argumentsObject = {};

      try {
        argumentsObject = JSON.parse(toolCall.function.arguments || "{}");
      } catch (error) {
        argumentsObject = {};
      }

      try {
        const result = await executeTool(toolName, argumentsObject);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      } catch (error) {
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify({
            error: error.message,
          }),
        });
      }
    }
  }

  throw new Error("AI agent reached the maximum tool iterations");
};
