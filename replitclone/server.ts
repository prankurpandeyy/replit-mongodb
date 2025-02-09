
// const { createServer } = require("http");
// const { parse } = require("url");
// const next = require("next");
// const { Server } = require("socket.io");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const httpServer = createServer((req, res) => {
//     const parsedUrl = parse(req.url, true);
//     handle(req, res, parsedUrl);
//   });

//   // Determine the CORS origin dynamically
//   // const allowedOrigin = dev
//   //   ? "http://localhost:3000" // Local development
//   //   : "https://replit-mongodb.vercel.app"; // Vercel deployment
//   const allowedOrigin = dev
//     ? "http://localhost:3000" // Local development
//     : "*"; // Vercel deployment

//   // Initialize Socket.IO with dynamic CORS configuration
//   const io = new Server(httpServer, {
//     cors: {
//       origin: allowedOrigin,
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//   });

//   // Socket.IO event handlers
//   io.on("connection", (socket) => {
//     console.log("Client connected");

//     // Handle new file creation
//     socket.on("new-file", (newFile) => {
//       console.log("New file created:", newFile);
//       // Broadcast to all clients except sender
//       socket.broadcast.emit("new-file", newFile);
//     });

//     // Handle file deletion
//     socket.on("delete-file", (fileId) => {
//       console.log("File deleted:", fileId);
//       socket.broadcast.emit("delete-file", fileId);
//     });

//     // Handle file update
//     socket.on("update-file", (updatedFile) => {
//       console.log("File updated:", updatedFile);
//       socket.broadcast.emit("update-file", updatedFile);
//     });

//     // Handle client disconnect
//     socket.on("disconnect", () => {
//       console.log("Client disconnected");
//     });
//   });

//   // Start the server on the specified port
//   const PORT = process.env.PORT || 3000;
//   httpServer.listen(PORT, () => {
//     console.log(`> Ready on ${dev ? "http://localhost:3000" : allowedOrigin}`);
//   });
// });
import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse, UrlWithParsedQuery } from "url";
import next from "next";
import { Server, Socket } from "socket.io";

const dev: boolean = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl: UrlWithParsedQuery = parse(req.url || "", true);
    handle(req, res, parsedUrl);
  });

  // Determine the CORS origin dynamically
  const allowedOrigin: string = dev
    ? "http://localhost:3000" // Local development
    : "*"; // Vercel deployment

  // Initialize Socket.IO with dynamic CORS configuration
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigin,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Socket.IO event handlers
  io.on("connection", (socket: Socket) => {
    console.log("Client connected");

    // Handle new file creation
    socket.on("new-file", (newFile: { id: string; name: string; content: string }) => {
      console.log("New file created:", newFile);
      // Broadcast to all clients except sender
      socket.broadcast.emit("new-file", newFile);
    });

    // Handle file deletion
    socket.on("delete-file", (fileId: string) => {
      console.log("File deleted:", fileId);
      socket.broadcast.emit("delete-file", fileId);
    });

    // Handle file update
    socket.on("update-file", (updatedFile: { id: string; name: string; content: string }) => {
      console.log("File updated:", updatedFile);
      socket.broadcast.emit("update-file", updatedFile);
    });

    // Handle client disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Start the server on the specified port
  const PORT: number | string = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on ${dev ? "http://localhost:3000" : allowedOrigin}`);
  });
});
