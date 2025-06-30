import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TenantDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    axios
      .get('http://127.0.0.1:8000/api/tenant/dashboard/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Failed to fetch tenant dashboard:", err));
  }, []);

  if (!data) return <div className="p-5 text-center">Loading your dashboard...</div>;

  return (
    <div className="container my-5">
      <TenantNavbar />

      <h2 className="text-center my-4">Tenant Dashboard</h2>

      {/* Room Details */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Room Details</h5>
          <p>Room Number: <strong>{data.room_number}</strong></p>
          <p>Room Type: <strong>{data.room_type}</strong></p>
          <p>Monthly Rent: ₹<strong>{data.rent}</strong></p>
        </div>
      </div>

      {/* Payment History */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Payment History</h5>
          {data.payments.length === 0 ? (
            <p className="text-muted">No payments recorded.</p>
          ) : (
            <ul className="list-group">
              {data.payments.map((p, idx) => (
                <li key={idx} className="list-group-item">
                  {p.month} {p.year} – ₹{p.amount} [{p.status}]
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Complaints */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Complaints</h5>
          {data.complaints.length === 0 ? (
            <p className="text-muted">No complaints filed.</p>
          ) : (
            <ul className="list-group">
              {data.complaints.map((c, idx) => (
                <li key={idx} className="list-group-item">
                  <strong>{c.title}</strong> — {c.status}
                  {c.response && (
                    <div className="text-muted small">Response: {c.response}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Submit Complaint */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Submit New Complaint</h5>
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
          >
            <div className="mb-3">
              <input
                type="text"
                name="title"
                required
                placeholder="Title"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <textarea
                name="description"
                required
                placeholder="Describe your issue"
                rows="4"
                className="form-control"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success">
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Navbar
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

    axios
      .get('http://127.0.0.1:8000/api/auth/user/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Couldn't fetch user:", err));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-4 mb-4">
      <span className="navbar-brand">Smart PG Tenant</span>
      <div className="ms-auto d-flex align-items-center gap-2">
        {user && <span className="text-white me-3">Welcome, {user.username}</span>}
        <button onClick={handleLogout} className="btn btn-light btn-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default TenantDashboard;
