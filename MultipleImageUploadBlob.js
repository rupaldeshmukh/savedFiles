import React, { useState } from 'react';
import axios from 'axios';

const API_UPLOAD_URL = 'https://example.com/upload';
const API_DELETE_URL = 'https://example.com/delete';
const X_API_KEY = 'your-api-key';
const USERTOKEN = 'your-user-token';
const PUBLISH_ID = 'your-publish-id';

const MAX_TOTAL_SIZE_MB = 30;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];

export default function FileUploader() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const bytesToMB = (bytes) => bytes / (1024 * 1024);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    const validFiles = selectedFiles.filter(file => ACCEPTED_TYPES.includes(file.type));

    if (validFiles.length !== selectedFiles.length) {
      alert('Only JPEG, PNG, BMP, and GIF files are allowed!');
      e.target.value = '';
      return;
    }

    const totalSize = uploadedFiles.reduce((acc, file) => acc + file.size, 0)
      + validFiles.reduce((acc, file) => acc + file.size, 0);

    if (bytesToMB(totalSize) > MAX_TOTAL_SIZE_MB) {
      alert('Total size exceeds 30MB!');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    validFiles.forEach(file => formData.append('files[]', file));

    try {
      setIsLoading(true);

      const res = await axios.post(API_UPLOAD_URL, formData, {
        headers: {
          'x-api-key': X_API_KEY,
          'usertoken': USERTOKEN,
        },
      });

      const newFiles = validFiles.map((file, idx) => ({
        name: file.name,
        blobUrl: res.data.blobUrls[idx],
        size: file.size,
        type: file.type,
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
      setPreviewUrl(res.data.blobUrls[res.data.blobUrls.length - 1]);
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleRemove = async (indexToRemove) => {
    const fileToRemove = uploadedFiles[indexToRemove];

    try {
      setIsLoading(true);

      await axios.post(API_DELETE_URL, {
        blobUrls: [fileToRemove.blobUrl],
        fileType: fileToRemove.type.split('/')[1], // e.g., 'jpeg'
        publishId: PUBLISH_ID,
      }, {
        headers: {
          'x-api-key': X_API_KEY,
          'usertoken': USERTOKEN,
        },
      });

      const newList = uploadedFiles.filter((_, idx) => idx !== indexToRemove);
      setUploadedFiles(newList);

      if (fileToRemove.blobUrl === previewUrl) {
        setPreviewUrl(newList.length > 0 ? newList[newList.length - 1].blobUrl : null);
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded shadow relative">
      <h2 className="text-xl font-bold mb-4">Upload Image Files</h2>

      <input
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        onChange={handleFileChange}
        disabled={isLoading}
        className="mb-4"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
          <div className="loader border-4 border-t-4 border-blue-500 rounded-full w-10 h-10 animate-spin" />
        </div>
      )}

      {previewUrl && (
        <div className="mb-4">
          <h3 className="font-semibold">Last Uploaded Preview:</h3>
          <img src={previewUrl} alt="Preview" className="w-full max-h-60 object-contain border" />
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((file, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{file.name}</span>
              <button
                onClick={() => handleRemove(index)}
                disabled={isLoading}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        .loader {
          border-color: #f3f3f3;
          border-top-color: #3498db;
        }
      `}</style>
    </div>
  );
}
