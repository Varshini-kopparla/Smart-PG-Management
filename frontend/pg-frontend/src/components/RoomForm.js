import React, { useState } from 'react';
import axios from 'axios';

const RoomForm = ({ onRoomAdded }) => {
  const [form, setForm] = useState({
    number: '',
    room_type: '',
    rent: '',
    capacity: '',
    status: 'available',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      await axios.post('http://127.0.0.1:8000/api/rooms/', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onRoomAdded(); // notify RoomList to refresh
      setForm({ number: '', room_type: '', rent: '', capacity: '', status: 'available' });
      setError('');
    } catch (err) {
      console.error('Failed to add room:', err);
      setError('Failed to add room. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded mb-8">
      <h2 className="text-xl font-semibold mb-4">Add New Room</h2>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="number" value={form.number} onChange={handleChange} placeholder="Room Number" required className="border px-4 py-2 rounded" />
        <input name="room_type" value={form.room_type} onChange={handleChange} placeholder="Room Type" required className="border px-4 py-2 rounded" />
        <input name="rent" type="number" value={form.rent} onChange={handleChange} placeholder="Rent (₹)" required className="border px-4 py-2 rounded" />
        <input name="capacity" type="number" value={form.capacity} onChange={handleChange} placeholder="Capacity" required className="border px-4 py-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="border px-4 py-2 rounded">
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>

      <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Add Room
      </button>
    </form>
  );
};

export default RoomForm;
