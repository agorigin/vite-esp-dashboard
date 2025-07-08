import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white" onClick={() => navigate('/hospital')}>
          <h2 className="text-xl font-semibold mb-2">🏥 List Hospitals</h2>
          <p>View and manage all registered hospitals.</p>
        </div>

        <div className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white" onClick={() => navigate('/register')}>
          <h2 className="text-xl font-semibold mb-2">➕ Register Hospital</h2>
          <p>Add a new hospital admin account.</p>
        </div>

        <div className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer bg-gradient-to-r from-green-400 to-blue-600 text-white" onClick={() => navigate('/patients')}>
          <h2 className="text-xl font-semibold mb-2">🧑‍⚕️ View Patients</h2>
          <p>See the complete list of all patients under all hospitals.</p>
        </div>
      </div>
    </div>
  );
}