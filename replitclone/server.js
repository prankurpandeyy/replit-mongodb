"use strict";
// const { createServer } = require("http");
// const { parse } = require("url");
// const next = require("next");
// const { Server } = require("socket.io");
Object.defineProperty(exports, "__esModule", { value: true });
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
var http_1 = require("http");
var url_1 = require("url");
var next_1 = require("next");
var socket_io_1 = require("socket.io");
var dev = process.env.NODE_ENV !== "production";
var app = (0, next_1.default)({ dev: dev });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var httpServer = (0, http_1.createServer)(function (req, res) {
        var parsedUrl = (0, url_1.parse)(req.url || "", true);
        handle(req, res, parsedUrl);
    });
    // Determine the CORS origin dynamically
    var allowedOrigin = dev
        ? "http://localhost:3000" // Local development
        : "*"; // Vercel deployment
    // Initialize Socket.IO with dynamic CORS configuration
    var io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: allowedOrigin,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    // Socket.IO event handlers
    io.on("connection", function (socket) {
        console.log("Client connected");
        // Handle new file creation
        socket.on("new-file", function (newFile) {
            console.log("New file created:", newFile);
            // Broadcast to all clients except sender
            socket.broadcast.emit("new-file", newFile);
        });
        // Handle file deletion
        socket.on("delete-file", function (fileId) {
            console.log("File deleted:", fileId);
            socket.broadcast.emit("delete-file", fileId);
        });
        // Handle file update
        socket.on("update-file", function (updatedFile) {
            console.log("File updated:", updatedFile);
            socket.broadcast.emit("update-file", updatedFile);
        });
        // Handle client disconnect
        socket.on("disconnect", function () {
            console.log("Client disconnected");
        });
    });
    // Start the server on the specified port
    var PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, function () {
        console.log("> Ready on ".concat(dev ? "http://localhost:3000" : allowedOrigin));
    });
});
