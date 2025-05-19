import React, { useState, useCallback, useEffect } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export default function FileUploader({ onFilesChange }) {
  const [files, setFiles] = useState([]);
  const [lastPreview, setLastPreview] = useState(null);
  const [error, setError] = useState("");

  const isValidType = (file) => ALLOWED_TYPES.includes(file.type);

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(isValidType);

    if (validFiles.length !== newFiles.length) {
      setError("Only JPEG, PNG, and JPG files are allowed.");
      return;
    }

    const totalSize =
      validFiles.reduce((sum, f) => sum + f.size, 0) +
      files.reduce((sum, f) => sum + f.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      setError("Combined file size exceeds 30MB.");
      return;
    }

    const filesWithPreview = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedFiles = [...files, ...filesWithPreview];
    setFiles(updatedFiles);
    setLastPreview(filesWithPreview[filesWithPreview.length - 1].preview);
    setError("");

    // Call parent callback with raw file objects
    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    handleFiles(selected);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files);
      handleFiles(dropped);
    },
    [files]
  );

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Upload Image Files</h2>

      <input
        type="file"
        accept=".jpeg,.jpg,.png"
        multiple
        onChange={handleChange}
        className="mb-4"
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="p-6 border-2 border-dashed text-center text-gray-500"
      >
        Drag & Drop files here
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {lastPreview && (
        <div className="mt-4">
          <h3 className="font-medium">Last Uploaded Preview:</h3>
          <img
            src={lastPreview}
            alt="Last preview"
            className="mt-2 max-h-60 w-full object-contain border"
          />
        </div>
      )}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, idx) => (
            <li key={idx} className="bg-gray-100 p-2 rounded">
              {f.file.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
