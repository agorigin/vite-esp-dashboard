import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role === 'admin') navigate('/admin');
    else if (profile?.role === 'hospital_admin') navigate('/hospital');
  }, [profile]);

  return <p>Redirecting to your panel...</p>;
}