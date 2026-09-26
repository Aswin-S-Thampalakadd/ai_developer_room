import { WebSocketServer } from "ws";

import config from "./config.js";
import {
  getCurrentProject,
  listProjects,
  openBrowser,
  openProject,
  openTerminal,
} from "./tools/projects.js";
import { getGitBranch, getGitLog, getGitStatus } from "./tools/git.js";
import {
  getDevServers,
  runTests,
  startDevServer,
  stopDevServer,
} from "./tools/terminal.js";
import { getSystemInfo, getSystemTime } from "./tools/system.js";
import { getProjectDocuments, searchCode } from "./tools/code.js";
import { analyzeProject } from "./tools/project-analyzer.js";

const tools = {
  list_projects: async () => listProjects(),

  get_current_projects: async () => getCurrentProject(),

  open_project: async ({ project }) => {
    openProject(project);
  },

  open_terminal: async ({ project }) => {
    openTerminal(project);
  },

  open_browser: async ({ url }) => {
    openBrowser();
  },

  get_git_status: async ({ project }) => {
    return getGitStatus(project);
  },

  get_git_log: async ({ project, limit }) => {
    getGitLog(project, limit);
  },

  get_git_branch: async ({ project }) => {
    getGitBranch(project);
  },

  run_test: async ({ project }) => {
    runTests(project);
  },

  start_dev_server: async ({ project }) => {
    startDevServer(project);
  },

  stop_dev_server: async ({ project }) => {
    stopDevServer(project);
  },

  get_dev_servers: async ({ project }) => {
    getDevServers();
  },

  get_system_info: async () => {
    return getSystemInfo();
  },

  get_system_time: async () => {
    getSystemTime();
  },

  search_code: async () => {
    return searchCode();
  },

  analyze_project: async () => {
    analyzeProject();
  },

  index_project: async () => {
    getProjectDocuments();
  },
};

const authenticate = (request) => {
  const key = request.headers["x-api-key"];
  return key === config.apiKey;
};

const send = (socket, payload) => {
  socket.send(JSON.stringify(payload));
};

export const createServer = () => {
  const wss = new WebSocketServer({
    port: config.port,
  });

  wss.on("connection", (socket, request) => {
    if (!authenticate(request)) {
      send(socket, {
        succss: false,
        error: "Unauthenticated",
      });

      socket.close();

      return;
    }

    send(socket, {
      success: true,
      event: "connected",
      message: "Desktop agent connected",
    });

    socket.on("message", async (rawMessage) => {
      try {
        const request = JSON.parse(rawMessage.toString());

        const { id, action, arguments: args = {} } = request;

        if (!id) {
          throw new Error("Request id is missing");
        }

        if (!action) {
          throw new Error("Action is missing");
        }

        const tool = tools[action];

        if (!tool) {
          throw new Error(`Unknown action : ${action}`);
        }

        const result = await tool(args);

        send(socket, {
          id,
          success: true,
          action,
          result,
        });
      } catch (error) {
        send(socket, {
          succss: false,
          error: error.message,
        });
      }
    });

    socket.on("error", (error) => {
      console.error("Websocket error : ", error.message);
    });
  });

  wss.on("listening", () => {
    console.log(`Desktop agent is running on wss://localhost:${config.port}`);
  });

  return wss;
};
