import React, { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  SandpackThemeProvider,
} from "@codesandbox/sandpack-react";

const StaticFilePreview = ({ files }) => {
  const [sandboxFiles, setSandboxFiles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!files || files.length === 0) return;

    const newFiles = files.reduce((acc, file) => {
      acc[`/${file.name}`] = { code: file.content };
      return acc;
    }, {});

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

    setSandboxFiles(newFiles);
    setLoading(false);
  }, [files]);

  return (
    <div className="flex-1 bg-white border-l border-gray-300">
      {loading ? (
        <div className="h-full flex items-center justify-center text-gray-500">
          Loading...
        </div>
      ) : (
        <SandpackProvider
          template="vanilla"
          files={sandboxFiles}
          showCodeEditor={false}
        >
          <SandpackThemeProvider>
            <SandpackLayout>
              <SandpackPreview style={{ height: "600px", border: "none" }} />
            </SandpackLayout>
          </SandpackThemeProvider>
        </SandpackProvider>
      )}
    </div>
  );
};

export default StaticFilePreview;
