import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

function Upload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      await API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Document uploaded successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Error uploading document');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Document</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
        <br />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;
