// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash2, PlaneTakeoff } from 'lucide-react';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [dest, setDest] = useState('');
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    const res = await api.get('/trips/');
    setTrips(res.data);
  };

  const generateTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/ai/itinerary', { destination: dest, days: parseInt(days), preferences: "" });
      setDest('');
      fetchTrips(); // Refresh the list
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    await api.delete(`/trips/${id}`);
    setTrips(trips.filter(t => t.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My AI Travels</h1>
      
      {/* Form */}
      <form onSubmit={generateTrip} className="mb-10 bg-blue-50 p-6 rounded-lg">
        <input value={dest} onChange={e=>setDest(e.target.value)} placeholder="Where to?" className="p-2 mr-2 border"/>
        <input type="number" value={days} onChange={e=>setDays(e.target.value)} className="p-2 mr-2 border w-20"/>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white p-2 rounded">
          {loading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>

      {/* List */}
      <div className="grid gap-4">
        {trips.map(trip => (
          <div key={trip.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-bold">{trip.destination}</h3>
              <p className="text-sm text-gray-500">{trip.days} Days</p>
            </div>
            <button onClick={() => deleteTrip(trip.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}