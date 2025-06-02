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
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 mt-6">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-6 mb-10">
          <StatCard title="Monthly Income" value={`₹${stats.total_income}`} />
          <StatCard title="Occupancy Rate" value={`${stats.occupancy_rate}%`} />
          <StatCard title="Total Tenants" value={stats.total_tenants} />
          <StatCard title="Pending Complaints" value={stats.pending_complaints} />
        </div>

        {/* Room Form and Room List */}
        <div className="grid md:grid-cols-2 gap-10">
          <RoomForm onRoomAdded={() => setRefreshRooms(prev => !prev)} />
          <RoomList refresh={refreshRooms} />
        </div>
        {/* Tenant List */}
      <div className="mt-10">
        <TenantList />
      </div>
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

export default AdminDashboard;
