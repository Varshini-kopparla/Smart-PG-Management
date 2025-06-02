import React, { useState } from 'react';
import axios from 'axios';

function EditRoomModal({ room, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    number: room.number,
    room_type: room.room_type,
    rent: room.rent,
    capacity: room.capacity,
    status: room.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(`http://127.0.0.1:8000/api/rooms/${room.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUpdated();  // Refresh room list
      onClose();    // Close modal
    } catch (err) {
      console.error('Failed to update room:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-blue-600">Edit Room</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Room Number"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="room_type"
            value={formData.room_type}
            onChange={handleChange}
            placeholder="Room Type"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="rent"
            type="number"
            value={formData.rent}
            onChange={handleChange}
            placeholder="Rent"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
          </select>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoomModal;
