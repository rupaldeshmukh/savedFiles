import React, { useState } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30 MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const ImageUploader = ({ formData, setFormData }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getBlobUploadUrl = async () => {
    const response = await fetch("/api/get-blob-upload-url");
    const data = await response.json();
    return data.uploadUrl; // example: { uploadUrl: "https://<your-blob>.sas-token" }
  };

  const saveBlobUrl = async (blobUrl) => {
    await fetch("/api/save-diagram-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diagramUrl: blobUrl }),
    });
  };

  const uploadToBlobStorage = async (file, uploadUrl) => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) throw new Error("Blob upload failed");
    return uploadUrl.split("?")[0]; // Return URL without SAS token
  };

  const handleFile = async (file) => {
    const isValidType = VALID_TYPES.includes(file.type);
    const isValidSize = file.size <= MAX_TOTAL_SIZE;

    if (!isValidType) {
      alert("Only JPEG, PNG, BMP, or GIF files are allowed.");
      return;
    }
    if (!isValidSize) {
      alert("File size exceeds 30 MB limit.");
      return;
    }

    setUploading(true);
    try {
      const uploadUrl = await getBlobUploadUrl();
      const blobUrl = await uploadToBlobStorage(file, uploadUrl);

      await saveBlobUrl(blobUrl); // Send blob location to backend

      setFormData((prev) => ({
        ...prev,
        diagram: blobUrl,
      }));

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed, please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("imageUpload").click()}
      style={{
        border: `2px dashed ${dragActive ? "#007bff" : "#ccc"}`,
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        cursor: "pointer",
        background: uploading ? "#f9f9f9" : "white",
      }}
    >
      <input
        type="file"
        id="imageUpload"
        accept=".jpg,.jpeg,.png,.bmp,.gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <p>{uploading ? "Uploading..." : "Click or drag & drop image here (max 30MB)"}</p>

      {previewUrl && (
        <div style={{ marginTop: "10px" }}>
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "300px", maxHeight: "300px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
