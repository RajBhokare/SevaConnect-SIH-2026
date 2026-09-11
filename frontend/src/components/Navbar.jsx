import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { workerApi } from '../services/api';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import {
  Wrench,
  MapPin,
  CalendarCheck,
  User,
  LogOut,
  Shield,
  Activity,
  Zap,
  Menu,
  X,
  Sparkles,
  HeartHandshake
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, role, logout, setWorkerAvailability } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isWorker = role === 'WORKER';
  const isAvailable = user?.workerProfile?.isAvailable ?? true;

  const handleToggleAvailability = async () => {
    try {
      setToggling(true);
      const res = await workerApi.toggleAvailability(!isAvailable);
      setWorkerAvailability(res.data.isAvailable);
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to update availability status.');
    } finally {
      setToggling(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="SevaConnect Logo"
                className="w-10 h-10 rounded-xl object-contain shadow-sm border border-slate-100 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 leading-tight tracking-tight">
                  Seva<span className="text-brand-600">Connect</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block">
                  Connecting Skills. Empowering Communities.
                </span>
              </div>
            </Link>

            {/* Locality badge for customer view */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700 ml-4 border border-slate-200/60">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{user?.location || 'Kothrud, Pune'}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {isWorker ? (
              <>
                <Link
                  to="/worker/dashboard"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/worker/dashboard')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/worker/requests"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/worker/requests')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Job Requests
                </Link>
                <Link
                  to="/worker/welfare"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/worker/welfare')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Cooperative & Welfare
                </Link>
                <Link
                  to="/worker/profile"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/worker/profile')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/customer/home"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/customer/home') || isActive('/')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Explore Services
                </Link>
                <Link
                  to="/customer/bookings"
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    isActive('/customer/bookings')
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/customer/emergency"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                  Emergency Help
                </Link>
              </>
            )}

            {/* AI Operations Link for Cooperative Management Demo */}
            <Link
              to="/cooperative/ai-operations"
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/cooperative/ai-operations')
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              AI Ops
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Worker Availability Quick Toggle */}
            {isWorker && (
              <button
                onClick={handleToggleAvailability}
                disabled={toggling}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isAvailable
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                {isAvailable ? 'Available for Work' : 'Offline / On Break'}
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.name}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {role === 'WORKER' ? 'Cooperative Worker' : 'Customer'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-600 px-2.5"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Join / Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            {isWorker && (
              <button
                onClick={handleToggleAvailability}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  isAvailable
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                {isAvailable ? '🟢 Online' : '⚪ Offline'}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>{user?.location || 'Kothrud, Pune'}</span>
          </div>

          {isWorker ? (
            <>
              <Link
                to="/worker/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Worker Dashboard
              </Link>
              <Link
                to="/worker/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Job Requests
              </Link>
              <Link
                to="/worker/welfare"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cooperative & Welfare
              </Link>
              <Link
                to="/worker/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/customer/home"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Explore Services
              </Link>
              <Link
                to="/customer/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                My Bookings
              </Link>
              <Link
                to="/customer/emergency"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50"
              >
                ⚡ Emergency Service
              </Link>
            </>
          )}

          <Link
            to="/cooperative/ai-operations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50"
          >
            ✨ AI Operations (Cooperative Hub)
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="px-3">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
              >
                Log Out
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
