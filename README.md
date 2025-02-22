# Replit Clone

A fully functional Replit clone built with Next.js, Monaco Editor, and CodeSandbox Sandpack, featuring real-time code editing, AI-powered code generation via CopilotKit, and seamless MongoDB Atlas integration.

## Features

- Real-time code editing with Monaco Editor
- Live preview using CodeSandbox Sandpack
- AI-powered code generation with CopilotKit
- File management with MongoDB Atlas
- Support for static HTML/CSS/JS and React applications
- Seamless developer experience with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js (without TypeScript, no `/src` folder), Tailwind CSS
- **Editor:** Monaco Editor
- **Live Preview:** CodeSandbox Sandpack
- **AI Code Generation:** CopilotKit
- **Database:** MongoDB Atlas
- **Backend:** Next.js API routes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/replit-clone.git
   cd replit-clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add the following environment variables:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   GROQ_CLOUD_API_KEY=your_groq_cloud_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Note : If anyone wants API_KEYS to build the project you can connect with me here 
- **Prankur Pandey Twitter** - [@prankurpandeyy](https://www.twitter.com/prankurpandeyy/)
- - **Prankur Pandey Twitter** - [@prankurpandeyy](https://www.linkedin.com/in/prankurpandeyy/)

## Usage

- Create and manage code files through the File Explorer.
- Write and edit code in Monaco Editor.
- View live previews of static and React files via Sandpack.
- Generate AI-powered code snippets with CopilotKit.

## API Routes

- `POST /api/files` - Create a new file
- `GET /api/files` - Retrieve all files
- `GET /api/files/:id` - Get a specific file
- `PUT /api/files/:id` - Update a file
- `DELETE /api/files/:id` - Delete a file

## Roadmap

- Implement multi-user collaboration
- Enhance AI capabilities with Groq Cloud
- Add authentication with NextAuth.js

## License

This project is licensed under the MIT License.

## Contributors

- **Prankur Pandey** - [@prankurpandeyy](https://www.freecodecamp.org/news/author/prankurpandeyy/)

