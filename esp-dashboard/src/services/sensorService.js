import { getAuth } from 'firebase/auth';

const BASE_URL = 'http://localhost:3001';

// Helper to get current user's Firebase ID token
async function getIdToken() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('User not authenticated');
  return user.getIdToken(); // returns JWT token string
}

export async function fetchSensorData() {
  const token = await getIdToken();

  const res = await fetch(`${BASE_URL}/sensorData`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Failed to fetch sensor data');
  return res.json();
}

export async function sendCalibration() {
  const token = await getIdToken();

  return fetch(`${BASE_URL}/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    body: '0,0,0',
  });
}
