import "./globals.css";
import "@copilotkit/react-ui/styles.css";
import { ReactNode } from "react";
import { CopilotKit } from "@copilotkit/react-core";

export const metadata = {
  title: "Replit Clone",
  description: "Copilotkit Replit Clone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit>
      </body>
    </html>
  );
}
