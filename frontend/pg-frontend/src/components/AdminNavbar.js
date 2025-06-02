// src/components/AdminNavbar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminNavbar() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    axios
      .get('http://127.0.0.1:8000/api/auth/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Couldn't fetch user:", err));
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md rounded">
      <h1 className="text-xl font-semibold">Smart PG Admin</h1>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm">Welcome, {user.username}</span>}
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 font-semibold px-4 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
