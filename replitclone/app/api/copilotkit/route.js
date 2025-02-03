// import {
//   CopilotRuntime,
//   GroqAdapter,
//   copilotRuntimeNextJSAppRouterEndpoint,
// } from "@copilotkit/runtime";
// import Groq from "groq-sdk";
// import connectDB from "@/app/lib/mongodb";
// import File from "@/app/lib/models/File";
// import { NextResponse } from "next/server";

// // Initialize the Groq API client
// const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_CLOUD_API_KEY });

// // Initialize the CopilotKit runtime
// const copilotKit = new CopilotRuntime({
//   async onResponse({ message, context }) {
//     try {
//       // Split the message content to extract files
//       const fileBlocks = message.content.split("---");
//       const createdFiles = [];

//       // Process each file block
//       for (const block of fileBlocks) {
//         const lines = block.trim().split("\n");
//         if (lines.length < 2) continue; // Skip empty blocks

//         const fileName = lines[0].replace("FILE:", "").trim();
//         const fileContent = lines
//           .slice(1)
//           .join("\n")
//           .replace("CODE:", "")
//           .trim();

//         if (fileName && fileContent) {
//           // Now send the file to the backend to save it in MongoDB
//           await saveFileToDB(fileName, fileContent);
//           createdFiles.push({ name: fileName, content: fileContent });
//         }
//       }

//       // Format the response to use the processFiles action
//       return {
//         content: `@processFiles(response: \`${message.content}\`)`,
//       };
//     } catch (error) {
//       console.error("Error in onResponse:", error);
//       return message;
//     }
//   },
// });

// // Helper function to save file to MongoDB
// const saveFileToDB = async (fileName, fileContent) => {
//   try {
//     // Step 1: Connect to the database
//     await connectDB();

//     // Step 2: Create and save the file in MongoDB
//     const newFile = new File({ name: fileName, content: fileContent });
//     await newFile.save();

//     console.log(`File "${fileName}" saved to database.`);
//   } catch (error) {
//     console.error(
//       `Error saving file "${fileName}" to database:`,
//       error.message
//     );
//   }
// };

// // Initialize the Groq adapter with the system prompt
// const serviceAdapter = new GroqAdapter({
//   groq,
//   model: "llama-3.3-70b-versatile",
//   systemPrompt: `You are an AI-powered code generator integrated into a web-based IDE. Your task is to generate project files and code based on user commands.

// When generating files, use this exact format:

// FILE: filename.ext
// CODE:
// [code content here]

// For multiple files, separate them with "---".

// Example response:
// I'll create a React component:

// FILE: Button.jsx
// CODE:
// import React from 'react';

// const Button = () => {
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
// - Make sure code is syntactically correct
// - After generating the code, make sure to post the file in MongoDB database using the function saveFileToDB`,
// });

// // The main POST handler that interacts with the CopilotKit and service adapter
// export const POST = async (req) => {
//   const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
//     runtime: copilotKit,
//     serviceAdapter,
//     endpoint: "/api/copilotkit",
//   });

//   // Process the incoming request
//   return handleRequest(req);
// };
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
