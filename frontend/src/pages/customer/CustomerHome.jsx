import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from '../../lib/i18n';
import { serviceCatalogApi, workerApi, bookingApi } from '../../services/api';
import { ServiceCard } from '../../components/ServiceCard';
import { WorkerCard } from '../../components/WorkerCard';
import { BookingCard } from '../../components/BookingCard';
import { Button } from '../../components/ui/Button';
import { ensureArray } from '../../lib/utils';
import {
  Search,
  Zap,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Scale,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';

export function CustomerHome() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
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
      const [srvRes, wrkRes] = await Promise.allSettled([
        serviceCatalogApi.getServices(),
        workerApi.getWorkers({ availableOnly: 'true' })
      ]);

      const srvData = srvRes.status === 'fulfilled' ? ensureArray(srvRes.value?.data) : [];
      const wrkData = wrkRes.status === 'fulfilled' ? ensureArray(wrkRes.value?.data) : [];

      setServices(srvData);
      setWorkers(wrkData);

      if (user) {
        try {
          const bkRes = await bookingApi.getCustomerBookings();
          setRecentBookings(ensureArray(bkRes?.data).slice(0, 2));
        } catch (bkErr) {
          setRecentBookings([]);
        }
      }
    } catch (err) {
      // Demo fallback
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

  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* 1. Focused Top Section: "I need a service" */}
      <section className="bg-primary-900 rounded-2xl p-6 sm:p-10 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-slate-200 border border-white/15">
            <ShieldCheck className="w-3.5 h-3.5 text-success-400" />
            <span>SIH 2026 • Cooperative-Owned Worker Marketplace</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Good morning, {userName} 👋
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-normal">
              What service do you need today?
            </p>
          </div>

          {/* Clean Primary Search Bar */}
          <form onSubmit={handleSearch} className="pt-2">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg overflow-hidden p-1 border border-slate-200">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search electrician, plumber, carpenter, cleaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
              <Button type="submit" size="sm" className="font-bold flex-shrink-0 mr-1">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Active Bookings Quick Access (Only when logged in with bookings) */}
      {recentBookings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your Active Service Requests</h2>
            <Link to="/customer/bookings" className="text-xs font-semibold text-primary-800 hover:underline">
              View All Bookings →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentBookings.map((b) => (
              <BookingCard key={b._id} booking={b} userRole="CUSTOMER" />
            ))}
          </div>
        </section>
      )}

      {/* 3. Popular Services Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Popular Services</h2>
            <p className="text-xs text-slate-500">Verified artisans with transparent cooperative floor pricing</p>
          </div>
          <Link to="/customer/discover" className="text-xs font-semibold text-primary-800 hover:underline">
            View all 11 categories →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.slice(0, 8).map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onSelect={handleSelectService}
            />
          ))}
        </div>
      </section>

      {/* 4. FairMatch Recommended Verified Workers */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>⚡ FairMatch Recommended Workers</span>
              <span className="text-xs font-normal text-success-700 bg-success-50 px-2 py-0.5 rounded-full border border-success-200">
                Balanced Workload
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Matched based on required skill, verified background, close proximity, and fair distribution of work.
            </p>
          </div>
          <Link to="/customer/discover" className="text-xs font-semibold text-primary-800 hover:underline self-start sm:self-auto">
            Browse all artisans →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.slice(0, 3).map((worker) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              onSelect={handleRequestWorker}
              actionLabel="Book Service"
            />
          ))}
        </div>
      </section>

      {/* 5. Emergency Service Quick Access Strip */}
      <section className="bg-red-50/80 border border-danger-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-danger-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Urgent Home Repair or Emergency?</h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
              Pipe burst, hazardous short circuit, or lock failure? Dispatches the nearest verified emergency worker immediately.
            </p>
          </div>
        </div>
        <Link to="/customer/emergency" className="flex-shrink-0 w-full sm:w-auto">
          <Button variant="danger" size="sm" className="w-full sm:w-auto font-bold shadow-xs">
            Emergency Help SOS
          </Button>
        </Link>
      </section>

      {/* 6. How SevaConnect Works (Calm, Trustworthy Indian Consumer Experience) */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 text-left">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">How SevaConnect Works</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            A transparent, cooperative model built for independent workers and homeowners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-800 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="text-sm font-bold text-slate-900">FairMatch Allocation</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              No middleman bidding wars. Work is fairly routed based on proximity, skill, and workload balancing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-success-50 text-success-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="text-sm font-bold text-slate-900">100% Verified Artisans</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every worker is identity-verified and accredited through local cooperative federations.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="text-sm font-bold text-slate-900">Direct Standard Pricing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clear wage-floor pricing with zero surge charges. What you see is what you pay.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="text-sm font-bold text-slate-900">Social Security Fund</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              A micro-contribution from each booking directly funds medical insurance and emergency pension for the worker.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CustomerHome;
