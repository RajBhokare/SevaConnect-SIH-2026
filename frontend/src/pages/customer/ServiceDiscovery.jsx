import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { workerApi, matchApi, bookingApi } from '../../services/api';
import { WorkerCard } from '../../components/WorkerCard';
import { RankBadge } from '../../components/RankBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Plumber',
  'Electrician',
  'Carpenter',
  'Cleaner',
  'Painter',
  'Appliance Repair',
  'Domestic Helper',
  'Caregiver',
  'Gardener',
  'Driver',
  'Other Household Services'
];

export function ServiceDiscovery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('fairmatch');
  const [availableOnly, setAvailableOnly] = useState(true);

  const [workers, setWorkers] = useState([]);
  const [recommendedWorker, setRecommendedWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeWorkerForBooking, setActiveWorkerForBooking] = useState(null);
  const [bookingRequirement, setBookingRequirement] = useState('');
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTimeSlot, setBookingTimeSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [bookingLocation, setBookingLocation] = useState(user?.location || 'Flat 402, Anand Park, Kothrud, Pune');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  useEffect(() => {
    fetchWorkersAndMatches();
  }, [selectedCategory, searchQuery, sortBy, availableOnly]);

  const fetchWorkersAndMatches = async () => {
    try {
      setLoading(true);

      if (sortBy === 'fairmatch') {
        // Fetch via FairMatch Engine
        const matchRes = await matchApi.getFairMatch({
          category: selectedCategory === 'All' ? null : selectedCategory,
          userLocation: user?.location || 'Kothrud, Pune',
          isEmergency: false
        });

        let list = matchRes.data.rankedWorkers || [];

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          list = list.filter(
            (w) =>
              w.name.toLowerCase().includes(q) ||
              w.location?.toLowerCase().includes(q) ||
              w.skills?.some((s) => s.toLowerCase().includes(q))
          );
        }

        if (availableOnly) {
          list = list.filter((w) => w.isAvailable === true);
        }

        setWorkers(list);
        setRecommendedWorker(matchRes.data.recommendedWorker || list[0] || null);
      } else {
        // Standard filtered query
        const res = await workerApi.getWorkers({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
          availableOnly: availableOnly ? 'true' : 'false',
          sort: sortBy
        });
        setWorkers(res.data || []);
        setRecommendedWorker(null);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
      toast.error('Failed to load workers list.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBookingModal = (worker) => {
    if (!isAuthenticated) {
      toast.info('Please sign in or create an account to book a service.');
      navigate('/login');
      return;
    }
    setActiveWorkerForBooking(worker);
    setBookingRequirement('');
    setBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingRequirement.trim() || !bookingLocation.trim()) {
      toast.error('Please fill in the problem requirement and service address.');
      return;
    }

    try {
      setIsSubmittingBooking(true);
      const res = await bookingApi.createBooking({
        workerId: activeWorkerForBooking._id,
        serviceCategory: activeWorkerForBooking.primarySkill || selectedCategory || 'Plumber',
        serviceTitle: `${activeWorkerForBooking.primarySkill || 'Home'} Service Request`,
        requirement: bookingRequirement,
        location: bookingLocation,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        amount: activeWorkerForBooking.hourlyRate || 299,
        isEmergency: false
      });

      toast.success('Service request submitted! The artisan has been notified.');
      setBookingModalOpen(false);
      navigate('/customer/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting booking request.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search and Category Filters Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Discover Verified Artisans
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Empowering independent workers through fair and transparent matching
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, skill, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting & Availability Filter Bar */}
        <div className="p-3.5 bg-slate-100/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="fairmatch">✨ FairMatch (Balanced Workload + Proximity)</option>
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
            />
            Show only workers available right now
          </label>
        </div>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Computing FairMatch recommendations...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching workers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing a different service category or adjusting your search filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setAvailableOnly(false);
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workers.map((worker) => (
            <WorkerCard
              key={worker._id}
              worker={worker}
              onRequestService={handleOpenBookingModal}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Schedule Service with Verified Artisan"
      >
        {activeWorkerForBooking && (
          <form onSubmit={handleConfirmBooking} className="space-y-4 text-left">
            {/* Worker Summary Header */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {activeWorkerForBooking.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {activeWorkerForBooking.name}
                  </h4>
                  <RankBadge worker={activeWorkerForBooking} rank={activeWorkerForBooking.rank} score={activeWorkerForBooking.score} size="sm" />
                </div>
                <p className="text-xs text-slate-500">
                  {activeWorkerForBooking.primarySkill} • {activeWorkerForBooking.experience} yrs exp
                </p>
                <span className="text-[11px] font-bold text-brand-700">
                  Base Rate: {formatINR(activeWorkerForBooking.hourlyRate)}
                </span>
              </div>
            </div>

            {/* Requirement Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Describe the problem / requirement *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Kitchen washbasin pipe is leaking; need replacement washer and check."
                value={bookingRequirement}
                onChange={(e) => setBookingRequirement(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
              />
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Preferred Date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                icon={Calendar}
                required
              />

              <Select
                label="Preferred Time Slot"
                value={bookingTimeSlot}
                onChange={(e) => setBookingTimeSlot(e.target.value)}
                options={[
                  { label: 'Morning (09:00 AM - 12:00 PM)', value: 'Morning (09:00 AM - 12:00 PM)' },
                  { label: 'Afternoon (01:00 PM - 04:00 PM)', value: 'Afternoon (01:00 PM - 04:00 PM)' },
                  { label: 'Evening (05:00 PM - 08:00 PM)', value: 'Evening (05:00 PM - 08:00 PM)' }
                ]}
              />
            </div>

            {/* Location */}
            <Input
              label="Service Address / Locality *"
              value={bookingLocation}
              onChange={(e) => setBookingLocation(e.target.value)}
              icon={MapPin}
              required
            />

            {/* Price Transparency Box */}
            <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Estimated Cooperative Standard Rate:</span>
              <span className="font-extrabold text-slate-900 text-sm">
                {formatINR(activeWorkerForBooking.hourlyRate)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setBookingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-bold shadow-sm"
                isLoading={isSubmittingBooking}
              >
                Confirm Service Request
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
