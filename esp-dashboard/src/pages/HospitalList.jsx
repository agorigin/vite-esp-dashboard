import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function HospitalList() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHospitals = async () => {
    try {
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.role === 'hospital_admin');
        console.log("filtered",filtered);
      setHospitals(filtered);
    } catch (err) {
      console.error('Error fetching hospitals:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hospital?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchHospitals();
    } catch (err) {
      alert('Error deleting hospital: ' + err.message);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Hospitals</h1>
        <button
          onClick={() => navigate('/register')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Hospital
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading hospitals...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="py-3 px-4 border-b text-left">Hospital ID</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map(h => (
                <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="py-2 px-4 border-b">{h.hospitalId || <em className="text-gray-400">Unknown</em>}</td>
                  <td className="py-2 px-4 border-b">{h.email}</td>
                  <td className="py-2 px-4 border-b flex gap-2">
                    <button onClick={() => navigate(`/edit-hospital/${h.id}`)} className="text-blue-500 hover:text-blue-700">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(h.id)} className="text-red-500 hover:text-red-700">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {hospitals.length === 0 && !loading && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">No hospitals found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
