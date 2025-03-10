import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Clock, BarChart3, Calendar as CalendarIcon, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!user || location.pathname === '/') return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/10 backdrop-blur-lg border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center">
            <Brain className="w-8 h-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">TimeGuru</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/tracker"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Clock className="w-6 h-6" />
            </Link>
            <Link
              to="/analytics"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <BarChart3 className="w-6 h-6" />
            </Link>
            <Link
              to="/calendar"
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <CalendarIcon className="w-6 h-6" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}