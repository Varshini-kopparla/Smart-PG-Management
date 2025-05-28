import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

// Simple Protected Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/" />;
};

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

    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);

    // ✅ Now fetch user profile
    const userRes = await axios.get('http://127.0.0.1:8000/api/auth/user/', {
      headers: {
        Authorization: `Bearer ${response.data.access}`,
      },
    });

    const role = userRes.data.role;
    alert("Login successful ✅");

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
// Navbar component

function Navbar() {
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

// Admin Dashboard
function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        console.warn("No access token found!");
        return;
      }

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/dashboard/summary/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-10">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <Navbar />

      <h1 className="text-3xl font-bold mb-6 text-blue-600 mt-6">Admin Dashboard</h1>
      <div className="flex flex-wrap gap-6">
        <StatCard title="Monthly Income" value={`₹${stats.total_income}`} />
        <StatCard title="Occupancy Rate" value={`${stats.occupancy_rate}%`} />
        <StatCard title="Total Tenants" value={stats.total_tenants} />
        <StatCard title="Pending Complaints" value={stats.pending_complaints} />
      </div>
    </div>
  );
}

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow-md rounded-xl p-6 w-full md:w-1/4">
    <div className="text-gray-500 text-sm mb-1">{title}</div>
    <div className="text-2xl font-bold text-blue-600">{value}</div>
  </div>
);

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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tenant-dashboard" element={<PrivateRoute><TenantDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
