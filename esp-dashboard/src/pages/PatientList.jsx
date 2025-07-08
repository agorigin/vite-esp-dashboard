import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/solid';

export default function PatientList() {
  const { profile } = useAuth();
  const [patients, setPatients] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      if (!profile?.role) return;

      try {
        let grouped = {};

        if (profile.role === 'hospital_admin') {
          // Hospital admin: only fetch their own patients
          const q = query(collection(db, 'patients'), where('hospitalId', '==', profile.hospitalId));
          const snap = await getDocs(q);
          const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          grouped[profile.hospitalId] = data;
        } else if (profile.role === 'admin') {
          // Admin: fetch all hospital_admin users to get hospital IDs
          const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'hospital_admin')));
          const hospitalAdmins = usersSnap.docs.map(doc => doc.data()).filter(u => u.hospitalId);
          const validHospitalIds = hospitalAdmins.map(u => u.hospitalId);

          // Then fetch all patients
          const patientsSnap = await getDocs(collection(db, 'patients'));
          const allPatients = patientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Group by hospitalId but only if hospitalId is valid (i.e., belongs to a hospital_admin)
          allPatients.forEach(p => {
            if (!p.hospitalId || !validHospitalIds.includes(p.hospitalId)) return;
            if (!grouped[p.hospitalId]) grouped[p.hospitalId] = [];
            grouped[p.hospitalId].push(p);
          });
        }

        setPatients(grouped);
      } catch (err) {
        console.error('Failed to fetch patients:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [profile]);

  const renderTable = (hospitalId, patientList) => (
    <div key={hospitalId} className="mb-10">
      <h3 className="text-xl font-semibold mb-2 text-gray-700">🏥 Hospital ID: {hospitalId}</h3>
      {patientList.length === 0 ? (
        <p className="text-gray-500 italic">No patients for this hospital.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 bg-white shadow-sm rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Gender</th>
                <th className="p-2 border">Admitted At</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {patientList.map(p => (
                <tr key={p.id} className="text-center hover:bg-gray-50">
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.age}</td>
                  <td className="p-2 border">{p.gender}</td>
                  <td className="p-2 border">{p.admittedAt?.toDate().toLocaleString() || 'N/A'}</td>
                  <td className="p-2 border text-center">
                    <Link
                      to={`/${p.id}/dashboard`}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Dashboard"
                    >
                      <EyeIcon className="h-5 w-5 inline-block" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Patients List</h2>
        {profile?.role === 'hospital_admin' && (
          <button
            onClick={() => navigate('/add-patient')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add Patient
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading patients...</p>
      ) : Object.keys(patients).length === 0 ? (
        <p className="text-gray-500">No patients found.</p>
      ) : (
        Object.entries(patients)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([hospitalId, list]) => renderTable(hospitalId, list))
      )}
    </div>
  );
}
