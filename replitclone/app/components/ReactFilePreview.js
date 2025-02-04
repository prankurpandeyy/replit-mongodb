import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";

const ReactFilePreview = ({ files, currentFile, code }) => {
  const [sandboxFiles, setSandboxFiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentFile) return;

    const newFiles = files.reduce((acc, file) => {
      acc[`/${file.name}`] = { code: file.content };
      return acc;
    }, {});

    const isReactProject = files.some(
      (file) =>
        file.name.endsWith(".jsx") ||
        (file.name.endsWith(".js") && file.content.includes("React"))
    );

    if (isReactProject) {
      // React-specific files
      newFiles["/App.js"] = {
        code: `
          import React from "react";
          function App() { return <h1>Hello, React!</h1>; }
          export default App;
        `,
      };
      newFiles["/index.js"] = {
        code: `
          import React from "react";
          import ReactDOM from "react-dom/client";
          import App from "./App";

          const root = document.getElementById("root");
          if (root) {
            ReactDOM.createRoot(root).render(<App />);
          }
        `,
      };
      newFiles["/index.html"] = {
        code: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>React App</title>
          </head>
          <body>
            <div id="root"></div>
          </body>
          </html>
        `,
      };
      newFiles["/package.json"] = {
        code: JSON.stringify(
          {
            main: "/index.js",
            dependencies: {
              react: "18.2.0",
              "react-dom": "18.2.0",
            },
          },
          null,
          2
        ),
      };
    }

    // Add the current file to the sandbox files
    newFiles[`/${currentFile.name}`] = { code };
    setSandboxFiles(newFiles);
    setLoading(false);
  }, [files, currentFile, code]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      {loading ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : currentFile ? (
        <SandpackProvider
          template="react"
          files={sandboxFiles}
          showCodeEditor={false}
        >
          <SandpackThemeProvider>
            <SandpackLayout>
              <SandpackCodeEditor showTabs={false} />
              <SandpackPreview style={{ height: "600px", border: "none" }} />
            </SandpackLayout>
          </SandpackThemeProvider>
        </SandpackProvider>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          Select a file to preview
        </div>
      )}
    </div>
  );
};

export default ReactFilePreview;
