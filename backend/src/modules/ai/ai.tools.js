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

  // {
  //   type: "function",
  //   function: {
  //     name: "open_project",
  //     description: "Open a developer project in VS Code.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         project: {
  //           type: "string",
  //           description: "Project name",
  //         },
  //       },
  //       required: ["project"],
  //     },
  //   },
  // },

  {
    type: "function",
    function: {
      name: "open_project",
      description:
        "Open a project in VS Code. The project argument must exactly match the project name provided by the user or returned by list_projects.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description:
              "Exact project directory name, for example used_car_sale_app",
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

  {
    type: "function",
    function: {
      name: "search_code",
      description: "Search for a text pattern inside a developer project.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "string",
            description: "Project name",
          },
          searchTerm: {
            type: "string",
            description:
              "Text, function, class, variable, or error to search for",
          },
        },
        required: ["project", "searchTerm"],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "analyze_project",
      description:
        "Analyze the structure and package configuration of a project.",
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
      name: "investigate_error",
      description:
        "Investigate a development error using project code, project structure, Git status, and configuration.",
      parameters: {
        type: "object",
        properties: {
          project: {
            type: "object",
          },
          error: {
            type: "string",
          },
        },

        required: ["project", "error"],
      },
    },
  },
];
