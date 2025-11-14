import { useState, useEffect } from 'react';
import ERPLayout from "./ERPLayout";
import StudentView from "./student";
import LecturerView from "./lecturer";
import Login from "./Login";
import PublicVote from "./PublicVote";
import { LogOut } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState<'admin' | 'staff' | 'student' | null>(null);
  const [isPublicVote, setIsPublicVote] = useState(false);

  // Check if accessing public vote page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isVotePage = urlParams.get('vote') !== null || window.location.pathname === '/vote';
    setIsPublicVote(isVotePage);
  }, []);

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'admin' || savedRole === 'staff' || savedRole === 'student') {
      setUserRole(savedRole);
    }
  }, []);

  // Handle login
  const handleLogin = (role: 'admin' | 'staff' | 'student') => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  };

  // Handle logout
  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
  };

  // Show public vote page if accessing vote URL
  if (isPublicVote) {
    return <PublicVote />;
  }

  // Show login if no role
  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  // Logout button component
  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
      title="Logout"
    >
      <LogOut size={18} />
      <span className="font-medium">Logout</span>
    </button>
  );

  // Route to appropriate component based on role
  return (
    <>
      <LogoutButton />
      {userRole === 'admin' && <ERPLayout />}
      {userRole === 'staff' && <LecturerView />}
      {userRole === 'student' && <StudentView />}
    </>
  );
}
