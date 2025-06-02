// src/components/TenantList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TenantList() {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://127.0.0.1:8000/api/tenants/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTenants(res.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Tenant List</h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Room No</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td className="border px-4 py-2">{tenant.user?.username || 'N/A'}</td>
              <td className="border px-4 py-2">{tenant.user?.email || 'N/A'}</td>
              <td className="border px-4 py-2">{tenant.user?.phone || 'N/A'}</td>
              <td className="text-sm text-gray-700">{tenant.room ? `${tenant.room.number} (${tenant.room.room_type})` : 'No room assigned'}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TenantList;
