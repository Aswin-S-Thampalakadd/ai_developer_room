import ollama from "ollama";
import config from "../../config.js";
import { desktopService } from "../desktop/desktop.service.js";
import { aiTools } from "./ai.tools.js";
import { investigateError } from "./error.service.js";
import { systemMessage } from "../../utils/messages.js";
import { retrieveProjectContext } from "../rag/rag.service.js";

const SYSTEM_PROMPT = `
You are AI Developer Room Assistant.

You are a personal developer assistant running on the user's computer.

You can interact with the user's development environment through approved tools.

Rules:

1. Never invent tool results.
2. Use tools when the user asks about projects, Git, tests, development servers, or system information.
3. Only use the tools provided to you.
4. Never execute arbitrary shell commands.
5. Never access files outside the allowed project directory.
6. Never expose API keys, passwords, secrets, tokens, or credentials.
7. Never modify source code unless an approved editing tool exists.
8. Destructive or high-risk operations require explicit confirmation.
9. Be concise and practical.
10. If a tool fails, clearly explain the actual error.
11. If you do not know something, say so.
`;

const executeTool = async (name, args) => {
  switch (name) {
    case "list_projects":
      return await desktopService.call("list_projects", {});

    case "get_current_project":
      return await desktopService.call("get_current_project", {});

    case "open_project":
      return await desktopService.call("open_project", args);

    case "open_terminal":
      return await desktopService.call("open_terminal", args);

    case "start_dev_server":
      return await desktopService.call("start_dev_server", args);

    case "stop_dev_server":
      return await desktopService.call("stop_dev_server", args);

    case "get_git_status":
      return await desktopService.call("get_git_status", args);

    case "get_git_log":
      return await desktopService.call("get_git_log", args);

    case "run_tests":
      return await desktopService.call("run_tests", args);

    case "get_system_info":
      return await desktopService.call("get_system_info", {});

    case "search_code":
      return await desktopService.call("search_code", args);

    case "analyze_project":
      return await desktopService.call("analyze_project", args);

    case "investigate_error":
      return investigateError(args.project, args.error);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};

const getProjectContext = async (message, project) => {
  if (!project) {
    return "";
  }

  const results = await retrieveProjectContext(project, message, 6);

  return results
    .map((result) => `FILE: ${result.filePath}\n${result.content}`)
    .join("\n\n");
};

export const chatWithAI = async (message, project = null) => {
  let messages = [
    {
      role: "system",
      content: systemMessage,
    },
    {
      role: "user",
      content: message,
    },
  ];

  if (project) {
    messages = [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "system",
        content: `
The user has selected the following project:

${project}

This is the exact project name.

For any project-related tool call, use this exact project name:
${project}

Do not ask the user for the project name again.
Do not call list_projects to determine the project.
Do not modify, normalize, replace, or reformat the project name.
        `,
      },
      {
        role: "user",
        content: message,
      },
    ];
  }

  for (let iteration = 0; iteration < 5; iteration++) {
    const response = await ollama.chat({
      host: config.ollamaHost,
      model: config.ollamaModel,
      messages,
      tools: aiTools,
      stream: false,
    });

    const assistantMessage = response.message;

    console.log("AI MESSAGE:", assistantMessage);
    console.log("TOOL CALLS:", assistantMessage.tool_calls);

    messages.push(assistantMessage);

    if (
      !assistantMessage.tool_calls ||
      assistantMessage.tool_calls.length === 0
    ) {
      return assistantMessage.content;
    }

    for (const toolCall of assistantMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const toolArgs = toolCall.function.arguments || {};

      console.log("TOOL NAME:", toolName);
      console.log("TOOL ARGS:", toolArgs);

      try {
        const result = await executeTool(toolName, toolArgs);

        console.log("TOOL RESULT:", result);

        messages.push({
          role: "tool",
          tool_name: toolName,
          content: JSON.stringify(result),
        });
      } catch (error) {
        console.error("TOOL ERROR:", error);

        messages.push({
          role: "tool",
          tool_name: toolName,
          content: JSON.stringify({
            success: false,
            error: error.message,
          }),
        });
      }
    }
  }

  throw new Error("Maximum tool execution iterations reached");
};

// export const chatWithAI = async (message, project = null) => {
//   let messages = [
//     {
//       role: "system",
//       content: systemMessage,
//     },
//     {
//       role: "user",
//       content: message,
//     },
//   ];
//   let projectContext = null;

//   if (project) {
//     projectContext = await getProjectContext(message, project);
//     messages = [
//       systemMessage,
//       {
//         role: "system",
//         content: `
//     Relevant project context:

//     ${projectContext}
//     `,
//       },
//       {
//         role: "user",
//         content: message,
//       },
//     ];
//   }

//   for (let iteration = 0; iteration < 5; iteration++) {
//     const response = await ollama.chat({
//       host: config.ollamaHost,
//       model: config.ollamaModel,
//       messages,
//       tools: aiTools,
//       stream: false,
//     });

//     const assistantMessage = response.message;

//     messages.push(assistantMessage);

//     if (
//       !assistantMessage.tool_calls ||
//       assistantMessage.tool_calls.length === 0
//     ) {
//       return assistantMessage.content;
//     }

//     for (const toolCall of assistantMessage.tool_calls) {
//       const toolName = toolCall.function.name;

//       const toolArgs = toolCall.function.arguments || {};

//       try {
//         const result = await executeTool(toolName, toolArgs);

//         messages.push({
//           role: "tool",
//           tool_name: toolName,
//           content: JSON.stringify(result),
//         });
//       } catch (error) {
//         messages.push({
//           role: "tool",
//           tool_name: toolName,
//           content: JSON.stringify({
//             success: false,
//             error: error.message,
//           }),
//         });
//       }
//     }
//   }

//   throw new Error("Maximum tool execution iterations reached");
// };
