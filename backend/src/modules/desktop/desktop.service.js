import WebSocket from "ws";
import config from "../../config.js";

class DesktopServices {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.pendingRequests = new Map();
    this.requestCounter = 0;
  }

  connect() {
    if (this.socket && this.connected) {
      return;
    }

    this.socket = new WebSocket(config.desktopAgentUrl, {
      headers: {
        "x-api-key": config.desktopAgentApiKey,
      },
    });

    this.socket.on("open", () => {
      this.connected = true;
      console.log("Desktop agent connected!");
    });

    this.socket.on("message", (raw) => {
      this.handleMessage(raw);
    });

    this.socket.on("close", () => {
      this.connected = false;

      console.log("Desktop Agent disconnected :(");

      setTimeout(() => {
        this.connect();
      }, 3000);
    });
  }

  handleMessage(raw) {
    try {
      const message = JSON.parse(raw.toString());

      if (!message.id) {
        return;
      }

      const pending = this.pendingRequests.get(message.id);

      if (!pending) {
        return;
      }

      this.pendingRequests.delete(message.id);

      if (!message.success) {
        pending.reject(new Error(message.error || "Desktop Agent Error"));

        return;
      }

      pending.resolve(message.result);
    } catch (error) {
      console.error("Invalid Desktop agent message : ", error.message);
    }
  }

  execute(action, argumentsObject = {}) {
    return new Promise((resolve, reject) => {
      if (!this.socket || !this.connected) {
        reject(new Error("Desktop Agent is not connected"));
        return;
      }

      const id = `request-${++this.requestCounter}`;

      this.pendingRequests.set(id, {
        resolve,
        reject,
      });

      this.socket.send(
        JSON.stringify({
          id,
          action,
          arguments: argumentsObject,
        })
      );

      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
        }

        reject(new Error("Desktop Agent request timed out"));
      }, 3000);
    });
  }
}

export const desktopService = new DesktopServices();
