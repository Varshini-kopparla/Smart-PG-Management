import React, { useState, useEffect } from 'react';
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

    axios.get('http://127.0.0.1:8000/api/auth/user/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setUser(res.data))
    .catch((err) => console.error("Couldn't fetch user:", err));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <div className="container-fluid justify-content-between">
        <span className="navbar-brand fw-bold">Smart PG Admin</span>
        <div className="d-flex align-items-center">
          {user && (
            <span className="text-white me-3 small">
              Welcome, <strong>{user.username}</strong>
            </span>
          )}
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavbar;
