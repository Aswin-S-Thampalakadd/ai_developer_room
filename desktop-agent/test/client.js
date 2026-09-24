import WebSocket from "ws";
import dotenv from "dotenv";
dotenv.config();

const socket = new WebSocket("ws://localhost:5001", {
  headers: {
    "x-api-key": process.env.DESKTOP_AGENT_API_KEY || "something_secret",
  },
});

socket.on("open", () => {
  console.log("Connected");

  //   socket.send(
  //     JSON.stringify({
  //       id: "1",
  //       action: "get_system_info",
  //       arguments: {},
  //     })
  //   );

  //   socket.send(
  //     JSON.stringify({
  //       id: "2",
  //       action: "get_git_status",
  //       arguments: {
  //         project: "used_car_sale_app",
  //       },
  //     })
  //   );

  socket.send(
    JSON.stringify({
      id: "3",
      action: "start_dev_server",
      arguments: {
        project: "used-car-application",
      },
    })
  );
});

socket.on("message", (message) => {
  console.log(JSON.stringify(JSON.parse(message.toString()), null, 2));
});
