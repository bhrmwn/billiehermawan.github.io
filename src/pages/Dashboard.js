import React from 'react';
import Header from '../components/Header';

export default function Dashboard() {
  return (
    <div className="flex-1 bg-gray-100 p-6">
      <Header />
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">Card 1</div>
          <div className="bg-white p-4 rounded shadow">Card 2</div>
          <div className="bg-white p-4 rounded shadow">Card 3</div>
        </div>
      </div>
    </div>
  );
}
