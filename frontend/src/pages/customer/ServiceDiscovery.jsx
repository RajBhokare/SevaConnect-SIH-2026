import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { workerApi, matchApi } from '../../services/api';
import { WorkerCard } from '../../components/WorkerCard';
import { BookingModule } from '../../components/BookingModule';
import { Button } from '../../components/ui/Button';
import { ensureArray } from '../../lib/utils';
import { Search, SlidersHorizontal, AlertCircle, MapPin } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  // 1-Page Booking Module State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeWorkerForBooking, setActiveWorkerForBooking] = useState(null);

  useEffect(() => {
    fetchWorkersAndMatches();
  }, [selectedCategory, searchQuery, sortBy, availableOnly]);

  const fetchWorkersAndMatches = async () => {
    try {
      setLoading(true);

      if (sortBy === 'fairmatch') {
        const matchRes = await matchApi.getFairMatch({
          category: selectedCategory === 'All' ? null : selectedCategory,
          userLocation: user?.location || 'Kothrud, Pune',
          isEmergency: false
        });

        let list = ensureArray(matchRes?.data?.rankedWorkers || matchRes?.data);

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          list = list.filter(
            (w) =>
              w?.name?.toLowerCase().includes(q) ||
              w?.location?.toLowerCase().includes(q) ||
              w?.skills?.some((s) => s?.toLowerCase().includes(q))
          );
        }

        if (availableOnly) {
          list = list.filter((w) => w?.isAvailable === true);
        }

        setWorkers(list);
      } else {
        const res = await workerApi.getWorkers({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchQuery.trim() || undefined,
          availableOnly: availableOnly ? 'true' : 'false',
          sort: sortBy
        });
        setWorkers(ensureArray(res?.data));
      }
    } catch (err) {
      // Demo fallback
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (worker) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setActiveWorkerForBooking(worker);
    setBookingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search and Category Filters Header */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Verified Artisans
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent cooperative rates • Direct artisan booking • Zero commission gouging
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, skill, area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-xs transition-all"
              />
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-700 border border-slate-200 flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-primary-900" />
              <span className="font-medium truncate max-w-[120px]">{user?.location || 'Pune'}</span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting & Availability Filter Bar */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-900"
            >
              <option value="fairmatch">⚡ FairMatch (Balanced Workload + Proximity)</option>
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="rounded text-primary-900 focus:ring-primary-900 w-4 h-4"
            />
            Show only workers available right now
          </label>
        </div>
      </div>

      {/* Workers Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-3 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Finding verified cooperative workers...</p>
        </div>
      ) : !Array.isArray(workers) || workers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
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
              onSelect={handleOpenBooking}
              actionLabel="Book Service"
            />
          ))}
        </div>
      )}

      {/* Reusable 1-Page Booking Module */}
      <BookingModule
        worker={activeWorkerForBooking}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}

export default ServiceDiscovery;
