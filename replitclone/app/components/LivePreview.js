
// import React, { useEffect, useState } from "react";
// import { SandpackProvider, SandpackPreview } from "@codesandbox/sandpack-react";

// const LivePreview = ({ files, currentFile, code }) => {
//   const [sandboxFiles, setSandboxFiles] = useState({});
//   console.log("🚀 ~ LivePreview ~ files:", files);
//   console.log("🚀 ~ LivePreview ~ currentFile:", currentFile);

//   useEffect(() => {
//     if (!currentFile) return;

//     // Initialize sandbox files
//     const newFiles = files.reduce((acc, file) => {
//       console.log(`Adding file to sandbox: ${file.name}`);
//       acc[`/${file.name}`] = { code: file.content };
//       return acc;
//     }, {});

//     const htmlFile = files.find((f) => f.name.endsWith(".html"));
//     if (htmlFile) {
//       let htmlContent = htmlFile.content;

//       // 🔗 Dynamically link CSS files
//       files
//         .filter((f) => f.name.endsWith(".css"))
//         .forEach((cssFile) => {
//           htmlContent = htmlContent.replace(
//             "</head>",
//             `<link rel="stylesheet" type="text/css" href="${cssFile.name}"></head>`
//           );
//         });

//       // 🔗 Dynamically link JS files
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

//     // ✅ Ensure real-time updates from Monaco Editor
//     newFiles[`/${currentFile.name}`] = { code };

//     setSandboxFiles(newFiles);
//     console.log("Updated sandbox files:", newFiles);
//   }, [files, currentFile, code]);

//   return (
//     <div className="flex-1 bg-white border-l border-gray-300">
//       {currentFile ? (
//         <SandpackProvider
//           template="static"
//           files={sandboxFiles}
//           key={JSON.stringify(sandboxFiles)}
//           options={{
//             visibleFiles: ["/index.html"],
//             activeFile: "/index.html",
//             autoReload: true, // Try disabling autoReload first
//             wrapContent: true, // default - false
//             editorHeight: 500, // default - 300
//             editorWidthPercentage: 60, // default - 50
//           }}
//         >
//           <SandpackPreview style={{ height: "100%", border: "none" }} />
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

      // Dynamically link CSS files
      files
        .filter((f) => f.name.endsWith(".css"))
        .forEach((cssFile) => {
          htmlContent = htmlContent.replace(
            "</head>",
            `<link rel="stylesheet" type="text/css" href="${cssFile.name}"></head>`
          );
        });

      // Dynamically link JS files
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

    // Ensure real-time updates from Monaco Editor
    newFiles[`/${currentFile.name}`] = { code };

    setSandboxFiles(newFiles);
  }, [files, currentFile, code]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      {currentFile ? (
        <SandpackProvider
          template="static"
          files={sandboxFiles}
          options={{
            visibleFiles: ["/index.html"],
            activeFile: "/index.html",
            autoReload: true, // Ensure auto-reload is enabled
          }}
        >
          <SandpackPreview style={{ height: "100%", border: "none" }} />
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