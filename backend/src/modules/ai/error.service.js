import { desktopService } from "../desktop/desktop.service.js";

export const investigateError = async (project, error) => {
  const [projectInfo, gitStatus, searchResults] = await Promise.all([
    desktopService.call("analyze_project", { project }),
    desktopService.call("get_git_status", { project }),
    desktopService.call("search_code", {
      project,
      searchTerm: error.split("\n")[0],
    }),
  ]);

  return {
    project,
    error,
    projectInfo,
    gitStatus,
    searchResults,
  };
};
