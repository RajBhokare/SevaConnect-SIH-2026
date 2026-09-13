import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../lib/i18n';
import { workerApi } from '../services/api';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import {
  MapPin,
  LogOut,
  Shield,
  Zap,
  Menu,
  X,
  Sparkles,
  Globe
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, role, logout, setWorkerAvailability } = useAuthStore();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const isWorker = role === 'WORKER';
  const isAdmin = role === 'ADMIN' || role === 'COOPERATIVE_ADMIN';
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

  // Strict role-based navigation - no role leakage
  const allLinks = isWorker
    ? [
        { to: '/worker/dashboard', label: t('dashboard') },
        { to: '/worker/requests', label: t('jobRequests') },
        { to: '/worker/welfare', label: t('welfare') },
        { to: '/worker/profile', label: t('myProfile') }
      ]
    : isAdmin
    ? [
        { to: '/federation/admin', label: t('federationAdmin'), icon: Shield },
        { to: '/cooperative/ai-operations', label: t('aiOps'), icon: Sparkles }
      ]
    : [
        { to: '/customer/home', label: t('exploreServices') },
        { to: '/customer/bookings', label: t('myBookings') },
        { to: '/customer/emergency', label: t('emergencyHelp'), icon: Zap, isEmergency: true }
      ];

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
                className="w-10 h-10 rounded-xl object-contain shadow-xs border border-slate-100 group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 leading-tight tracking-tight">
                  Seva<span className="text-primary-600">Connect</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block">
                  {t('tagline')}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700 ml-4 border border-slate-200/60">
              <MapPin className="w-3.5 h-3.5 text-primary-600" />
              <span>{user?.location || 'Kothrud, Pune'}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {allLinks.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    active
                      ? item.isEmergency
                        ? 'bg-danger-100 text-danger-700 font-bold'
                        : 'bg-primary-50 text-primary-700 font-bold'
                      : item.isEmergency
                      ? 'text-danger-700 bg-danger-50 hover:bg-danger-100'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {isWorker && (
              <button
                onClick={handleToggleAvailability}
                disabled={toggling}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isAvailable
                    ? 'bg-success-50 border-success-300 text-success-800'
                    : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-success-500 animate-pulse' : 'bg-slate-400'}`} />
                {isAvailable ? t('availableForWork') : t('offline')}
              </button>
            )}

            {/* Tri-Language Switcher (EN / हिन्दी / मराठी) */}
            <div className="flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200 text-[11px] font-bold">
              {[
                { code: 'en', label: 'EN' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'mr', label: 'मराठी' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    language === lang.code
                      ? 'bg-white text-primary-700 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {role === 'WORKER' ? 'Independent Worker' : 'Customer'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-danger-600 px-2.5" title="Log out">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">{t('logIn')}</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">{t('joinSignUp')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Mobile Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[10px] font-bold">
              {['en', 'hi', 'mr'].map((code) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code)}
                  className={`px-1.5 py-0.5 rounded ${language === code ? 'bg-white text-primary-700 font-black' : 'text-slate-600'}`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>

            {isWorker && (
              <button
                onClick={handleToggleAvailability}
                className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${
                  isAvailable ? 'bg-success-50 border-success-300 text-success-800' : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}
              >
                {isAvailable ? '🟢' : '⚪'}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
            <MapPin className="w-4 h-4 text-primary-600" />
            <span>{user?.location || 'Kothrud, Pune'}</span>
          </div>

          {allLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="px-3">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <Button variant="danger" size="sm" className="w-full" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
                Log Out
              </Button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">{t('logIn')}</Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">{t('joinSignUp')}</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
