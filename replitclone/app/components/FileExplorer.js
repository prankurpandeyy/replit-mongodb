import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import io from "socket.io-client";

const FileExplorer = ({ onFileSelect, currentFile }) => {
  const [files, setFiles] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [editedFileName, setEditedFileName] = useState("");

  // Initialize socket connection

  useEffect(() => {
    // Connect to the Socket.IO server running on the same port as Next.js
    const socketInstance = io("http://localhost:3000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socketInstance.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for real-time updates
    socket.on("new-file", (newFile) => {
      setFiles((prevFiles) => {
        if (!prevFiles.some((file) => file._id === newFile._id)) {
          return [...prevFiles, newFile];
        }
        return prevFiles;
      });
    });

    socket.on("delete-file", (fileId) => {
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
    });

    socket.on("update-file", (updatedFile) => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === updatedFile._id
            ? { ...file, name: updatedFile.name }
            : file
        )
      );
    });

    return () => {
      socket.off("new-file");
      socket.off("delete-file");
      socket.off("update-file");
    };
  }, [socket]);

  // Fetch initial files
  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Create new file
  const createNewFile = async () => {
    if (!newFileName.trim()) return;
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFileName }),
      });

      if (!response.ok) throw new Error("Failed to create file");

      const newFile = await response.json();
      socket.emit("new-file", newFile);
      setNewFileName("");
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  const handleDeleteFile = async (e, id) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id)); // Optimistic update

    try {
      const response = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete file");

      socket.emit("delete-file", id);
    } catch (error) {
      console.error("Error deleting file:", error);
      // Revert state if API call fails
      await fetchFiles();
    }
  };

  // Start editing file name
  const handleEditStart = (e, file) => {
    e.stopPropagation();
    setEditingFile(file._id);
    setEditedFileName(file.name);
  };

  const handleEditSave = async (e, id) => {
    e.stopPropagation();
    if (!editedFileName.trim()) return;

    const previousFiles = [...files];
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file._id === id ? { ...file, name: editedFileName } : file
      )
    ); // Optimistic update

    try {
      const response = await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editedFileName }),
      });

      if (!response.ok) throw new Error("Failed to update file");

      const updatedFile = await response.json();
      socket.emit("update-file", updatedFile);
      setEditingFile(null);
    } catch (error) {
      console.error("Error updating file:", error);
      setFiles(previousFiles); // Revert state if API call fails
    }
  };

  return (
    <div className="w-64 bg-gray-900 p-4 h-full text-white rounded-lg shadow-lg flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Files</h2>

      {/* <div className="flex justify-center items-center mb-3 gap-2">
        <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file name"
          className="flex-grow p-1 w-40 rounded bg-gray-800 text-white placeholder-gray-400 outline-none border border-gray-700 focus:border-blue-500"
        />
        <button
          onClick={createNewFile}
          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
        >
          <Plus size={16} />
        </button>
      </div> */}

      {loading ? (
        <div className="text-gray-400 text-sm">Loading files...</div>
      ) : error ? (
        <div className="text-red-500 text-sm">{error}</div>
      ) : files.length === 0 ? (
        <div className="text-gray-400 text-sm">No files yet</div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-grow">
          {files.map((file) => (
            <div
              key={file._id || file.name}
              className={`cursor-pointer flex justify-between items-center p-2 rounded text-white transition-all duration-200 ${
                currentFile?._id === file._id
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => onFileSelect(file)}
            >
              {editingFile === file._id ? (
                <input
                  type="text"
                  value={editedFileName}
                  onChange={(e) => setEditedFileName(e.target.value)}
                  onBlur={(e) => handleEditSave(e, file._id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleEditSave(e, file._id) : null
                  }
                  autoFocus
                  className="bg-gray-800 text-white p-1 rounded outline-none w-32"
                />
              ) : (
                <span className="truncate flex-grow">📄 {file.name}</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleEditStart(e, file)}
                  className="text-yellow-400 hover:text-yellow-600 p-1 rounded"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => handleDeleteFile(e, file._id)}
                  className="text-red-400 hover:text-red-600 p-1 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
