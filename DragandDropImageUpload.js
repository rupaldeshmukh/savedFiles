import React, { useState } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const ImageUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [files, setFiles] = useState([]);

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
      alert("Total file size exceeds 30MB limit.");
      return;
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    setPreview(URL.createObjectURL(validFiles[validFiles.length - 1]));

    if (onFileSelect) {
      onFileSelect(updatedFiles); // pass raw files to parent
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
        <img
          src={preview}
          alt="Last Uploaded Preview"
          style={{ maxWidth: "100%", marginTop: "10px", maxHeight: "200px" }}
        />
      )}

      {files.length > 0 && (
        <ul style={{ marginTop: "10px", textAlign: "left" }}>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImageUploader;


//

import React, { useState } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const ImageUploader = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!VALID_TYPES.includes(file.type)) {
      alert("Invalid file type. Allowed: jpeg, png, bmp, gif.");
      return;
    }

    if (file.size > MAX_TOTAL_SIZE) {
      alert("File is too large. Max size: 30MB");
      return;
    }

    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleChange = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
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
      }}
    >
      <input
        type="file"
        id="fileInput"
        accept={VALID_TYPES.join(",")}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      <p>Click or drag an image here to upload (max 30MB)</p>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
      )}
    </div>
  );
};

export default ImageUploader;


_______________________________________
import React, { useState } from "react";
import ImageUploader from "./ImageUploader";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file) => {
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.file) {
      alert("All fields including file are required.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("file", formData.file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: payload,
      });

      if (response.ok) {
        alert("Upload successful!");
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Upload error.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <h2>Image Upload Form</h2>

      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleInputChange}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleInputChange}
        rows={4}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <ImageUploader onFileSelect={handleFileSelect} />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Upload
      </button>
    </div>
  );
};

export default App;

______________________________

const handleSubmit = async () => {
  if (!formData.name || !formData.description || !formData.file) {
    alert("All fields including file are required.");
    return;
  }

  const payload = new FormData();
  payload.append("name", formData.name);
  payload.append("description", formData.description);
  payload.append("file", formData.file);

  try {
    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: payload,
      // ❌ DO NOT manually set Content-Type
      // headers: { "Content-Type": "multipart/form-data" }, ← avoid this
    });

    if (response.ok) {
      alert("Upload successful!");
    } else {
      alert("Upload failed.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload error.");
  }
};

