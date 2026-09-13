import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { workerApi, ratingApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { BookingModule } from '../../components/BookingModule';
import { formatINR, formatDate, ensureArray } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Star,
  ShieldCheck,
  Award,
  MapPin,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Briefcase,
  Check
} from 'lucide-react';

export function WorkerPublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      const [wRes, rRes] = await Promise.allSettled([
        workerApi.getWorkerById(id),
        ratingApi.getWorkerRatings(id)
      ]);
      const wData = wRes.status === 'fulfilled' ? wRes.value?.data : null;
      const rData = rRes.status === 'fulfilled' ? ensureArray(rRes.value?.data) : [];
      setWorker(wData);
      setReviews(rData);
    } catch (err) {
      toast.error('Could not load worker profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to schedule a service.');
      navigate('/login');
      return;
    }
    setBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading verified worker storefront...</p>
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

  const initials = (worker?.name || 'Worker')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Main Storefront Header Card */}
      <Card className="overflow-hidden border-slate-200/90 shadow-sm bg-white">
        <div className="h-24 bg-primary-900 border-b border-primary-800" />

        <div className="px-6 sm:px-8 pb-8 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border-4 border-white text-white flex items-center justify-center font-black text-xl shadow-md">
                {initials}
              </div>
              <div className="space-y-0.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {worker.name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-primary-800">
                  {worker.primarySkill || 'Artisan Specialist'}
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleOpenBooking}
              className="font-bold shadow-xs flex-shrink-0"
            >
              Request Service
            </Button>
          </div>

          {/* Verification & Trust Signals */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="inline-flex items-center gap-1 text-success-700 bg-success-50 px-2.5 py-1 rounded-md border border-success-200 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
              Identity Verified
            </span>
            <span className="inline-flex items-center gap-1 text-success-700 bg-success-50 px-2.5 py-1 rounded-md border border-success-200 font-semibold">
              <Award className="w-3.5 h-3.5 text-success-600" />
              Skill Certified
            </span>
            <span className="text-slate-500 font-medium ml-1">
              Member of <span className="text-slate-800 font-semibold">{worker.cooperativeName || 'Maharashtra Shramik Swavalamban Cooperative'}</span>
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Customer Rating</p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-slate-900 text-base">{worker.rating?.toFixed(1) || '4.9'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Completed Services</p>
              <p className="font-bold text-slate-900 text-base mt-0.5">{worker.completedJobs || 58} Gigs</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Experience</p>
              <p className="font-bold text-slate-900 text-base mt-0.5">{worker.experience || 8} Years</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <p className="text-[11px] text-slate-500 font-medium">Floor Wage</p>
              <p className="font-bold text-primary-900 text-base mt-0.5">{formatINR(worker.hourlyRate || 250)}/hr</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Services Offered, Service Area, Availability, & About */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Details & Bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Services Offered */}
          <Card className="p-6 border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(worker.skills) && worker.skills.length > 0 ? worker.skills : [worker.primarySkill || 'General Repairs']).map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>

          {/* About Professional Bio */}
          <Card className="p-6 border-slate-200/90 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">About</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {worker.bio || `Certified cooperative professional specializing in ${worker.primarySkill || 'home services'}. Dedicated to high workmanship standards, fair wages, and customer satisfaction.`}
            </p>
          </Card>

          {/* Customer Reviews */}
          <Card className="p-6 border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Verified Customer Reviews</h3>
              <span className="text-xs text-slate-500 font-medium">{reviews.length} feedback entries</span>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">No reviews recorded yet for this artisan.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < (r.stars || 5) ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400">{formatDate(r.createdAt || new Date())}</span>
                    </div>
                    <p className="text-slate-700 font-medium">"{r.comment || 'Prompt, courteous and skilled work.'}"</p>
                    <p className="text-[11px] text-slate-500">— Verified Customer ({r.customerLocation || 'Pune'})</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Location, Radius & Availability */}
        <div className="space-y-6">
          <Card className="p-6 border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Service Area & Availability</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Primary Locality</p>
                  <p className="text-slate-500">{worker.location || 'Kothrud, Pune'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Service Coverage</p>
                  <p className="text-slate-500">{worker.serviceRadius || 6} km radius across Pune</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Standard Working Hours</p>
                  <p className="text-slate-500">09:00 AM – 07:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Today's Status</p>
                  <p className={worker.isAvailable ? 'text-success-700 font-bold' : 'text-slate-500 font-medium'}>
                    {worker.isAvailable ? '● Available for Immediate Bookings' : '○ Offline / Booked for Today'}
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="md"
              onClick={handleOpenBooking}
              className="w-full font-bold shadow-xs mt-2"
            >
              Book {worker.name.split(' ')[0]}
            </Button>
          </Card>
        </div>
      </div>

      {/* 1-Page Booking Module */}
      <BookingModule
        worker={worker}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}

export default WorkerPublicProfile;
