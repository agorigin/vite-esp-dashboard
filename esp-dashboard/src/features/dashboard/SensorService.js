export async function fetchSensorData() {
    const res = await fetch('/sensorData');
    if (!res.ok) throw new Error('Failed to fetch sensor data');
    return await res.json();
  }
  
  export async function calibrateSensor() {
    await fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: '0,0,0'
    });
  }
  