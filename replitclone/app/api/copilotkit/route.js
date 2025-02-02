import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";

import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_CLOUD_API_KEY });

const copilotKit = new CopilotRuntime({
  async onResponse({ message, context }) {
    try {
      // Extract any file operations from the message and process them
      const fileBlocks = message.content.split("---");
      if (fileBlocks.length > 0) {
        // Format the response to use processFiles action
        return {
          content: `@processFiles(response: \`${message.content}\`)`,
        };
      }
      return message;
    } catch (error) {
      console.error("Error in onResponse:", error);
      return message;
    }
  },
});

const serviceAdapter = new GroqAdapter({
  groq,
  model: "llama-3.3-70b-versatile",
  systemPrompt: `You are an AI-powered code generator integrated into a web-based IDE. Your task is to generate project files and code based on user commands.

When generating files, use this exact format:

FILE: filename.ext
CODE:
[code content here]

For multiple files, separate them with "---".

Example response:
I'll create a React component:

FILE: Button.jsx
CODE:
import React from 'react';

const Button = () => {
  return (
    <button className="btn">Click me</button>
  );
};

export default Button;

Important rules:
- Always include both FILE: and CODE: markers
- Use appropriate file extensions
- Generate complete, working code
- Maintain proper indentation
- Explain what you're creating before showing the files
- Make sure code is syntactically correct`,
});

export const POST = async (req) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
