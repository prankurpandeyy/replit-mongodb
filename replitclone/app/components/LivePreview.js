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
import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

const LivePreview = ({ files, currentFile, code }) => {
  const [sandboxFiles, setSandboxFiles] = useState({});
  const [template, setTemplate] = useState("static");

  useEffect(() => {
    if (!currentFile) return;

    const newFiles = files.reduce((acc, file) => {
      acc[`/${file.name}`] = { code: file.content };
      return acc;
    }, {});

    // Detect if it's a React project
    const isReactProject = files.some(
      (file) => file.name.endsWith(".jsx") || file.name.endsWith(".js")
    );

    if (isReactProject) {
      setTemplate("react");

      // Ensure index.js exists (React entry point)
      if (!newFiles["/index.js"]) {
        newFiles["/index.js"] = {
          code: `
            import React from "react";
            import ReactDOM from "react-dom";
            import App from "./App";

            ReactDOM.createRoot(document.getElementById("root")).render(<App />);
          `,
        };
      }

      // Ensure index.html exists (React root element)
      if (!newFiles["/index.html"]) {
        newFiles["/index.html"] = {
          code: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>React App</title>
            </head>
            <body>
              <div id="root"></div>
              <script src="index.js"></script>
            </body>
            </html>
          `,
        };
      }

      // Ensure package.json includes React dependencies
      if (!newFiles["/package.json"]) {
        newFiles["/package.json"] = {
          code: JSON.stringify(
            {
              main: "index.js",
              dependencies: {
                react: "latest",
                "react-dom": "latest",
              },
            },
            null,
            2
          ),
        };
      }
    } else {
      setTemplate("static");

      // Handle static HTML/CSS/JS files
      const htmlFile = files.find((f) => f.name.endsWith(".html"));
      if (htmlFile) {
        let htmlContent = htmlFile.content;

        // Link CSS files
        files
          .filter((f) => f.name.endsWith(".css"))
          .forEach((cssFile) => {
            htmlContent = htmlContent.replace(
              "</head>",
              `<link rel="stylesheet" href="${cssFile.name}"></head>`
            );
          });

        // Link JS files
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

    // Sync real-time Monaco updates
    newFiles[`/${currentFile.name}`] = { code };

    setSandboxFiles(newFiles);
  }, [files, currentFile, code]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      {currentFile ? (
        <SandpackProvider
          template={template}
          files={sandboxFiles}
          options={{
            visibleFiles: ["/index.html"],
            activeFile: "/index.html",
            autoReload: true,
          }}
        >
          <SandpackPreview style={{ height: "600px", border: "none" }} />
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

