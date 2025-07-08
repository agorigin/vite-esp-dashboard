import { useNavigate } from 'react-router-dom';

export default function HospitalPanel() {
  const navigate = useNavigate();

  const buttons = [
    { label: 'Patients List', path: '/patients' },
    { label: 'Add New Patient', path: '/add-patient' },
    // { label: 'About', path: '/about' },
    // { label: 'Blog', path: '/blog' },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center mb-8">🏥 Hospital Admin Panel</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {buttons.map(({ label, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
