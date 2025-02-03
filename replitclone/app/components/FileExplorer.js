import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

const FileExplorer = ({ onFileSelect, currentFile }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const [editedFileName, setEditedFileName] = useState("");

  // Fetch files from MongoDB
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

  // New function for file creation
  const createNewFile = async (fileName) => {
    if (!fileName.trim()) return;
    console.log("Creating file with name:", fileName); // Don't allow empty file name
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName, content: "" }),
      });

      if (!response.ok) throw new Error("Failed to create file");

      const newFile = await response.json();
      console.log("New file created:", newFile);
      setFiles((prevFiles) => [...prevFiles, newFile]);
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  // Call the new function when the user clicks "Create"
  // const handleCreateFile = () => {
  //   createNewFile(newFileName); // Handle creation
  //   setNewFileName(""); // Clear the input field after file creation
  // };

  // Delete a file
  const handleDeleteFile = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete file");
      setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  // Start editing file name
  const handleEditStart = (e, file) => {
    e.stopPropagation();
    setEditingFile(file._id);
    setEditedFileName(file.name);
  };

  // Save edited file name
  const handleEditSave = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editedFileName }),
      });
      if (!response.ok) throw new Error("Failed to update file");

      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file._id === id ? { ...file, name: editedFileName } : file
        )
      );
      setEditingFile(null);
    } catch (error) {
      console.error("Error updating file:", error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 p-4 h-full text-white rounded-lg shadow-lg flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <div className="flex justify-center items-center mb-3 gap-2">
        {/* <input
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          placeholder="New file name"
          className="flex-grow p-1 w-40 rounded bg-gray-800 text-white placeholder-gray-400 outline-none border border-gray-700 focus:border-blue-500"
        /> */}
        {/* <button
          onClick={handleCreateFile}
          className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded"
        >
          <Plus size={16} />
        </button> */}
      </div>

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
                currentFile?.name === file.name
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
