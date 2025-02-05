const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO with CORS configuration
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.IO event handlers
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("new-file", (newFile) => {
      console.log("New file created:", newFile);
      // Broadcast to all clients except sender
      socket.broadcast.emit("new-file", newFile);
    });

    socket.on("delete-file", (fileId) => {
      console.log("File deleted:", fileId);
      socket.broadcast.emit("delete-file", fileId);
    });

    socket.on("update-file", (updatedFile) => {
      console.log("File updated:", updatedFile);
      socket.broadcast.emit("update-file", updatedFile);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
