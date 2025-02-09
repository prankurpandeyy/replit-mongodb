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
// import {
//   CopilotRuntime,
//   GroqAdapter,
//   copilotRuntimeNextJSAppRouterEndpoint,
// } from "@copilotkit/runtime";
// import { NextRequest, NextResponse } from "next/server";
// import Groq from "groq-sdk";

// // Define types for message and context
// interface Message {
//   content: string;
//   role?: string;
//   name?: string;
// }

// interface Context {
//   userId?: string;
//   sessionId?: string;
//   metadata?: Record<string, unknown>;
// }

// interface OnResponseParams {
//   message: Message;
//   context: Context;
// }

// // Environment variable type checking
// const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_CLOUD_API_KEY;

// if (!GROQ_API_KEY) {
//   throw new Error("GROQ_API_KEY is not defined in environment variables");
// }

// const groq = new Groq({ apiKey: GROQ_API_KEY });

// // Helper function to process file blocks
// const processFileBlocks = (message: Message): boolean => {
//   if (!message.content) return false;
//   const fileBlocks = message.content.split("---");
//   return fileBlocks.some(
//     (block) => block.trim().startsWith("FILE:") && block.includes("CODE:")
//   );
// };

// const copilotKit = new CopilotRuntime({
//   async onResponse({ message, context }: OnResponseParams): Promise<Message> {
//     try {
//       if (!message?.content) {
//         throw new Error("Message content is undefined");
//       }

//       // Check if message contains file operations
//       if (processFileBlocks(message)) {
//         return {
//           content: `@processFiles(response: \`${message.content}\`)`,
//           role: message.role,
//         };
//       }

//       return message;
//     } catch (error) {
//       console.error("Error in onResponse:", error);
//       return {
//         content:
//           error instanceof Error ? error.message : "Unknown error occurred",
//         role: "assistant",
//       };
//     }
//   },
// });

// // Define system prompt as a constant
// const SYSTEM_PROMPT = `You are an AI-powered code generator integrated into a web-based IDE. Your task is to generate project files and code based on user commands.

// When generating files, use this exact format:

// FILE: filename.ext
// CODE:
// [code content here]

// For multiple files, separate them with "---".

// Example response:
// I'll create a React component:

// FILE: Button.tsx
// CODE:
// import React from 'react';

// const Button: React.FC = () => {
//   return (
//     <button className="btn">Click me</button>
//   );
// };

// export default Button;

// Important rules:
// - Always include both FILE: and CODE: markers
// - Use appropriate file extensions
// - Generate complete, working code
// - Maintain proper indentation
// - Explain what you're creating before showing the files
// - Make sure code is syntactically correct`;

// interface GroqAdapterParams {
//   groq: Groq;
//   model: string;
//   systemPrompt: string;
// }

// const serviceAdapter = new GroqAdapter({
//   groqClient: groq,
//   model: "llama-3.3-70b-versatile",
//   systemPrompt: SYSTEM_PROMPT,
// } satisfies GroqAdapterParams);

// export const POST = async (req: NextRequest): Promise<NextResponse> => {
//   try {
//     const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
//       runtime: copilotKit,
//       serviceAdapter,
//       endpoint: "/api/copilotkit",
//     });

//     const response = await handleRequest(req);

//     if (!response) {
//       throw new Error("No response received from handler");
//     }

//     return response as NextResponse;
//   } catch (error) {
//     console.error("Error in POST handler:", error);

//     return new NextResponse(
//       JSON.stringify({
//         error: "Internal Server Error",
//         message:
//           error instanceof Error ? error.message : "Unknown error occurred",
//       }),
//       {
//         status: 500,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//   }
// };
