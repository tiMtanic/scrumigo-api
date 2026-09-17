import WebSocket from "ws";

class ConnectionManager {
  constructor() {
    this.clients = new Set();
  }

  addClient(ws) {
    this.clients.add(ws);
    console.log(`Client added. Total clients: ${this.clients.size}`);
  }

  removeClient(ws) {
    this.clients.delete(ws);
    console.log(`Client removed. Total clients: ${this.clients.size}`);
  }

  broadcast(event) {
    const message = typeof event === "string" ? event : JSON.stringify(event);

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (error) {
          console.error("Error broadcasting to client:", error);
          this.removeClient(client);
        }
      }
    });
  }

  getClientCount() {
    return this.clients.size;
  }
}

export const connectionManager = new ConnectionManager();
