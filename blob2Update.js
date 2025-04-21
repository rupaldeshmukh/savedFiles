import React, { useState } from "react";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB
const VALID_TYPES = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

const BASE_BLOB_URL = "https://youraccount.blob.core.windows.net/yourcontainer"; // update this

const ImageUploader = ({ formData, setFormData, blobToken }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const generateBlobUrl = (filename) => {
    return `${BASE_BLOB_URL}/${filename}${blobToken}`;
  };

  const saveBlobUrl = async (blobUrl) => {
    await fetch("/api/save-diagram-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ diagramUrl: blobUrl }),
    });
  };

  const uploadToBlob = async (file, uploadUrl) => {
    const res = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });
    if (!res.ok) throw new Error("Upload failed");
    return uploadUrl.split("?")[0]; // Return blob URL without token
  };

  const handleFile = async (file) => {
    if (!VALID_TYPES.includes(file.type)) {
      alert("Only JPEG, PNG, BMP, or GIF files are allowed.");
      return;
    }
    if (file.size > MAX_TOTAL_SIZE) {
      alert("File size exceeds 30MB.");
      return;
    }

    setUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const uploadUrl = generateBlobUrl(filename);

      const finalUrl = await uploadToBlob(file, uploadUrl);
      await saveBlobUrl(finalUrl); // Save blob location to your backend

      setFormData((prev) => ({
        ...prev,
        diagram: finalUrl,
      }));

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
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
      <p>{uploading ? "Uploading..." : "Click or drag & drop image (max 30MB)"}</p>

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




<ImageUploader
  formData={formData}
  setFormData={setFormData}
  blobToken="?sv=2023-01-01&ss=b&srt=sco&sp=rwlacup&se=..." // your SAS token here
/>
