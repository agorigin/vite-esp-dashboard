require('dotenv').config();

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const PORT = 3001;

const serviceAccount = require('./serviceAccountKey.json'); // adjust path if needed

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  // credential: admin.credential.cert(serviceAccount),
});

// Firebase Admin Initialization
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(), // or use a serviceAccountKey.json
//   // You can also add databaseURL if using Firebase RTDB
// });

// Middleware to verify Firebase Auth Token
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // user info now available on req.user
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ error: 'Unauthorized' });
  }
};

app.use(cors());
app.use(express.json());

let latestData = { x: 0, y: 0, z: 0 };

// 🔐 Protected: Get sensor data
app.get('/sensorData', verifyFirebaseToken, (req, res) => {
  res.json(latestData);
});

// 🔐 Protected: Post sensor data
app.post('/data', verifyFirebaseToken, express.text(), (req, res) => {
  const rawText = req.body.trim(); // e.g. "-1.3,-90.6,78.9"
  const [x, y, z] = rawText.split(',').map(Number);

  if ([x, y, z].some(n => isNaN(n))) {
    return res.status(400).send('Invalid data format');
  }

  latestData = { x, y, z };
  console.log(`User ${req.user.uid} sent:`, latestData);

  res.status(200).send('Data received');
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
