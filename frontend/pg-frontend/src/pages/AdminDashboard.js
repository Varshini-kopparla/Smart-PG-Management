import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../components/AdminNavbar';
import RoomForm from '../components/RoomForm';
import RoomList from '../components/RoomList';
import TenantList from '../components/TenantList';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [refreshRooms, setRefreshRooms] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/dashboard/summary/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="bg-light min-vh-100">
      <AdminNavbar />
      <div className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Admin Dashboard</h2>

        {/* Stats Cards */}
        <div className="row text-center mb-5">
          <StatCard title="Monthly Income" value={`₹${stats.total_income}`} />
          <StatCard title="Occupancy Rate" value={`${stats.occupancy_rate}%`} />
          <StatCard title="Total Tenants" value={stats.total_tenants} />
          <StatCard title="Pending Complaints" value={stats.pending_complaints} />
        </div>

        {/* Room Form & List */}
        <div className="row">
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm p-4">
              <h4 className="mb-3">Add New Room</h4>
              <RoomForm onRoomAdded={() => setRefreshRooms(prev => !prev)} />
            </div>
          </div>
          <div className="col-md-7 mb-4">
            <div className="card shadow-sm p-4">
              <h4 className="mb-3">Room Management</h4>
              <RoomList refresh={refreshRooms} />
            </div>
          </div>
        </div>

        {/* Tenant List */}
        <div className="mt-5">
          <h4 className="mb-3">Tenant List</h4>
          <div className="card shadow-sm p-3">
            <TenantList />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="col-md-3 mb-3">
      <div className="card text-center shadow-sm">
        <div className="card-body">
          <p className="text-muted small mb-1">{title}</p>
          <h5 className="fw-bold text-primary">{value}</h5>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
