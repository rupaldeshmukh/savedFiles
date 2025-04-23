import React, { useState } from "react";
import { Button, Modal, ListGroup, CloseButton } from "react-bootstrap";
import { useDropzone } from "react-dropzone";

const MAX_TOTAL_SIZE = 30 * 1024 * 1024; // 30MB

const fileTypeConfig = {
  excel: [".xls", ".xlsx"],
  mixed: [
    ".jpg", ".jpeg", ".png", ".bmp", ".gif",
    ".ppt", ".pptx", ".xls", ".xlsx", ".doc", ".docx"
  ]
};

const FileUploader = ({ label = "Upload Files", allowedType = "excel" }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const allowedExtensions = fileTypeConfig[allowedType];

  const onDrop = (acceptedFiles) => {
    const totalSize = [...files, ...acceptedFiles].reduce(
      (sum, file) => sum + file.size,
      0
    );

    const invalidFiles = acceptedFiles.filter(
      (file) => !allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );

    if (invalidFiles.length > 0) {
      setError("Some files have invalid formats.");
      return;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      setError("Total file size exceeds 30MB limit.");
      return;
    }

    setFiles((prev) => [...prev, ...acceptedFiles]);
    setError("");
    setShowModal(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: allowedExtensions.reduce((acc, ext) => {
      const clean = ext.replace(".", "");
      acc[`application/${clean}`] = [];
      acc[`image/${clean}`] = [];
      return acc;
    }, {})
  });

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setError("");
  };

  return (
    <div className="m-3">
      <Button onClick={() => setShowModal(true)}>{label}</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            {...getRootProps()}
            className="border p-4 text-center"
            style={{ cursor: "pointer", borderStyle: "dashed" }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag & drop some files here, or click to select files</p>
            )}
          </div>
          {error && <div className="text-danger mt-2">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {files.length > 0 && (
        <>
          <ListGroup className="mt-3">
            {files.map((file, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                {file.name}
                <CloseButton onClick={() => removeFile(idx)} />
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="danger" onClick={clearAll} className="mt-2">
            Remove All
          </Button>
        </>
      )}
    </div>
  );
};

export default FileUploader;
