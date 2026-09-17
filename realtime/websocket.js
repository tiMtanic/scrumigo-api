import { WebSocketServer } from "ws";
import { verifyJwt } from "../utils/jwt.js";
import { connectionManager } from "./connectionManager.js";

const getToken = (request) => {
  const protocols = request.headers["sec-websocket-protocol"];

  if (!protocols) {
    return null;
  }

  const tokenProtocol = protocols
    .split(",")
    .map((protocol) => protocol.trim())
    .find((protocol) => protocol.startsWith("jwt."));

  if (!tokenProtocol) {
    return null;
  }

  return tokenProtocol.slice(4);
};

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    noServer: true,
    handleProtocols(protocols) {
      if (protocols.has("scrumigo")) {
        return "scrumigo";
      }

      return false;
    },
  });

  server.on("upgrade", (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`)
      .pathname;

    if (pathname !== "/ws") {
      socket.destroy();
      return;
    }

    try {
      const token = getToken(request);

      if (!token) {
        throw new Error("Missing token");
      }

      request.payload = verifyJwt(token);

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } catch (error) {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
    }
  });

  wss.on("connection", (ws, request) => {
    ws.payload = request.payload;

    connectionManager.addClient(ws);

    ws.send(
      JSON.stringify({
        type: "connected",
        payload: {
          userId: request.payload._id,
        },
      }),
    );

    ws.on("close", () => {
      connectionManager.removeClient(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      connectionManager.removeClient(ws);
    });
  });

  return wss;
}
