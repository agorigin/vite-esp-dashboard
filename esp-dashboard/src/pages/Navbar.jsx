import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

   // Close dropdown on outside click
   useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const userInitial = user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          {/* 🏥 GoniometerApp */}
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
            Home
          </Link>
          <Link to="/about" className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
            About Us
          </Link>
          <Link to="/blog" className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
            Blog
          </Link>

          {!user ? (
            <Link to="/login" className="text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* User Avatar Button */}
              <button
                onClick={toggleDropdown}
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold"
              >
                {userInitial}
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50">
                  <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100">
                    <p className="font-semibold text-primary-light" role="none">{profile?.role || 'User'}</p>
                    <p className="text-gray-500 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700" role="none">{user?.email}</p>
                  </div>
                  <hr className="border-gray-300 dark:border-gray-600" />
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
