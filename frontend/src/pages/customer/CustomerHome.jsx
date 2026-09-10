import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { serviceCatalogApi, workerApi, bookingApi } from '../../services/api';
import { ServiceCard } from '../../components/ServiceCard';
import { WorkerCard } from '../../components/WorkerCard';
import { BookingCard } from '../../components/BookingCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'sonner';
import {
  Search,
  MapPin,
  Zap,
  ShieldCheck,
  Award,
  Users,
  ArrowRight,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

export function CustomerHome() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [srvRes, wrkRes] = await Promise.all([
        serviceCatalogApi.getServices(),
        workerApi.getWorkers({ availableOnly: 'true' })
      ]);
      setServices(srvRes.data || []);
      setWorkers(wrkRes.data || []);

      if (user) {
        const bkRes = await bookingApi.getCustomerBookings();
        setRecentBookings((bkRes.data || []).slice(0, 2));
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/discover?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/customer/discover');
    }
  };

  const handleSelectService = (service) => {
    navigate(`/customer/discover?category=${encodeURIComponent(service.category)}`);
  };

  const handleRequestWorker = (worker) => {
    navigate(`/customer/discover?workerId=${worker._id}&category=${encodeURIComponent(worker.primarySkill || 'Plumber')}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Welcome & Search Header */}
      <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-brand-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            100% Cooperative-Owned & Verified Independent Workers
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Skilled, reliable services for your home and workplace.
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Fair rates, certified artisans, and direct community ownership with zero middleman exploitation.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Plumber, Electrician, Tap repair, Deep Cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              className="font-bold text-brand-900 bg-white hover:bg-blue-50 sm:w-auto w-full rounded-2xl shadow-md"
            >
              Find Experts
            </Button>
          </form>
        </div>
      </div>

      {/* Emergency Assistance Quick Callout */}
      <div className="bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border border-red-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
            <Zap className="w-6 h-6 fill-white text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-950">
              Emergency Breakdown Assistance (Instant Dispatch)
            </h3>
            <p className="text-xs text-red-800/80 mt-0.5">
              Urgent water leakage, electrical short circuit, or door lockout? Get the closest verified artisan now.
            </p>
          </div>
        </div>
        <Link to="/customer/emergency" className="w-full sm:w-auto">
          <Button variant="danger" size="md" className="w-full sm:w-auto font-bold flex-shrink-0">
            Request Emergency Service
          </Button>
        </Link>
      </div>

      {/* Recent Bookings (if any) */}
      {recentBookings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-brand-600" />
              Recent Service Activity
            </h2>
            <Link
              to="/customer/bookings"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              View all bookings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBookings.map((bk) => (
              <BookingCard key={bk._id} booking={bk} isWorkerView={false} />
            ))}
          </div>
        </section>
      )}

      {/* Service Categories Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Essential Home Services
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent standard rates set by the workers' cooperative
            </p>
          </div>
          <Link
            to="/customer/discover"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onSelect={handleSelectService}
            />
          ))}
        </div>
      </section>

      {/* Verified Cooperative Workers Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Verified Cooperative Artisans Near You
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked with FairMatch to balance work opportunities and ensure trusted quality
            </p>
          </div>
          <Link
            to="/customer/discover"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            See all artisans <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.slice(0, 3).map((worker, idx) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              isRecommended={idx === 0}
              onRequestService={handleRequestWorker}
            />
          ))}
        </div>
      </section>

      {/* Cooperative Guarantee & Trust Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
            <Award className="w-4 h-4" />
            The SevaConnect Cooperative Difference
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            Why choose a cooperative-owned marketplace?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Verified Artisans</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Background-checked, skill-certified, and vetted by their local district cooperative council.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">FairMatch Distribution</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algorithms prioritize balanced work allocation among suitable workers rather than corporate ad bidding.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Worker Welfare Protection</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every booking directly funds accident insurance and social security for the artisan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
