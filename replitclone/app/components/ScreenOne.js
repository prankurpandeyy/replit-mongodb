import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

const ScreenOne = ({ selectedFile }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  useEffect(() => {
    if (!selectedFile) return;
    console.log("Selected file:", selectedFile);
    setCode(selectedFile.content);
    setLanguage(getLanguageForFile(selectedFile.name));
  }, [selectedFile]);

  const getLanguageForFile = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "py":
        return "python";
      default:
        return "plaintext";
    }
  };

  const handleCodeChange = async (newCode) => {
    setCode(newCode);
    if (!selectedFile) return;

    try {
      await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedFile._id,
          content: newCode,
        }),
      });
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#2d2d2d] text-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Code Editor</h2>
        <div className="text-sm text-gray-400">
          {selectedFile ? selectedFile.name : "No file selected"}
        </div>
      </div>
      <div className="flex-grow bg-gray-800 rounded-lg shadow-inner">
        <Editor
          height="calc(100vh - 160px)" // Adjusted height for the editor
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            lineNumbers: "on",
            wordWrap: "on",
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
};

export default ScreenOne;
// import React, { useEffect, useState } from "react";
// import { Editor } from "@monaco-editor/react";

// const ScreenOne = ({ selectedFile, onCodeChange }) => {
//   const [code, setCode] = useState(selectedFile?.content || "");
//   const [language, setLanguage] = useState("plaintext");

//   useEffect(() => {
//     if (selectedFile) {
//       console.log("Selected file:", selectedFile);
//       setCode(selectedFile.content || "");
//       setLanguage(getLanguageForFile(selectedFile.name));
//     }
//   }, [selectedFile]);

//   const getLanguageForFile = (filename) => {
//     const extension = filename.split(".").pop().toLowerCase();
//     switch (extension) {
//       case "js":
//       case "jsx":
//         return "javascript";
//       case "ts":
//       case "tsx":
//         return "typescript";
//       case "html":
//         return "html";
//       case "css":
//         return "css";
//       case "json":
//         return "json";
//       case "py":
//         return "python";
//       default:
//         return "plaintext";
//     }
//   };

//   const handleCodeChange = (newCode) => {
//     setCode(newCode);
//     if (onCodeChange) {
//       onCodeChange(newCode);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col bg-[#2d2d2d] text-white p-6 rounded-lg shadow-md">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-semibold">Code Editor</h2>
//         <div className="text-sm text-gray-400">
//           {selectedFile ? selectedFile.name : "No file selected"}
//         </div>
//       </div>
//       <div className="flex-grow bg-gray-800 rounded-lg shadow-inner">
//         <Editor
//           height="calc(100vh - 160px)" // Adjusted height for the editor
//           language={language}
//           value={code}
//           onChange={handleCodeChange}
//           theme="vs-dark"
//           options={{
//             minimap: { enabled: false },
//             lineNumbers: "on",
//             wordWrap: "on",
//             scrollBeyondLastLine: false,
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default ScreenOne;
