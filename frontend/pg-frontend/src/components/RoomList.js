import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditRoomModal from './EditRoomModal';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState(null);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://127.0.0.1:8000/api/rooms/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://127.0.0.1:8000/api/rooms/${roomId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRooms(); // Refresh list
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-700">Room Management</h2>

      {editRoom && (
        <EditRoomModal
          room={editRoom}
          onClose={() => setEditRoom(null)}
          onUpdated={fetchRooms}
        />
      )}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="border px-4 py-2">Room No</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Rent</th>
            <th className="border px-4 py-2">Capacity</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="border px-4 py-2">{room.number}</td>
              <td className="border px-4 py-2">{room.room_type}</td>
              <td className="border px-4 py-2">₹{room.rent}</td>
              <td className="border px-4 py-2">{room.capacity}</td>
              <td className="border px-4 py-2">{room.status}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => setEditRoom(room)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomList;
