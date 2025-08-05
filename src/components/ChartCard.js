import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { time: '10:00', suhu: 29 },
  { time: '11:00', suhu: 30 },
  { time: '12:00', suhu: 31 },
  { time: '13:00', suhu: 32 },
  { time: '14:00', suhu: 33 },
];

export default function ChartCard() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow w-full h-64">
      <h3 className="text-lg font-semibold mb-2">Grafik Suhu</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis domain={[28, 35]} />
          <Tooltip />
          <Line type="monotone" dataKey="suhu" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
