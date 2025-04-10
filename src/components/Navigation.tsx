import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-800 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-purple-400">
            HabitFlow
          </Link>
          <div className="flex items-center gap-6">
            <NavLink to="/" icon={<Home size={20} />} text="Home" isActive={isActive('/')} />
            <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" isActive={isActive('/dashboard')} />
            <NavLink to="/profile" icon={<User size={20} />} text="Profile" isActive={isActive('/profile')} />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, text, isActive }: { to: string; icon: React.ReactNode; text: string; isActive: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
      isActive ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
    }`}
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navigation;