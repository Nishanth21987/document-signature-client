import React, { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      alert('Registered successfully! Please login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering');
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-6">
      <h1 className="text-2xl mb-4">Register</h1>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 m-2" required />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 m-2" required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 m-2" required />
      <button type="submit" className="bg-green-500 text-white p-2 m-2">Register</button>
    </form>
  );
}

export default Register;
