import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { workerApi, bookingApi } from '../../services/api';
import { BookingCard } from '../../components/BookingCard';
import { DigitalInvoice } from '../../components/DigitalInvoice';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatINR, ensureArray } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Award,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  MapPin,
  Calendar,
  Check,
  X
} from 'lucide-react';

export function WorkerDashboard() {
  const { user, setWorkerAvailability } = useAuthStore();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [selectedInvoiceBooking, setSelectedInvoiceBooking] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await workerApi.getDashboard();
      setDashboardData(res?.data || null);
    } catch (err) {
      toast.error('Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      setToggling(true);
      const current = dashboardData?.worker?.isAvailable ?? true;
      const res = await workerApi.toggleAvailability(!current);
      setWorkerAvailability(res.data.isAvailable);
      toast.success(res.data.message);
      fetchDashboard();
    } catch (err) {
      toast.error('Error toggling availability.');
    } finally {
      setToggling(false);
    }
  };

  const handleAcceptBooking = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'ACCEPTED');
      toast.success(`Accepted request #${booking.bookingId}`);
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to accept booking.');
    }
  };

  const handleDeclineBooking = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'DECLINED');
      toast.info(`Declined request #${booking.bookingId}`);
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to decline booking.');
    }
  };

  const handleStartService = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'IN_PROGRESS');
      toast.success('Service marked as In-Progress (On-site)!');
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleCompleteService = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'COMPLETED');
      toast.success('Service marked as Completed! Customer can now settle payment.');
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to complete service.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-primary-900 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500 font-medium">Loading artisan workspace...</p>
      </div>
    );
  }

  const worker = dashboardData?.worker || user?.workerProfile || {};
  const pendingRequests = ensureArray(dashboardData?.pendingRequests);
  const activeBookings = ensureArray(dashboardData?.activeBookings);
  const recentCompleted = ensureArray(dashboardData?.recentCompleted);
  const isAvailable = worker?.isAvailable ?? true;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      {/* 1. Worker Header & Business Verification Status */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary-900 text-white flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0">
            {(worker?.name || 'Worker').split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Good morning, {worker?.name || 'Santosh'} 👋
              </h1>
              {worker?.verificationStatus === 'VERIFIED' || worker?.verificationStatus === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-700 bg-success-50 px-2.5 py-0.5 rounded-full border border-success-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                  Verified Cooperative Member
                </span>
              ) : worker?.verificationStatus === 'REJECTED' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-danger-700 bg-danger-50 px-2.5 py-0.5 rounded-full border border-danger-200">
                  <X className="w-3.5 h-3.5 text-danger-600" />
                  Application Rejected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Verification Pending
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {worker?.primarySkill || 'Independent Artisan'} • {worker?.cooperativeName || 'Maharashtra Shramik Swavalamban Cooperative'}
            </p>
          </div>
        </div>

        {/* Quick Availability Switch */}
        <div className="flex items-center gap-3 self-start md:self-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left md:text-right">
            <p className="text-xs font-bold text-slate-800">
              {isAvailable ? 'Available for Gigs' : 'Currently Offline'}
            </p>
            <p className="text-[11px] text-slate-500">Toggle instant dispatch</p>
          </div>
          <Button
            size="sm"
            variant={isAvailable ? 'success' : 'secondary'}
            onClick={handleToggleAvailability}
            disabled={toggling}
            className="font-bold gap-1.5 shadow-xs"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
            {isAvailable ? 'Online' : 'Go Online'}
          </Button>
        </div>
      </section>

      {/* Verification Notice Banner */}
      {worker?.verificationStatus === 'PENDING' && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-900">Cooperative Federation Verification in Progress</p>
            <p className="text-amber-800">
              Your trade credentials and government ID are under review by the Pune Central Cooperative Federation Node.
              Once approved by the cooperative administrator, your profile will be listed on the public customer marketplace and you will receive FairMatch job dispatches.
            </p>
          </div>
        </div>
      )}

      {worker?.verificationStatus === 'REJECTED' && (
        <div className="bg-danger-50/80 border border-danger-200 rounded-2xl p-4 flex items-start gap-3">
          <X className="w-5 h-5 text-danger-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-danger-900">Verification Action Required</p>
            <p className="text-danger-800">
              Your application was reviewed by the cooperative administrator: {worker?.rejectionReason || 'Please resubmit updated trade certification or government ID.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. Key Business Metrics Summary */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-xs space-y-1 bg-white">
          <p className="text-xs font-semibold text-slate-500">Total Earnings (Floor Wages)</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(dashboardData?.stats?.totalEarnings || 4280)}
          </p>
          <p className="text-[11px] text-success-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Direct Bank Credit
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-xs space-y-1 bg-white">
          <p className="text-xs font-semibold text-slate-500">Welfare Fund Balance</p>
          <p className="text-xl sm:text-2xl font-black text-primary-900 tracking-tight">
            {formatINR(worker?.welfareStatus?.welfareFundContribution || 1500)}
          </p>
          <p className="text-[11px] text-primary-800 font-medium">
            Medical & Pension Shield
          </p>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-xs space-y-1 bg-white">
          <p className="text-xs font-semibold text-slate-500">Customer Rating</p>
          <div className="flex items-center gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">
              {worker?.rating?.toFixed(1) || '4.9'}
            </span>
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">{worker?.reviewCount || 58} verified reviews</p>
        </Card>

        <Card className="p-4 sm:p-5 border-slate-200/90 shadow-xs space-y-1 bg-white">
          <p className="text-xs font-semibold text-slate-500">Completed Jobs</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {worker?.completedJobs || 12}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">100% Floor Compliant</p>
        </Card>
      </section>

      {/* 3. New Opportunities (Gig Requests) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>New Opportunities</span>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-900 text-white">
                  {pendingRequests.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500">Nearby requests matched via FairMatch workload balancing</p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-slate-200 p-6 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success-600 mx-auto" />
            <p className="text-sm font-bold text-slate-800">You're all caught up!</p>
            <p className="text-xs text-slate-500">New matching service requests in your area will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((booking) => (
              <Card key={booking._id} className="p-5 border-slate-200 shadow-xs bg-white flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-primary-900 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-200">
                        ⚡ FairMatch Suitable
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1.5">{booking.category || 'Home Service'}</h4>
                    </div>
                    <span className="text-sm font-black text-slate-900">{formatINR(booking.amount || 299)}</span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">"{booking.requirement || 'Service requested'}"</p>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {booking.customerLocation || 'Kothrud, Pune'} (~2.1 km)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {booking.timeSlot || 'Today • 4:00 PM'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAcceptBooking(booking)}
                    className="flex-1 font-bold gap-1"
                  >
                    <Check className="w-4 h-4" /> Accept Job
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeclineBooking(booking)}
                    className="font-semibold text-slate-600 gap-1"
                  >
                    <X className="w-4 h-4" /> Decline
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 4. Today's Work / Active Bookings */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">Today's Work & Active Bookings</h2>
        {activeBookings.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-slate-200 p-6 space-y-1">
            <Clock className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700">No in-progress jobs right now.</p>
            <p className="text-[11px] text-slate-400">Accepted requests will move here for live status updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                userRole="WORKER"
                onStartService={handleStartService}
                onCompleteService={handleCompleteService}
                onViewInvoice={setSelectedInvoiceBooking}
              />
            ))}
          </div>
        )}
      </section>

      {/* Digital Tax Invoice View Modal */}
      {selectedInvoiceBooking && (
        <DigitalInvoice
          booking={selectedInvoiceBooking}
          onClose={() => setSelectedInvoiceBooking(null)}
        />
      )}
    </div>
  );
}

export default WorkerDashboard;
