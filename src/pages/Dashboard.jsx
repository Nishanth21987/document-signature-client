import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

function Dashboard() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await API.get('/documents');
        setDocuments(res.data);
      } catch (err) {
        console.error(err);
        alert('Error fetching documents');
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <Link to="/upload" className="text-blue-500 underline">Upload Document</Link>
      <ul className="mt-4">
        {documents.map(doc => (
          <li key={doc._id} className="border p-2 my-2 rounded flex justify-between">
            <span>{doc.originalName} ({doc.status})</span>
            <Link to={`/view/${doc._id}`} className="text-blue-500 underline">View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
