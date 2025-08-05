import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// Contoh data dummy suhu (bisa diganti dari Firebase nanti)
const data = [
  { time: '08:00', suhu: 28 },
  { time: '09:00', suhu: 29 },
  { time: '10:00', suhu: 30 },
  { time: '11:00', suhu: 31 },
  { time: '12:00', suhu: 33 },
  { time: '13:00', suhu: 34 },
  { time: '14:00', suhu: 35 },
];

export default function TemperatureChart() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Grafik Suhu</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="suhu" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
