import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

const handleUpload = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append('file', file);

  try {
    await API.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    alert('Document uploaded successfully!');
    navigate('/dashboard');
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert('Error uploading document');
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleUpload} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Upload Document</h2>
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} required className="w-full p-2 border mb-4" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Upload</button>
      </form>
    </div>
  );
}

export default DocumentUpload;
