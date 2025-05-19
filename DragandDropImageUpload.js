import React, { useState } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const ImageUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file =>
      VALID_TYPES.includes(file.type)
    );

    if (validFiles.length === 0) {
      alert("Only jpeg, png, bmp, gif files allowed.");
      return;
    }

    const totalSize = validFiles.reduce((sum, f) => sum + f.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      alert("Total file size exceeds 30MB.");
      return;
    }

    setSelectedFiles(validFiles);
    setPreview(URL.createObjectURL(validFiles[validFiles.length - 1]));
    onFileSelect(validFiles);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (index) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFileSelect(updated);
    if (selectedFiles[index]?.preview === preview && updated.length > 0) {
      setPreview(URL.createObjectURL(updated[updated.length - 1]));
    } else if (updated.length === 0) {
      setPreview(null);
    }
  };

  const handleRemoveAll = () => {
    setSelectedFiles([]);
    setPreview(null);
    onFileSelect([]);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById("fileInput").click()}
        style={{
          border: `2px dashed ${dragActive ? "#007bff" : "#ccc"}`,
          borderRadius: "10px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          background: "#f9f9f9",
        }}
      >
        <input
          type="file"
          id="fileInput"
          accept={VALID_TYPES.join(",")}
          onChange={handleChange}
          style={{ display: "none" }}
          multiple
        />
        <p>Click or drag images here to upload (Max combined 30MB)</p>
      </div>

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}

      {selectedFiles.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <strong>Selected Files:</strong>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                {file.name}
                <button onClick={() => handleRemove(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={handleRemoveAll}>Remove All</button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

// >>>>>>>>>>>>>>>>>>>>>>>>>
  import React, { useState } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const ImageUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file =>
      VALID_TYPES.includes(file.type)
    );

    if (validFiles.length !== newFiles.length) {
      alert("Only JPEG, PNG, BMP, and GIF files are allowed.");
      return;
    }

    const currentSize = files.reduce((sum, f) => sum + f.size, 0);
    const newSize = validFiles.reduce((sum, f) => sum + f.size, 0);

    if (currentSize + newSize > MAX_TOTAL_SIZE) {
      alert("Total file size exceeds 30MB.");
      return;
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    setPreview(URL.createObjectURL(validFiles[validFiles.length - 1]));

    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);

    if (preview === URL.createObjectURL(files[index])) {
      setPreview(updatedFiles.length > 0 ? URL.createObjectURL(updatedFiles[updatedFiles.length - 1]) : null);
    }

    if (onFileSelect) {
      onFileSelect(updatedFiles);
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setPreview(null);
    if (onFileSelect) {
      onFileSelect([]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("fileInput").click()}
      style={{
        border: `2px dashed ${dragActive ? "#007bff" : "#ccc"}`,
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        background: "#f9f9f9",
        position: "relative"
      }}
    >
      <input
        type="file"
        id="fileInput"
        accept={VALID_TYPES.join(",")}
        onChange={handleChange}
        multiple
        style={{ display: "none" }}
      />
      <p>Click or drag images here to upload (max total 30MB)</p>

      {preview && (
        <div style={{ marginTop: "15px" }}>
          <h4>Last Uploaded Preview:</h4>
          <img
            src={preview}
            alt="Last Preview"
            style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "5px", border: "1px solid #ddd" }}
          />
        </div>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h4>Uploaded Files:</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {files.map((file, index) => (
              <li key={index} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#f0f0f0",
                padding: "5px 10px",
                marginBottom: "5px",
                borderRadius: "5px"
              }}>
                <span>{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  style={{
                    background: "transparent",
                    color: "red",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClearAll();
            }}
            style={{
              marginTop: "10px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Remove All
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
