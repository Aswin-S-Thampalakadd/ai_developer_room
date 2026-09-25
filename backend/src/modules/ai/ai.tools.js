export const aiTools = [
  {
    type: "function",
    function: {
      name: "list_projects",
      description:
        "List all available developer projects on the user's computer.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_current_project",
      description: "Get the currently configured developer project.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "open_project",
      description: "Open a developer project in VS Code.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "open_terminal",
      description: "Open a terminal in a developer project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "start_dev_server",
      description: "Start the development server for a project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "stop_dev_server",
      description: "Stop the development server for a project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_git_status",
      description: "Get the Git status of a project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_git_log",
      description: "Get recent Git commits for a project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
          limit: {
            type: "number",
            description: "Number of commits",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "run_tests",
      description: "Run the project's test suite.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
        },
        required: ["project"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_system_info",
      description: "Get information about the user's computer.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
];
