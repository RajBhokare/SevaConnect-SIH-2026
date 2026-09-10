import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { workerApi, bookingApi } from '../../services/api';
import { BookingCard } from '../../components/BookingCard';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Briefcase,
  Star,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export function WorkerDashboard() {
  const { user, setWorkerAvailability } = useAuthStore();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await workerApi.getDashboard();
      setDashboardData(res.data);
    } catch (err) {
      console.error('Error loading worker dashboard:', err);
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
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading worker dashboard...</p>
      </div>
    );
  }

  const worker = dashboardData?.worker || user?.workerProfile;
  const stats = dashboardData?.stats || {};
  const activeJob = dashboardData?.activeJob;
  const pendingRequests = dashboardData?.pendingRequests || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Welcome Header with Availability Toggle */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4" />
              Verified Cooperative Member
            </span>
            <span className="text-xs text-slate-300 font-medium">
              ID: {worker?.cooperativeMemberId || 'MSSC-4092'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Namaste, {worker?.name || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {worker?.primarySkill} Specialist • {worker?.cooperativeName || 'Maharashtra Shramik Swavalamban Cooperative'}
          </p>
        </div>

        {/* Big Availability Switch */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Work Status
            </p>
            <p className="text-sm font-extrabold text-white">
              {stats.isAvailable ? '🟢 Accepting Service Gigs' : '⚪ Offline / Resting'}
            </p>
          </div>
          <Button
            variant={stats.isAvailable ? 'coop' : 'secondary'}
            size="sm"
            onClick={handleToggleAvailability}
            disabled={toggling}
            className="font-bold"
          >
            {stats.isAvailable ? 'Go Offline' : 'Go Online'}
          </Button>
        </div>
      </div>

      {/* Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Total Earnings
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {formatINR(stats.totalEarnings || 0)}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Direct cooperative credit
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Rating & Trust
              </p>
              <div className="flex items-center gap-1 text-2xl font-black text-amber-900 mt-1">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                {stats.rating?.toFixed(1) || '4.8'}
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                {stats.reviewCount || 0} Verified Reviews
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Completed Gigs
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats.completedCount || 0}
              </p>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Lifetime Gigs Delivered
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-brand-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Pending Leads
              </p>
              <p className="text-2xl font-black text-slate-900 mt-1">
                {stats.pendingCount || 0}
              </p>
              <p className="text-[10px] text-brand-600 font-semibold mt-0.5">
                Action required
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Persistent Active Job Tracker (if currently on a job) */}
      {activeJob && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
            <h2 className="text-base font-bold text-slate-900">
              Active Job in Field
            </h2>
          </div>
          <BookingCard
            booking={activeJob}
            isWorkerView={true}
            onStartService={handleStartService}
            onCompleteService={handleCompleteService}
          />
        </section>
      )}

      {/* Pending Incoming Requests */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-600" />
            Incoming Service Requests ({pendingRequests.length})
          </h2>
          <Link
            to="/worker/requests"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            Manage all requests <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No pending customer requests at the moment. Keep your status online to receive FairMatch leads.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map((bk) => (
              <BookingCard
                key={bk._id}
                booking={bk}
                isWorkerView={true}
                onAccept={handleAcceptBooking}
                onDecline={handleDeclineBooking}
              />
            ))}
          </div>
        )}
      </section>

      {/* Worker Shortcuts Hub */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link to="/worker/welfare" className="group">
          <Card className="p-5 border-slate-200 group-hover:border-emerald-500 transition-all bg-emerald-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                  Cooperative Welfare
                </h4>
                <p className="text-[11px] text-slate-500">
                  Insurance status & benefits fund
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/worker/profile" className="group">
          <Card className="p-5 border-slate-200 group-hover:border-brand-500 transition-all bg-brand-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                  Skill & Radius Settings
                </h4>
                <p className="text-[11px] text-slate-500">
                  Edit coverage area & crafts
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/cooperative/ai-operations" className="group">
          <Card className="p-5 border-slate-200 group-hover:border-purple-500 transition-all bg-purple-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                  Cooperative AI Insights
                </h4>
                <p className="text-[11px] text-slate-500">
                  Demand forecast & rotation
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
