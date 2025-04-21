import React, { useState } from "react";

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const validTypes = ["image/jpeg", "image/png", "image/bmp", "image/gif"];

  const handleFile = (file) => {
    if (file && validTypes.includes(file.type)) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Only JPEG, PNG, BMP, or GIF files are allowed.");
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
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
      style={{
        border: `2px dashed ${dragActive ? '#007bff' : '#ccc'}`,
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        cursor: "pointer",
      }}
      onClick={() => document.getElementById("imageUpload").click()}
    >
      <input
        type="file"
        id="imageUpload"
        accept=".jpg,.jpeg,.png,.bmp,.gif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <p>{dragActive ? "Drop the file here..." : "Click or drag & drop image here"}</p>

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
