// import React, { useEffect, useState } from "react";
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackCodeEditor,
//   SandpackPreview,
// } from "@codesandbox/sandpack-react";
// import { githubLight } from "@codesandbox/sandpack-themes";

// const LivePreview = ({ files, currentFile }) => {
//   const [sandboxFiles, setSandboxFiles] = useState({});

//   useEffect(() => {
//     if (!currentFile) return;

//     const newFiles = files.reduce((acc, file) => {
//       acc[`/${file.name}`] = { code: file.content };
//       return acc;
//     }, {});

//     // 🔥 Handle Static HTML, CSS, and JS Projects
//     const htmlFile = files.find((f) => f.name.endsWith(".html"));
//     if (htmlFile) {
//       let htmlContent = htmlFile.content;

//       // Inject CSS files dynamically
//       const cssFiles = files.filter((f) => f.name.endsWith(".css"));
//       cssFiles.forEach((cssFile) => {
//         htmlContent = htmlContent.replace(
//           "</head>",
//           `<link rel="stylesheet" type="text/css" href="${cssFile.name}"></head>`
//         );
//       });

//       // Inject JS files dynamically
//       const jsFiles = files.filter((f) => f.name.endsWith(".js"));
//       jsFiles.forEach((jsFile) => {
//         htmlContent = htmlContent.replace(
//           "</body>",
//           `<script src="${jsFile.name}"></script></body>`
//         );
//       });

//       newFiles[`/${htmlFile.name}`] = { code: htmlContent };

//       // 🔥 Sandpack needs an entry file for execution (index.html)
//       if (!newFiles["/index.html"]) {
//         newFiles["/index.html"] = { code: htmlContent };
//       }
//     }

//     // 🔥 Fix: Only add index.js if the project has JavaScript
//     const hasJS = files.some((f) => f.name.endsWith(".js"));
//     if (hasJS && !newFiles["/index.js"]) {
//       newFiles["/index.js"] = {
//         code: `
//           document.addEventListener("DOMContentLoaded", function() {
//             const app = document.getElementById("app");
//             if (app) {
//               app.innerHTML = "<h1>Hello world</h1>";
//             }
//           });
//         `,
//       };
//     }

//     setSandboxFiles(newFiles);
//   }, [files, currentFile]);

//   return (
//     <div className="flex-1 bg-white border-l border-gray-300">
//       {currentFile ? (
//         <SandpackProvider
//           template={currentFile.name.endsWith(".jsx") ? "react" : "vanilla"}
//           files={sandboxFiles}
//           customSetup={{
//             dependencies: {
//               react: "latest",
//               "react-dom": "latest",
//             },
//           }}
//           theme={githubLight}
//         >
//           <SandpackLayout>
//             <SandpackCodeEditor showLineNumbers />
//             <SandpackPreview showNavigator />
//           </SandpackLayout>
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
// import React, { useEffect, useState } from "react";
// import {
//   SandpackProvider,
//   SandpackLayout,
//   SandpackCodeEditor,
//   SandpackPreview,
// } from "@codesandbox/sandpack-react";
// import { githubLight } from "@codesandbox/sandpack-themes";

// const LivePreview = ({ files, currentFile }) => {
//   const [sandboxFiles, setSandboxFiles] = useState({});

//   useEffect(() => {
//     if (!currentFile) return;

//     const newFiles = files.reduce((acc, file) => {
//       acc[`/${file.name}`] = { code: file.content };
//       return acc;
//     }, {});

//     const htmlFile = files.find((f) => f.name.endsWith(".html"));
//     if (htmlFile) {
//       let htmlContent = htmlFile.content;

//       // Inject linked CSS files dynamically
//       const cssFiles = files.filter((f) => f.name.endsWith(".css"));
//       cssFiles.forEach((cssFile) => {
//         htmlContent = htmlContent.replace(
//           "</head>",
//           `<link rel="stylesheet" type="text/css" href="${cssFile.name}"></head>`
//         );
//       });

//       // Inject linked JS files dynamically
//       const jsFiles = files.filter((f) => f.name.endsWith(".js"));
//       jsFiles.forEach((jsFile) => {
//         htmlContent = htmlContent.replace(
//           "</body>",
//           `<script src="${jsFile.name}"></script></body>`
//         );
//       });

//       // Ensure Sandpack recognizes index.html as the entry point
//       newFiles["/index.html"] = { code: htmlContent };
//     }

//     // 🔥 Ensure scripts run inside HTML, prevent 'innerHTML' errors
//     if (!newFiles["/index.js"]) {
//       newFiles["/index.js"] = {
//         code: `
//           document.addEventListener("DOMContentLoaded", function() {
//             console.log("JavaScript is running!");
//           });
//         `,
//       };
//     }

//     setSandboxFiles(newFiles);
//   }, [files, currentFile]);

//   return (
//     <div className="flex-1 bg-white border-l border-gray-300">
//       {currentFile ? (
//         <SandpackProvider
//           template="vanilla"
//           files={sandboxFiles}
//           options={{ visibleFiles: ["/index.html"] }}
//           theme={githubLight}
//         >
//           <SandpackLayout>
//             <SandpackCodeEditor showLineNumbers />
//             <SandpackPreview showNavigator />
//           </SandpackLayout>
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
} from "@codesandbox/sandpack-react";
import { githubLight } from "@codesandbox/sandpack-themes";

const LivePreview = ({ files, currentFile, code, onCodeChange }) => {
  const [sandboxFiles, setSandboxFiles] = useState({});

  useEffect(() => {
    if (!currentFile) return;

    // Initialize sandbox files
    const newFiles = files.reduce((acc, file) => {
      acc[`/${file.name}`] = { code: file.content };
      return acc;
    }, {});

    const htmlFile = files.find((f) => f.name.endsWith(".html"));
    if (htmlFile) {
      let htmlContent = htmlFile.content;

      // 🔗 Dynamically link CSS files inside <head>
      const cssFiles = files.filter((f) => f.name.endsWith(".css"));
      cssFiles.forEach((cssFile) => {
        htmlContent = htmlContent.replace(
          "</head>",
          `<link rel="stylesheet" type="text/css" href="${cssFile.name}"></head>`
        );
      });

      // 🔗 Dynamically link JS files inside <body>
      const jsFiles = files.filter((f) => f.name.endsWith(".js"));
      jsFiles.forEach((jsFile) => {
        htmlContent = htmlContent.replace(
          "</body>",
          `<script src="${jsFile.name}"></script></body>`
        );
      });

      // Ensure Sandpack uses index.html as entry point
      newFiles["/index.html"] = { code: htmlContent };
    }

    // Ensure real-time updates from Monaco Editor
    if (currentFile.name in newFiles) {
      newFiles[`/${currentFile.name}`] = { code };
    }

    setSandboxFiles(newFiles);
  }, [files, currentFile, code]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      {currentFile ? (
        <SandpackProvider
          template="vanilla"
          files={sandboxFiles}
          options={{
            visibleFiles: ["/index.html"],
            activeFile: `/${currentFile.name}`,
            autoReload: true,
          }}
          theme={githubLight}
        >
          <SandpackLayout>
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
