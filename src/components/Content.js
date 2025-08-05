import React from 'react';
import TemperatureChart from './TemperatureChart';

export default function Content() {
  return (
    <main className="p-6 bg-gray-100 flex-1 overflow-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart />
        {/* Bisa tambahkan chart atau card lain di sini */}
      </div>
    </main>
  );
}