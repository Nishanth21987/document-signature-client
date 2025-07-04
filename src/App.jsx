import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentUpload from './pages/DocumentUpload';
import ViewAndSign from './pages/ViewAndSign';
import Register from './pages/Register';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<DocumentUpload />} />
        <Route path="/view/:docId" element={<ViewAndSign />} />
      </Routes>
    </Router>
  );
}

export default App;
