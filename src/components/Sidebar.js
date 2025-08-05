import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6">My Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <button className="hover:bg-gray-700 p-2 rounded text-left">Home</button>
        <button className="hover:bg-gray-700 p-2 rounded text-left">Analytics</button>
        <button className="hover:bg-gray-700 p-2 rounded text-left">Settings</button>
      </nav>
    </div>
  );
}
