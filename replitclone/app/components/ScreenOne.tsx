// import React, { useEffect, useState } from "react";
// import { Editor } from "@monaco-editor/react";

// const ScreenOne = ({ selectedFile, code, onChange }) => {
//   const [language, setLanguage] = useState("javascript");

//   useEffect(() => {
//     if (!selectedFile) return;
//     setLanguage(getLanguageForFile(selectedFile.name));
//   }, [selectedFile]);

//   const getLanguageForFile = (filename) => {
//     const extension = filename.split(".").pop().toLowerCase();
//     switch (extension) {
//       case "js":
//       case "jsx":
//         return "javascript";
//       case "html":
//         return "html";
//       case "css":
//         return "css";
//       case "json":
//         return "json";
//       default:
//         return "plaintext";
//     }
//   };

//   const handleCodeChange = (newCode) => {
//     onChange(newCode); // Call the onChange prop to update the code in LivePreview
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
//           height="calc(100vh - 160px)"
//           language={language}
//           value={code}
//           onChange={handleCodeChange} // Update the code on change
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
import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

interface File {
  name: string;
}

interface ScreenOneProps {
  selectedFile: File | null;
  code: string;
  onChange: (newCode: string | undefined) => void;
}

const ScreenOne: React.FC<ScreenOneProps> = ({ selectedFile, code, onChange }) => {
  const [language, setLanguage] = useState<string>("javascript");

  useEffect(() => {
    if (!selectedFile) return;
    setLanguage(getLanguageForFile(selectedFile.name));
  }, [selectedFile]);

  const getLanguageForFile = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  const handleCodeChange = (newCode: string | undefined): void => {
    onChange(newCode); // Call the onChange prop to update the code in LivePreview
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
          height="calc(100vh - 160px)"
          language={language}
          value={code}
          onChange={handleCodeChange} // Update the code on change
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
