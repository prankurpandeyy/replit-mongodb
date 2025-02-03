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
//   const [code, setCode] = useState("// Select or create a file");

//   // Sync the workspace state with CopilotKit
//   useCopilotReadable({
//     name: "workspaceState",
//     description: "Current state of the workspace",
//     value: {
//       files: files.map((f) => f.name),
//       currentFile: currentFile?.name,
//       currentCode: code,
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
//     setCurrentFile(file);
//     setCode(file.content);
//   };

//   // Handle code changes
//   const handleCodeChange = async (value) => {
//     setCode(value);
//     if (currentFile) {
//       try {
//         await fetch("/api/files", {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ id: currentFile._id, content: value }),
//         });
//       } catch (error) {
//         console.error("Error updating file:", error);
//       }
//     }
//   };

//   // 🔥 New feature: Process chatbot-generated files and store them in MongoDB
//   useCopilotAction({
//     name: "processFiles",
//     description: "Processes AI-generated files and saves them to MongoDB",
//     parameters: [{ name: "response", type: "string", required: true }],
//     handler: async ({ response }) => {
//       try {
//         const fileBlocks = response.split("---"); // Splitting multiple files
//         const newFiles = [];

//         for (const block of fileBlocks) {
//           const lines = block.trim().split("\n");
//           if (lines.length < 2) continue; // Skip invalid blocks

//           const fileName = lines[0].replace("FILE:", "").trim();
//           const fileContent = lines
//             .slice(1)
//             .join("\n")
//             .replace("CODE:", "")
//             .trim();

//           if (fileName && fileContent) {
//             // Save to MongoDB
//             const res = await fetch("/api/files", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ name: fileName, content: fileContent }),
//             });

//             if (res.ok) {
//               const savedFile = await res.json();
//               newFiles.push(savedFile);
//             }
//           }
//         }

//         // Update state to reflect new files
//         setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//         return `Files saved successfully: ${newFiles
//           .map((f) => f.name)
//           .join(", ")}`;
//       } catch (error) {
//         console.error("Error processing files:", error);
//         return "Failed to save files.";
//       }
//     },
//   });

//   return (
//     <div className="h-screen flex bg-gray-100">
//       <FileExplorer files={files} onFileSelect={handleFileSelect} />
//       <div className="flex-1 flex flex-col p-4">
//         <ScreenOne
//           selectedFile={currentFile}
//           code={code}
//           onChange={handleCodeChange}
//         />
//       </div>
//       <CopilotPopup
//         instructions={`
//     You are an AI-powered code generator. Use the following actions:

//     1. @processFiles - To create new files, use this format:
//     @processFiles(response: \`
//     FILE: filename.ext
//     CODE:
//     [file content]
//     \`)

//     After generating files, send them to the backend:

//     - Store new files in api/files. Always provide the file name and content.
//     - If updating, use @updateFile(filename: "file.ext", content: "new content").
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

  // Sync workspace state with CopilotKit
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

  // 🔥 Improved AI-generated file processing (Handles React & Separates CSS)
  useCopilotAction({
    name: "processFiles",
    description: "Processes AI-generated files and saves them to MongoDB",
    parameters: [{ name: "response", type: "string", required: true }],
    handler: async ({ response }) => {
      try {
        // 🔍 Regex to extract multiple files correctly
        const filePattern =
          /FILE:\s*([\w.\-\/]+)\s*\nCODE:\s*([\s\S]*?)(?=\nFILE:|$)/g;
        let match;
        const newFiles = [];

        while ((match = filePattern.exec(response)) !== null) {
          const fileName = match[1].trim();
          const fileContent = match[2].trim();

          if (fileName && fileContent) {
            // Save to MongoDB
            const res = await fetch("/api/files", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: fileName, content: fileContent }),
            });

            if (res.ok) {
              const savedFile = await res.json();
              newFiles.push(savedFile);
            }
          }
        }

        // Update state to reflect new files
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);

        return `Files saved successfully: ${newFiles
          .map((f) => f.name)
          .join(", ")}`;
      } catch (error) {
        console.error("Error processing files:", error);
        return "Failed to save files.";
      }
    },
  });

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

    - Store new files in MongoDB using /api/files
    - Separate HTML, CSS, and React files correctly
    - If updating, use @updateFile(filename: "file.ext", content: "new content").
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
