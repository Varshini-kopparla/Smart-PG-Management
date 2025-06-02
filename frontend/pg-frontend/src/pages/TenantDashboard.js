import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';


function TenantDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    axios.get('http://127.0.0.1:8000/api/tenant/dashboard/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => setData(res.data))
    .catch((err) => console.error("Failed to fetch tenant dashboard:", err));
  }, []);

  if (!data) return <div className="p-10">Loading your dashboard...</div>;

  return (
    <div className="min-h-screen p-10">
      <TenantNavbar />

      <h1 className="text-3xl font-bold text-green-600 mb-6 mt-6">Tenant Dashboard</h1>

      {/* Room Details */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Room Details</h2>
        <p>Room Number: <strong>{data.room_number}</strong></p>
        <p>Room Type: <strong>{data.room_type}</strong></p>
        <p>Monthly Rent: ₹<strong>{data.rent}</strong></p>
      </div>

      {/* Payments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Payment History</h2>
        <ul className="list-disc pl-5">
          {data.payments.map((p, idx) => (
            <li key={idx}>
              {p.month} {p.year} – ₹{p.amount} [{p.status}]
            </li>
          ))}
        </ul>
      </div>

      {/* Complaints */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Complaints</h2>
        {data.complaints.length === 0 ? (
          <p>No complaints filed.</p>
        ) : (
          <ul className="list-disc pl-5">
            {data.complaints.map((c, idx) => (
              <li key={idx}>
                <strong>{c.title}</strong> — {c.status}
                {c.response && (
                  <div className="ml-4 text-sm text-gray-600">
                    Response: {c.response}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Submit Complaint */}
<div className="mt-10">
  <h2 className="text-xl font-semibold mb-2">Submit New Complaint</h2>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const title = e.target.title.value;
      const description = e.target.description.value;

      const token = localStorage.getItem('accessToken');
      if (!token) return;

      axios
        .post(
          'http://127.0.0.1:8000/api/complaints/',
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((res) => {
          alert('Complaint submitted ✅');
          e.target.reset();
          // Refresh complaint list
          setData((prev) => ({
            ...prev,
            complaints: [res.data, ...prev.complaints],
          }));
        })
        .catch((err) => {
          console.error('Error submitting complaint:', err);
          alert('Something went wrong ❌');
        });
    }}
    className="space-y-4"
  >
    <input
      type="text"
      name="title"
      required
      placeholder="Title"
      className="w-full border px-4 py-2 rounded"
    />
    <textarea
      name="description"
      required
      placeholder="Describe your issue"
      className="w-full border px-4 py-2 rounded"
      rows={4}
    ></textarea>
    <button
      type="submit"
      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
    >
      Submit Complaint
    </button>
  </form>
</div>

    </div>
  );
}


function TenantNavbar() {
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
    <nav className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md rounded">
      <h1 className="text-xl font-semibold">Smart PG Tenant</h1>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm">Welcome, {user.username}</span>}
        <button
          onClick={handleLogout}
          className="bg-white text-green-600 font-semibold px-4 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default TenantDashboard;