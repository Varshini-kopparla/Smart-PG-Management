import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

// Login Page
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
      username,
      password,
    });

    const access = response.data.access;
    const refresh = response.data.refresh;

    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);

    // 🔍 Add this for debugging
    console.log("Login successful, fetching user...");

    const userRes = await axios.get('http://127.0.0.1:8000/api/auth/user/', {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    const role = userRes.data.role;
    console.log("User role:", role); // 🔍 Check this in console

    if (role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/tenant-dashboard');
    }

  } catch (err) {
    console.error('[Login Error]', err);
    setError("Invalid credentials. Please try again.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          PG Management Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
export default Login;