// import React, { useEffect, useState } from "react";
// import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

// const LivePreview = ({ files, currentFile, code }) => {
//   const [sandboxFiles, setSandboxFiles] = useState({});

//   useEffect(() => {
//     if (!currentFile) return;

//     // Initialize sandbox files
//     const newFiles = files.reduce((acc, file) => {
//       acc[`/${file.name}`] = { code: file.content };
//       return acc;
//     }, {});

//     const htmlFile = files.find((f) => f.name.endsWith(".html"));
//     if (htmlFile) {
//       let htmlContent = htmlFile.content;

//       // Dynamically link CSS files
//       files
//         .filter((f) => f.name.endsWith(".css"))
//         .forEach((cssFile) => {
//           htmlContent = htmlContent.replace(
//             "</head>",
//             `<link rel="stylesheet" type="text/css" href="${cssFile.name}"></head>`
//           );
//         });

//       // Dynamically link JS files
//       files
//         .filter((f) => f.name.endsWith(".js"))
//         .forEach((jsFile) => {
//           htmlContent = htmlContent.replace(
//             "</body>",
//             `<script src="${jsFile.name}"></script></body>`
//           );
//         });

//       newFiles["/index.html"] = { code: htmlContent };
//     }

//     // Ensure real-time updates from Monaco Editor
//     newFiles[`/${currentFile.name}`] = { code };

//     setSandboxFiles(newFiles);
//   }, [files, currentFile, code]);

//   return (
//     <div className="flex-1 bg-white border-l border-gray-300">
//       {currentFile ? (
//         <SandpackProvider
//           template="static"
//           files={sandboxFiles}
//           options={{
//             visibleFiles: ["/index.html"],
//             activeFile: "/index.html",
//             autoReload: true, // Ensure auto-reload is enabled
//           }}
//         >
//           <SandpackPreview style={{ height: "600px", border: "none" }} />
//         </SandpackProvider>
//       ) : (
//         <div className="h-full flex items-center justify-center text-gray-500">
//           Select a file to preview
//         </div>
//       )}
//     </div>
//   );
// };

// export default LivePreview;
import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";

const LivePreview = ({ files, currentFile, code }) => {
  const [sandboxFiles, setSandboxFiles] = useState({});
  const [template, setTemplate] = useState("vanilla"); // Default to static
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentFile) return;

    const newFiles = files.reduce((acc, file) => {
      acc[`/${file.name}`] = { code: file.content };
      return acc;
    }, {});

    // Check if the project is React
    const isReactProject = files.some(
      (file) =>
        file.name.endsWith(".jsx") ||
        (file.name.endsWith(".js") && file.content.includes("React"))
    );

    if (isReactProject) {
      setTemplate("react");

      // Ensure App.js exists
      if (!newFiles["/App.js"]) {
        newFiles["/App.js"] = {
          code: `
            import React from "react";
            function App() { return <h1>Hello, React!</h1>; }
            export default App;
          `,
        };
      }

      // Ensure index.js exists
      newFiles["/index.js"] = {
        code: `
          import React from "react";
          import ReactDOM from "react-dom/client";
          import App from "./App";

          const root = document.getElementById("root");
          if (root) {
            ReactDOM.createRoot(root).render(<App />);
          } else {
            console.error("Root element not found!");
          }
        `,
      };

      // Ensure index.html exists
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

      // Ensure package.json
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
    } else {
      setTemplate("vanilla");

      const htmlFile = files.find((f) => f.name.endsWith(".html"));
      if (htmlFile) {
        let htmlContent = htmlFile.content;

        // Inject CSS files
        files
          .filter((f) => f.name.endsWith(".css"))
          .forEach((cssFile) => {
            htmlContent = htmlContent.replace(
              "</head>",
              `<link rel="stylesheet" href="${cssFile.name}"></head>`
            );
          });

        // Inject JS files
        files
          .filter((f) => f.name.endsWith(".js"))
          .forEach((jsFile) => {
            htmlContent = htmlContent.replace(
              "</body>",
              `<script src="${jsFile.name}"></script></body>`
            );
          });

        newFiles["/index.html"] = { code: htmlContent };
      }
    }

    // Ensure the current file is included
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
        <SandpackProvider template={template} files={sandboxFiles}>
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

export default LivePreview;
