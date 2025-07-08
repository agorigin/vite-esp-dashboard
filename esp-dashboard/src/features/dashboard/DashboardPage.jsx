// DashboardPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChartCanvas from '../../components/ChartCanvas';
import ButtonGroup from '../../components/ButtonGroup';
import { fetchSensorData, sendCalibration } from '../../services/sensorService';
// import { db } from '../../firebaseConfig';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function DashboardPage() {
  const { patientId } = useParams(); // 👈 Extract patientId from URL
  const [liveValues, setLiveValues] = useState({ x: 0, y: 0, z: 0 });
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState({ x: [], y: [], z: [] });
  const [sessionData, setSessionData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const intervalRef = useRef(null);

  // Fetch and store data
  const fetchAndUpdate = async () => {
    try {
      const data = await fetchSensorData();
      const now = new Date().toLocaleTimeString();

      setLiveValues(data);
      setLabels(prev => [...prev, now].slice(-50));
      setDatasets(prev => ({
        x: [...prev.x, data.x].slice(-50),
        y: [...prev.y, data.y].slice(-50),
        z: [...prev.z, data.z].slice(-50),
      }));

      setSessionData(prev => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(), // formatted time
          x: data.x,
          y: data.y,
          z: data.z
        },
      ]);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const startFetching = () => {
    if (!intervalRef.current) {
      fetchAndUpdate();
      intervalRef.current = setInterval(fetchAndUpdate, 500);
      setFetching(true);
    }
  };

  const holdFetching = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setFetching(false);
  };

  const calibrate = () => {
    sendCalibration();
  };

  const saveToFirebase = async () => {
    if (!patientId) {
      alert("Patient ID is missing from URL.");
      return;
    }
    if (sessionData.length === 0) {
      alert("No data to save. Please start measurement first.");
      return;
    }

    try {
      const docRef = doc(db, "patients", patientId);

      await updateDoc(docRef, {
        sensorData: sessionData,
        lastUpdated: new Date(),
      });
      alert("✅ Sensor data saved to patient profile!");
    } catch (e) {
      console.error('Error saving to Firestore:', e);
      alert('❌ Failed to save data.');
    }
  };

  const downloadCSV = () => {
    if (!sessionData.length) return;
  
    const csvRows = [
      ['Time', 'Delta X', 'Delta Y', 'Delta Z'], // headers
      ...sessionData.map(row => [row.time, row.x, row.y, row.z]),
    ];
  
    const csvContent = csvRows.map(e => e.join(',')).join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = `sensor_data_${patientId}.csv`;
    link.click();
  
    URL.revokeObjectURL(url); // clean up
  };

  return (
    <div className="p-4">
      <ButtonGroup
        onStart={startFetching}
        onHold={holdFetching}
        onCalibrate={calibrate}
        isFetching={fetching}
      />

      <ChartCanvas labels={labels} datasets={datasets} />

      <div className="mt-4 text-lg font-mono">
        ΔX: {liveValues.x?.toFixed(1)} | ΔY: {liveValues.y?.toFixed(1)} | ΔZ: {liveValues.z?.toFixed(1)}
      </div>

      <button
        onClick={saveToFirebase}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        💾 Save Measurement
      </button>
      <button
        onClick={downloadCSV}
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        📥 Download CSV
      </button>
    </div>
  );
}
