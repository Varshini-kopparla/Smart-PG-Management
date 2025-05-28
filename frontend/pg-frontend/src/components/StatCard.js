import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full md:w-1/4">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="text-2xl font-bold text-blue-600">{value}</div>
      {icon && <div className="mt-2">{icon}</div>}
    </div>
  );
};

export default StatCard;
