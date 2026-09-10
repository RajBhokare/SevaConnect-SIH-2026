import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { workerApi, ratingApi, bookingApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { RankBadge } from '../../components/RankBadge';
import { formatINR, formatDate } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Star,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  HeartHandshake,
  ArrowLeft,
  Briefcase
} from 'lucide-react';

export function WorkerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingRequirement, setBookingRequirement] = useState('');
  const [bookingDate, setBookingDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTimeSlot, setBookingTimeSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [bookingLocation, setBookingLocation] = useState(user?.location || 'Kothrud, Pune');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      const [wRes, rRes] = await Promise.all([
        workerApi.getWorkerById(id),
        ratingApi.getWorkerRatings(id)
      ]);
      setWorker(wRes.data);
      setReviews(rRes.data || []);
    } catch (err) {
      toast.error('Could not load worker profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to schedule a service.');
      navigate('/login');
      return;
    }

    try {
      setIsSubmittingBooking(true);
      await bookingApi.createBooking({
        workerId: worker._id,
        serviceCategory: worker.primarySkill,
        serviceTitle: `${worker.primarySkill} Service Request`,
        requirement: bookingRequirement,
        location: bookingLocation,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        amount: worker.hourlyRate || 299,
        isEmergency: false
      });

      toast.success('Service request submitted successfully!');
      setBookingModalOpen(false);
      navigate('/customer/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit service request.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading verified artisan profile...</p>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-base font-bold text-slate-800">Worker profile not found</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Main Profile Header Card */}
      <Card className="overflow-hidden border-slate-200/90 shadow-md">
        <div className="h-32 bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 relative" />

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-white text-white flex items-center justify-center font-black text-2xl shadow-lg">
                {worker.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{worker.name}</h1>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" title="Online" />
                </div>
                <p className="text-xs font-bold text-brand-700 uppercase tracking-wide">
                  {worker.primarySkill} Specialist
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setBookingModalOpen(true)}
              className="font-bold shadow-md shadow-brand-500/20"
            >
              Request Service Now
            </Button>
          </div>

          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <RankBadge worker={worker} rank={worker.rank} score={worker.score} size="lg" />
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Cooperative Member
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Award className="w-4 h-4 text-blue-600" />
              {worker.cooperativeName}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {worker.location}
            </span>
          </div>

          {/* Bio */}
          <p className="mt-4 text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {worker.bio}
          </p>

          {/* Metrics Grid */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Rating</p>
              <div className="flex items-center justify-center gap-1 text-sm font-black text-amber-900 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                {worker.rating?.toFixed(1) || '4.8'}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">AI Performance Score</p>
              <p className="text-sm font-black text-brand-700 mt-0.5">{worker.score || 0}/100</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Completed Gigs</p>
              <p className="text-sm font-black text-slate-800 mt-0.5">{worker.completedJobs} Jobs</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Hourly Rate</p>
              <p className="text-sm font-black text-brand-700 mt-0.5">{formatINR(worker.hourlyRate)}/hr</p>
            </div>
          </div>

          {/* Skills & Operational Coverage */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Specialized Craft Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {worker.skills?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-brand-50 text-brand-800 rounded-lg text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Local Service Area Coverage
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {worker.serviceArea} (Within ~{worker.serviceRadius || 10} km radius)
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Reviews Section with AI Sentiment Tags */}
      <Card className="border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Verified Community Reviews ({reviews.length > 0 ? reviews.length : worker.reviewCount || 1})
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {worker.positiveFeedbackPercentage || 100}% Positive Feedback
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-2xl text-xs text-slate-500">
            "Prompt service, arrived on time with proper cooperative verification, and fixed the leakage cleanly." — Pune Resident
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{rev.customerName}</span>
                    {rev.sentiment && (
                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${
                        rev.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                        rev.sentiment === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {rev.sentiment === 'positive' ? 'Positive' : rev.sentiment === 'negative' ? 'Critical' : 'Neutral'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: rev.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                </div>
                {rev.comment && (
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-1 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {rev.categories && rev.categories.map((cat, ci) => (
                      <span key={ci} className="px-2 py-0.5 bg-white text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                        {cat}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{formatDate(rev.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={`Request Service with ${worker.name}`}
      >
        <form onSubmit={handleConfirmBooking} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
              Problem / Task Details *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe what needs to be repaired or installed..."
              value={bookingRequirement}
              onChange={(e) => setBookingRequirement(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              icon={Calendar}
              required
            />
            <Select
              label="Time Slot"
              value={bookingTimeSlot}
              onChange={(e) => setBookingTimeSlot(e.target.value)}
              options={[
                { label: 'Morning (09:00 AM - 12:00 PM)', value: 'Morning (09:00 AM - 12:00 PM)' },
                { label: 'Afternoon (01:00 PM - 04:00 PM)', value: 'Afternoon (01:00 PM - 04:00 PM)' },
                { label: 'Evening (05:00 PM - 08:00 PM)', value: 'Evening (05:00 PM - 08:00 PM)' }
              ]}
            />
          </div>

          <Input
            label="Service Address *"
            value={bookingLocation}
            onChange={(e) => setBookingLocation(e.target.value)}
            icon={MapPin}
            required
          />

          <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Standard Cooperative Rate:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {formatINR(worker.hourlyRate)}
            </span>
          </div>

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
              className="font-bold"
              isLoading={isSubmittingBooking}
            >
              Confirm Service Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
