"use client";
import React, { useState, useEffect } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import ScreenOne from "./components/ScreenOne";
import FileExplorer from "./components/FileExplorer";
import LivePreview from "./components/LivePreview";
import io from "socket.io-client";

function Page() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState("// Select or create a file");
  const [socket, setSocket] = useState(null);
  const [fileContents, setFileContents] = useState({});

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    // Handle real-time file updates
    socketInstance.on("file-update", ({ fileId, content }) => {
      setFileContents((prev) => ({
        ...prev,
        [fileId]: content,
      }));

      if (currentFile && currentFile._id === fileId) {
        setCode(content);
      }
    });

    socketInstance.on("new-file", (newFile) => {
      setFiles((prev) => [...prev, newFile]);
      setFileContents((prev) => ({
        ...prev,
        [newFile._id]: newFile.content,
      }));
    });

    socketInstance.on("delete-file", (fileId) => {
      setFiles((prev) => prev.filter((file) => file._id !== fileId));
      setFileContents((prev) => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useCopilotReadable({
    name: "workspaceState",
    description: "Current state of the workspace",
    value: {
      files: files.map((f) => f.name),
      currentFile: currentFile?.name,
      currentCode: code,
    },
  });

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();

      // Store all file contents in state
      const contents = {};
      data.forEach((file) => {
        contents[file._id] = file.content;
      });

      setFiles(data);
      setFileContents(contents);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileSelect = async (file) => {
    setCurrentFile(file);

    // Use cached content if available
    if (fileContents[file._id]) {
      setCode(fileContents[file._id]);
    } else {
      try {
        const response = await fetch(`/api/files/${file._id}`);
        if (!response.ok) throw new Error("Failed to fetch file content");
        const data = await response.json();

        setFileContents((prev) => ({
          ...prev,
          [file._id]: data.content,
        }));
        setCode(data.content);
      } catch (error) {
        console.error("Error fetching file content:", error);
      }
    }
  };

  const handleCodeChange = async (value) => {
    if (!currentFile) return;

    // Update local state immediately
    setCode(value);
    setFileContents((prev) => ({
      ...prev,
      [currentFile._id]: value,
    }));

    try {
      // Emit the change to other clients
      if (socket) {
        socket.emit("file-update", {
          fileId: currentFile._id,
          content: value,
        });
      }

      // Save to backend
      await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentFile._id, content: value }),
      });
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  const processFiles = async ({ response }) => {
    try {
      const filePattern =
        /FILE:\s*([\w.\-\/]+)\s*\nCODE:\s*([\s\S]*?)(?=\nFILE:|$)/g;
      let match;
      const newFiles = [];

      while ((match = filePattern.exec(response)) !== null) {
        const fileName = match[1].trim();
        const fileContent = match[2].trim();

        if (fileName && fileContent) {
          const res = await fetch("/api/files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: fileName, content: fileContent }),
          });

          if (res.ok) {
            const savedFile = await res.json();
            newFiles.push(savedFile);

            // Update local state
            setFileContents((prev) => ({
              ...prev,
              [savedFile._id]: savedFile.content,
            }));

            // Emit new file to other clients
            if (socket) {
              socket.emit("new-file", savedFile);
            }
          }
        }
      }

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      return `Files saved successfully: ${newFiles
        .map((f) => f.name)
        .join(", ")}`;
    } catch (error) {
      console.error("Error processing files:", error);
      return "Failed to save files.";
    }
  };

  useCopilotAction({
    name: "processFiles",
    description: "Processes AI-generated files and saves them to MongoDB",
    parameters: [{ name: "response", type: "string", required: true }],
    handler: processFiles,
  });

  return (
    <div className="h-screen flex bg-gray-100">
      <FileExplorer
        files={files}
        onFileSelect={handleFileSelect}
        currentFile={currentFile}
      />
      <div className="flex-1 flex flex-col p-4">
        <ScreenOne
          selectedFile={currentFile}
          code={code}
          onChange={handleCodeChange}
        />
      </div>
      <LivePreview
        files={files}
        currentFile={currentFile}
        code={code}
        onCodeChange={handleCodeChange}
      />
      <CopilotPopup
        instructions={`
    You are an AI-powered code generator. Use the following actions:

    1. @processFiles - To create new files, use this format:
    @processFiles(response: \`
    FILE: filename.ext
    CODE:
    [file content]
    \`)

    - Store new files in MongoDB using /api/files.
    - Correctly classify and separate different file types:
      - Static: HTML, CSS, JS
      - React: JSX, JS (React components)
    - For React projects:
      - Ensure the presence of index.js as the entry point.
      - Ensure there is a App.css file for styling
      - Ensure index.html contains a root <div id="root"></div>.
      - Separate components correctly (e.g., App.js, Header.jsx).
      - Include a package.json file with necessary React dependencies.
      - Ensure all React files follow ES6+ syntax and React best practices.

    2. @updateFile - To update existing files:
    @updateFile(filename: "file.ext", content: "new content")

    - Maintain compatibility with React environment.
    - Ensure any updated files do not break existing imports.
  `}
        labels={{
          title: "Project Assistant",
          initial: "What would you like to create?",
        }}
      />
    </div>
  );
}

export default Page;
