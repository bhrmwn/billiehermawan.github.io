import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Bell, Droplets, Thermometer, Cloud, PlusCircle } from 'lucide-react';

// --- Integrasi Firebase ---
// 1. Impor fungsi yang diperlukan dari Firebase SDK untuk REALTIME DATABASE
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, query, orderByChild, limitToLast } from "firebase/database";

// 2. KONFIGURASI FIREBASE ANDA
// Konfigurasi ini telah diisi berdasarkan interaksi sebelumnya.
const firebaseConfig = {
  apiKey: "AIzaSyDgiWM19noJGnlP6dgbpJpVkEjDoRkeAwY",
  authDomain: "read-temp-v2.firebaseapp.com",
  databaseURL: "https://read-temp-v2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "read-temp-v2",
  storageBucket: "read-temp-v2.appspot.com",
  messagingSenderId: "24554362358",
  appId: "1:24554362358:web:49c8e51ee7113ed01463d7"
};

// 3. Inisialisasi Firebase dan Realtime Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Path diubah menjadi '/log-temp-v1' sesuai pembaruan Anda
const weatherDataRef = ref(db, 'log-am2301-v2');


// --- Komponen Anak (Tidak Berubah) ---
const StatCard = ({ icon, title, value, unit }) => (
  <div className="bg-slate-800 p-6 rounded-xl flex flex-col justify-between">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-slate-400 font-medium">{title}</h3>
      {icon}
    </div>
    <div>
      <span className="text-5xl font-bold text-white">{value}</span>
      <span className="text-2xl text-slate-300 ml-1">{unit}</span>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-slate-800 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
        <div style={{ width: '100%', height: 250 }}>
            {children}
        </div>
    </div>
);

// --- Komponen Tooltip Kustom ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.fullTimestamp);
    
    const pad = (n) => n < 10 ? '0' + n : n;
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const formattedDate = `${day}/${month}/${year} | ${hours}.${minutes}.${seconds} WIB`;

    const value = payload[0].value;
    const name = payload[0].dataKey === 'suhu' ? 'Suhu' : 'Kelembaban';
    const unit = payload[0].dataKey === 'suhu' ? '°C' : '%';

    return (
      <div className="p-2 bg-slate-800 border border-slate-600 rounded-md shadow-lg text-sm">
        <p className="label text-slate-300 mb-1">{formattedDate}</p>
        <p className="intro" style={{ color: payload[0].stroke }}>
          {`${name}: ${value} ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};


// --- Komponen Utama Aplikasi ---
export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState([]);
  const [currentTemp, setCurrentTemp] = useState('N/A');
  const [currentHumidity, setCurrentHumidity] = useState('N/A');
  const [lastUpdated, setLastUpdated] = useState('Menunggu data...');
  const [isLoading, setIsLoading] = useState(true);

  // useEffect untuk mendengarkan data real-time dari Realtime Database
  useEffect(() => {
    const recentDataQuery = query(weatherDataRef, orderByChild('waktu'), limitToLast(30));

    const unsubscribe = onValue(recentDataQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataFromRTDB = Object.keys(data).map(key => {
            const record = data[key];
            const temp = typeof record.suhu === 'number' ? record.suhu : 0;
            const hum = typeof record.kelembaban === 'number' ? record.kelembaban : 0;
            
            // **FIX: Mengubah format waktu untuk sumbu X menjadi HH:MM WIB**
            let timeValue = 'N/A';
            if (record.waktu) {
                const dateObj = new Date(record.waktu);
                const pad = (n) => n < 10 ? '0' + n : n;
                const hours = pad(dateObj.getHours());
                const minutes = pad(dateObj.getMinutes());
                timeValue = `${hours}:${minutes}`;
            }

            return {
              id: key,
              suhu: temp,
              kelembaban: hum,
              time: timeValue,
              fullTimestamp: record.waktu
            };
        });
        
        setWeatherData(dataFromRTDB);

        if (dataFromRTDB.length > 0) {
          const latestData = dataFromRTDB[dataFromRTDB.length - 1];
          setCurrentTemp(typeof latestData.suhu === 'number' ? latestData.suhu.toFixed(1) : 'N/A');
          setCurrentHumidity(typeof latestData.kelembaban === 'number' ? latestData.kelembaban.toFixed(1) : 'N/A');
          
          const latestDate = new Date(latestData.fullTimestamp);
          const formattedLastUpdate = latestDate.toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'long'
          });
          setLastUpdated(`Data terakhir: ${formattedLastUpdate}`);
        }
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching data from Realtime Database: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi untuk menambahkan data cuaca palsu ke Realtime DB
  const addMockData = async () => {
    const getFormattedTimestamp = () => {
        const d = new Date();
        const pad = (n) => n < 10 ? '0' + n : n;
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    try {
      const newTemp = parseFloat((Math.random() * 15 + 18).toFixed(2));
      const newHumidity = parseFloat((Math.random() * 30 + 60).toFixed(2));
      
      await push(weatherDataRef, {
        suhu: newTemp,
        kelembaban: newHumidity,
        waktu: getFormattedTimestamp()
      });
      console.log("Mock data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 font-sans">
      <div className="flex">
        {/* Sidebar Navigasi */}
        <aside className="w-64 bg-slate-800 p-6 hidden lg:block">
            <div className="flex items-center gap-2 mb-10">
                <Cloud className="text-sky-400" size={32}/>
                <h1 className="text-2xl font-bold text-white">WeatherWise</h1>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-700 text-white">Dashboard</a></li>
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700">History</a></li>
                    <li><a href="#" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-700">Settings</a></li>
                </ul>
            </nav>
            <div className="mt-10">
                <button 
                    onClick={addMockData}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white font-semibold px-4 py-3 rounded-lg hover:bg-sky-600 transition-colors"
                >
                    <PlusCircle size={20} />
                    <span>Add Mock Data</span>
                </button>
            </div>
        </aside>

        {/* Konten Utama */}
        <main className="flex-1 p-6 lg:p-10">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Dashboard</h2>
              <p className="text-slate-400">{lastUpdated}</p>
            </div>
             <div className="flex items-center gap-4">
               <button className="relative p-2 rounded-full hover:bg-slate-700">
                    <Bell className="text-slate-400" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
               </button>
              <img 
                src="https://placehold.co/40x40/64748b/e2e8f0?text=U" 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full"
              />
            </div>
          </header>
          
          {isLoading ? (
            <div className="text-center py-10">Loading data from Realtime Database...</div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard icon={<Thermometer size={24} className="text-orange-400"/>} title="Temperature" value={currentTemp} unit={currentTemp !== 'N/A' ? '°C' : ''} />
                <StatCard icon={<Droplets size={24} className="text-blue-400"/>} title="Humidity" value={currentHumidity} unit={currentHumidity !== 'N/A' ? '%' : ''} />
              </section>

              <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <ChartCard title="Temperature Over Time">
                     <ResponsiveContainer>
                        <AreaChart data={weatherData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f97316" stopOpacity={0.7}/><stop offset="95%" stopColor="#f97316" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} unit="°C" domain={['dataMin - 2', 'dataMax + 2']}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="suhu" stroke="#f97316" fill="url(#colorTemp)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
                
                <ChartCard title="Humidity Over Time">
                     <ResponsiveContainer>
                        <AreaChart data={weatherData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} unit="%" domain={['dataMin - 5', 'dataMax + 5']}/>
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="kelembaban" stroke="#38bdf8" fill="url(#colorHumidity)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
