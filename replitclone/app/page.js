// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   CopilotKit,
//   useCopilotAction,
//   useCopilotReadable,
// } from "@copilotkit/react-core";
// import { CopilotPopup } from "@copilotkit/react-ui";
// import ScreenOne from "./components/ScreenOne";
// import FileExplorer from "./components/FileExplorer";

// function Page() {
//   const [files, setFiles] = useState([]);
//   const [currentFile, setCurrentFile] = useState(null);

//   // Sync the workspace state with CopilotKit
//   useCopilotReadable({
//     name: "workspaceState",
//     description: "Current state of the workspace",
//     value: {
//       files: files.map((f) => f.name),
//       currentFile: currentFile?.name,
//       currentCode: currentFile?.content || "",
//     },
//   });

//   // Fetch files from MongoDB
//   const fetchFiles = async () => {
//     try {
//       const response = await fetch("/api/files");
//       if (!response.ok) throw new Error("Failed to fetch files");
//       const data = await response.json();
//       setFiles(data);
//     } catch (error) {
//       console.error("Error fetching files:", error);
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   // Handle file selection
//   const handleFileSelect = (file) => {
//     console.log("🚀 ~ handleFileSelect ~ file:", file);
//     setCurrentFile(file);
//   };

//   // Handle code changes
//   const handleCodeChange = async (newContent) => {
//     if (!currentFile) return;

//     setCurrentFile((prev) => ({ ...prev, content: newContent }));

//     try {
//       await fetch("/api/files", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id: currentFile._id, content: newContent }),
//       });
//     } catch (error) {
//       console.error("Error updating file:", error);
//     }
//   };

//   // Create a new file
//   const handleCreateFile = async (filename) => {
//     try {
//       const response = await fetch("/api/files", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: filename, content: "" }),
//       });

//       if (!response.ok) throw new Error("Failed to create file");

//       const newFile = await response.json();
//       setFiles((prev) => [...prev, newFile]);
//     } catch (error) {
//       console.error("Error creating file:", error);
//     }
//   };

//   // Delete a file
//   const handleDeleteFile = async (id) => {
//     try {
//       const response = await fetch("/api/files", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       if (!response.ok) throw new Error("Failed to delete file");

//       setFiles((prev) => prev.filter((file) => file._id !== id));
//       if (currentFile?._id === id) {
//         setCurrentFile(null);
//       }
//     } catch (error) {
//       console.error("Error deleting file:", error);
//     }
//   };

//   return (
//     <div className="h-screen flex bg-gray-100">
//       <FileExplorer onFileSelect={handleFileSelect} currentFile={currentFile} />
//       <div className="flex-1 flex flex-col p-4">
//         <ScreenOne selectedFile={currentFile} onCodeChange={handleCodeChange} />
//       </div>
//       {/* <CopilotPopup
//         instructions={`
//           You are an AI-powered code generator. Use the following actions:

//           1. @processFiles - To create new files, use this format:
//           @processFiles(response: \`
//           FILE: filename.ext
//           CODE:
//           [code content here]

//           ---

//           FILE: another.ext
//           CODE:
//           [more code here]
//           \`)

//           2. @updateFile - To update existing files:
//           @updateFile(filename: "file.ext", content: "new content")

//           You can see the current workspace state in the context.
//           Always use these actions to create or modify files.
//         `}
//         labels={{
//           title: "Project Assistant",
//           initial: "What would you like to create?",
//         }}
//       /> */}
//       <CopilotPopup
//         instructions={`
//     You are an AI-powered code generator. Use the following actions:

//     1. @processFiles - To create new files, use this format:
//     @processFiles(response: \`
//     FILE: filename.ext
//     CODE:
//     [code content here]

//     ---

//     FILE: another.ext
//     CODE:
//     [more code here]
//     \`)

//     After generating files, send them to the backend using:
//     fetch("/api/files", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name: "filename.ext", content: "[file content]" })
//     });

//     2. @updateFile - To update existing files:
//     @updateFile(filename: "file.ext", content: "new content")

//     Always store new files in MongoDB.
//   `}
//         labels={{
//           title: "Project Assistant",
//           initial: "What would you like to create?",
//         }}
//       />
//     </div>
//   );
// }

// export default Page;
"use client";
import React, { useState, useEffect } from "react";
import {
  CopilotKit,
  useCopilotAction,
  useCopilotReadable,
} from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import ScreenOne from "./components/ScreenOne";
import FileExplorer from "./components/FileExplorer";

function Page() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [code, setCode] = useState("// Select or create a file");

  // Sync the workspace state with CopilotKit
  useCopilotReadable({
    name: "workspaceState",
    description: "Current state of the workspace",
    value: {
      files: files.map((f) => f.name),
      currentFile: currentFile?.name,
      currentCode: code,
    },
  });

  // Fetch files from MongoDB
  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file selection
  const handleFileSelect = (file) => {
    setCurrentFile(file);
    setCode(file.content);
  };

  // Handle code changes
  const handleCodeChange = async (value) => {
    setCode(value);
    if (currentFile) {
      try {
        await fetch("/api/files", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentFile._id, content: value }),
        });
      } catch (error) {
        console.error("Error updating file:", error);
      }
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      <FileExplorer files={files} onFileSelect={handleFileSelect} />
      <div className="flex-1 flex flex-col p-4">
        <ScreenOne
          selectedFile={currentFile}
          code={code}
          onChange={handleCodeChange}
        />
      </div>
      <CopilotPopup
        instructions={`
          You are an AI-powered code generator. Use the following actions:
          
          1. @processFiles - To create new files, use this format:
          @processFiles(response: \`
          FILE: filename.ext
          CODE:
          [file content]
          \`)

          After generating files, send them to the backend:
          fetch("/api/files", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "filename.ext", content: "[file content]" })
          });

          2. @updateFile - To update existing files:
          @updateFile(filename: "file.ext", content: "new content")

          Always store new files in MongoDB.
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
