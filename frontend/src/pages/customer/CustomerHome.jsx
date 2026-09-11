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
  CalendarCheck,
  CheckCircle2,
  HeartHandshake,
  Briefcase,
  Layers,
  Scale,
  CreditCard,
  Star,
  Activity
} from 'lucide-react';

export function CustomerHome() {
  const { user, role } = useAuthStore();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Hero / Brand Positioning Header */}
      <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-indigo-900 rounded-3xl p-6 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-16 w-64 h-64 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          {/* Government / Cooperative Initiative Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-blue-100 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>SIH 2026 • PS 26089 • Ministry of Cooperation (NCCT)</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Trusted Services. <br className="hidden sm:inline" />
            <span className="text-emerald-300">Fair Opportunities.</span>
          </h1>

          {/* Supporting Statement */}
          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl leading-relaxed">
            A cooperative-powered digital marketplace connecting customers with verified independent gig workers for household and community services.
          </p>

          {/* Dual Action CTAs: Customer vs Independent Worker */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/customer/discover">
              <Button
                variant="secondary"
                size="lg"
                className="font-bold text-brand-900 bg-white hover:bg-blue-50 rounded-2xl shadow-lg flex items-center gap-2"
              >
                <span>Need a Service? Find Workers</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link to="/signup">
              <Button
                variant="outline"
                size="lg"
                className="font-bold text-white border-white/40 hover:bg-white/10 rounded-2xl flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-emerald-300" />
                <span>Offer Your Skills? Join as Independent Worker</span>
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="pt-4 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Plumber, Electrician, Carpenter, Cleaner, Caregiver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-900 sm:w-auto w-full rounded-2xl shadow-md"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* 2. The Three Core Pillars of SevaConnect */}
      <section className="space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Our Foundation
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            The Three Pillars of SevaConnect
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Re-architecting gig services with cooperative fairness, dignity, and transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Pillar 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-brand-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. Open Opportunity
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Independent gig workers showcase their crafts, experience, and certifications to access local opportunities with direct earnings and zero middleman deductions.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-brand-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. FairMatch Distribution
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Suitability first, safety first, then balanced opportunity allocation among eligible workers to prevent winner-take-all monopoly and support all artisans.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-brand-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. Trusted Service Lifecycle
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A transparent 5-step lifecycle: <strong>Verification → Booking → Service → Digital Payment → Rating & Feedback</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How SevaConnect Works Flow */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              How SevaConnect Works
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              End-to-end transparent coordination for customers, independent workers, and cooperatives.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full self-start sm:self-auto">
            Standard Workflow
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {[
            { step: '1', title: 'Customer Request', desc: 'Select category & schedule' },
            { step: '2', title: 'Suitable Workers', desc: 'Filter skill & radius' },
            { step: '3', title: 'FairMatch', desc: 'Balance workload fairly' },
            { step: '4', title: 'Booking', desc: 'Worker accepts request' },
            { step: '5', title: 'Service', desc: 'On-site execution' },
            { step: '6', title: 'Payment', desc: 'Digital settlement & receipt' },
            { step: '7', title: 'Rating', desc: 'Feedback & history' }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 space-y-1.5 flex flex-col justify-between">
              <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center mx-auto shadow-sm">
                {item.step}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Emergency Assistance Quick Callout */}
      <div className="bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border border-red-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md animate-pulse">
            <Zap className="w-6 h-6 fill-white text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md uppercase tracking-wider">
                SOS Rapid Dispatch
              </span>
              <h3 className="text-sm sm:text-base font-bold text-red-950">
                Urgent Breakdown & Emergency Service
              </h3>
            </div>
            <p className="text-xs text-red-800/80 mt-1">
              Pipe burst, electrical short circuit, or door lock failure? Dispatch the closest verified emergency worker on-demand.
            </p>
          </div>
        </div>
        <Link to="/customer/emergency" className="w-full sm:w-auto">
          <Button variant="danger" size="md" className="w-full sm:w-auto font-bold flex-shrink-0 rounded-xl shadow-md">
            Request Emergency Service
          </Button>
        </Link>
      </div>

      {/* 5. Recent Bookings (if logged in) */}
      {recentBookings.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-brand-600" />
              Your Recent Bookings
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

      {/* 6. Service Categories Catalog */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Household & Community Service Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified independent artisans offering fair-rate community household services
            </p>
          </div>
          <Link
            to="/customer/discover"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Explore Full Catalog <ArrowRight className="w-3.5 h-3.5" />
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

      {/* 7. Verified Independent Gig Workers Spotlight */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              Verified Independent Gig Workers Near You
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked with FairMatch to balance work opportunities across eligible artisans
            </p>
          </div>
          <Link
            to="/customer/discover"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
          >
            See all verified workers <ArrowRight className="w-3.5 h-3.5" />
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

      {/* 8. Cooperative Guarantee & Welfare Section */}
      <section className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
            <Award className="w-4 h-4" />
            Cooperative Advantage & Worker Welfare
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Why Choose a Cooperative-Powered Marketplace?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            SevaConnect empowers independent workers through collective ownership, fair opportunities, and integrated social security layers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-emerald-800/60">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">✓ Verified Workers</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Identity verified, skill-certified, and vetted by their local district cooperative federation. Government IDs are kept strictly confidential.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-300">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Fair Opportunity Allocation</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              FairMatch algorithms prevent gig monopolies by distributing work opportunities fairly among all suitable and available artisans.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/50 flex items-center justify-center text-emerald-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Welfare & Insurance Integration Ready</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built with an integrated social security and worker welfare layer designed for seamless accident and health policy integration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
