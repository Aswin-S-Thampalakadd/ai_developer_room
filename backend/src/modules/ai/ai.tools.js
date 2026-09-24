export const aiTools = [
  {
    type: "function",
    function: {
      name: "list_projects",
      description:
        "List development projects available on the user's computer.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_current_project",
      description: "Get the user's configured current development project.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "open_project",
      description: "Open a development project in VS Code.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project directory name.",
          },
        },
        required: ["project"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "open_terminal",
      description: "Open a terminal inside a development project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project directory name.",
          },
        },
        required: ["project"],
        additionalProperties: false,
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
            description: "Project directory name.",
          },
        },
        required: ["project"],
        additionalProperties: false,
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
            description: "Project directory name.",
          },
        },
        required: ["project"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_git_status",
      description: "Get Git status for a development project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
          },
        },
        required: ["project"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_git_log",
      description: "Get recent Git commits for a development project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 20,
          },
        },
        required: ["project"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "run_tests",
      description: "Run the project's npm test command.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
          },
        },
        required: ["project"],
        additionalProperties: false,
      },
    },
  },

  {
    type: "function",
    function: {
      name: "get_system_info",
      description: "Get basic information about the user's computer.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
    },
  },
];
