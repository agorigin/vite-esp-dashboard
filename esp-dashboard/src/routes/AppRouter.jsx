import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Home from '@/pages/Home';
// import Login from '@/pages/Login';
// import Signup from '@/pages/Signup';
// import NotFound from '@/pages/NotFound';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Register from '../pages/Register';
import AddPatient from '../pages/AddPatient';
import PatientList from '../pages/PatientList';
import AdminPanel from '../pages/AdminPanel';
import HospitalList from '../pages/HospitalList';
import Navbar from '../pages/Navbar';
import About from '../pages/About';
import Blog from '../pages/Blog';
import HospitalPanel from '../pages/HospitalPanel';
import DashboardPage from '../features/dashboard/DashboardPage';
import RoleBasedDashboard from '../pages/RoleBasedDashboard';


const ProtectedRoute = ({ children, roles }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user || !roles.includes(profile?.role)) return <Navigate to="/login" />;
  return children;
};

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />

          {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          <Route path="*" element={<NotFound />} />

          <Route path="/:patientId/dashboard" element={
            <ProtectedRoute roles={["admin", "hospital_admin"]}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin", "hospital_admin"]}>
                <RoleBasedDashboard />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/hospital" element={
            <ProtectedRoute roles={["hospital_admin"]}>
              <HospitalPanel />
            </ProtectedRoute>
          } /> */}
          <Route path="/hospitals" element={
            <ProtectedRoute roles={["admin"]}>
              <HospitalList />
            </ProtectedRoute>
          } />
          <Route
          path="/add-patient"
          element={
            <ProtectedRoute roles={["admin", "hospital_admin"]}>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute roles={["admin", "hospital_admin"]}>
              <PatientList />
            </ProtectedRoute>
          }
        />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
