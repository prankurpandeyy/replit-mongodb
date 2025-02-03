import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";

const LivePreview = ({ files, currentFile }) => {
  const [sandboxFiles, setSandboxFiles] = useState({});

  useEffect(() => {
    if (!currentFile) return;

    // Convert file list into a format Sandpack understands
    const newFiles = files.reduce((acc, file) => {
      acc[`/${file.name}`] = { code: file.content };
      return acc;
    }, {});

    setSandboxFiles(newFiles);
  }, [files, currentFile]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      {currentFile ? (
        <SandpackProvider
          template={currentFile.name.endsWith(".jsx") ? "react" : "vanilla"}
          files={sandboxFiles}
          customSetup={{
            dependencies: {
              react: "latest",
              "react-dom": "latest",
            },
          }}
          theme={githubLight}
        >
          <SandpackLayout>
            <SandpackCodeEditor showLineNumbers />
            <SandpackPreview showNavigator />
          </SandpackLayout>
        </SandpackProvider>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a file to preview
        </div>
      )}
    </div>
  );
};

export default LivePreview;
