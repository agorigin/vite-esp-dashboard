import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hospital_admin');
  const [hospitalId, setHospitalId] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', cred.user.uid), {
      uid: cred.user.uid,
      email,
      role,
      hospitalId: role === 'admin' ? null : hospitalId
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <input className="w-full p-2 mb-4 border rounded" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full p-2 mb-4 border rounded" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <select className="w-full p-2 mb-4 border rounded" value={role} onChange={e => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="hospital_admin">Hospital Admin</option>
        </select>
        {role === 'hospital_admin' && (
          <input className="w-full p-2 mb-4 border rounded" value={hospitalId} onChange={e => setHospitalId(e.target.value)} placeholder="Hospital ID" />
        )}
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700" onClick={register}>Register</button>
      </div>
    </div>
  );
}