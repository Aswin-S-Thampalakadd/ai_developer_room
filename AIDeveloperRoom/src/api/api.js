import axios from "axios";

const API_URL = "http://10.218.171.171:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const sendAIMessage = async (message, project) => {
  const response = await api.post("/ai/chat", {
    message,
    project, 
  });

  return response.data;
};

export const getProjects = async () => {
  const response = await api.post("/ai/chat", {
    message: "Show me all my available projects",
  });

  return response.data;
};

export const getHealth = async () => {
  const response = await api.get("/../health");

  return response.data;
};

export default api;
