import { useAuth } from '../context/AuthContext';
import AdminPanel from './AdminPanel';
import HospitalPanel from './HospitalPanel';

export default function RoleBasedDashboard() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminPanel />;
  } else if (profile?.role === 'hospital_admin') {
    return <HospitalPanel />;
  } else {
    return <p className="text-center mt-10 text-red-500 font-semibold">Unauthorized Role</p>;
  }
}
