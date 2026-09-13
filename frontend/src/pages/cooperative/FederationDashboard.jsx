import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { workerApi, adminApi } from '../../services/api';
import { formatINR, ensureArray } from '../../lib/utils';
import { toast } from 'sonner';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Users,
  Scale,
  FileCheck,
  MapPin,
  Flame,
  Sparkles,
  TrendingUp,
  Check,
  RefreshCw,
  Search,
  Eye,
  Briefcase,
  UserCheck,
  IndianRupee,
  Clock,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function FederationDashboard() {
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Real Database State
  const [queue, setQueue] = useState([]);
  const [overview, setOverview] = useState(null);
  const [commissionStats, setCommissionStats] = useState(null);

  // Modals & Inspection State
  const [reviewModalWorker, setReviewModalWorker] = useState(null);
  const [rejectModalWorker, setRejectModalWorker] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Certificate mismatch with government registry');

  // Verified Workers Search/Filter
  const [verifiedSearch, setVerifiedSearch] = useState('');
  const [verifiedCategory, setVerifiedCategory] = useState('All');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [queueRes, overviewRes, commissionRes] = await Promise.allSettled([
        workerApi.getAdminQueue(),
        adminApi.getOverview(),
        adminApi.getCommissionStats()
      ]);

      if (queueRes.status === 'fulfilled' && Array.isArray(queueRes.value?.data)) {
        setQueue(queueRes.value.data);
      }
      if (overviewRes.status === 'fulfilled' && overviewRes.value?.data) {
        setOverview(overviewRes.value.data);
      }
      if (commissionRes.status === 'fulfilled' && commissionRes.value?.data) {
        setCommissionStats(commissionRes.value.data);
      }
    } catch (err) {
      console.warn('Failed to load admin dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (worker) => {
    try {
      setActionInProgress(true);
      const workerId = worker._id || worker.id;
      await workerApi.verifyWorker(workerId, { status: 'VERIFIED' });
      toast.success(`Artisan ${worker.name} approved & listed on Cooperative Marketplace!`);
      if (reviewModalWorker) setReviewModalWorker(null);
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to approve worker: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalWorker) return;
    try {
      setActionInProgress(true);
      const workerId = rejectModalWorker._id || rejectModalWorker.id;
      await workerApi.verifyWorker(workerId, { status: 'REJECTED', rejectionReason });
      toast.error(`Artisan ${rejectModalWorker.name} rejected: ${rejectionReason}`);
      setRejectModalWorker(null);
      if (reviewModalWorker) setReviewModalWorker(null);
      await fetchDashboardData();
    } catch (err) {
      toast.error('Failed to reject worker: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionInProgress(false);
    }
  };

  // Derive pending vs verified workers from real database records
  const pendingWorkers = queue.filter(w => (w.verificationStatus || w.status) === 'PENDING');
  const verifiedWorkers = queue.filter(w => (w.verificationStatus || w.status) === 'VERIFIED' || (w.verificationStatus || w.status) === 'APPROVED');

  const filteredVerifiedWorkers = verifiedWorkers.filter(w => {
    const matchesCat = verifiedCategory === 'All' || (w.primarySkill && w.primarySkill.toLowerCase() === verifiedCategory.toLowerCase());
    const q = verifiedSearch.toLowerCase().trim();
    const matchesQuery = !q || (w.name && w.name.toLowerCase().includes(q)) || (w.location && w.location.toLowerCase().includes(q)) || (w.primarySkill && w.primarySkill.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const transactions = ensureArray(commissionStats?.transactions);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 text-left">
      {/* 1. Admin Header */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-50 text-primary-900 rounded-md text-xs font-bold border border-primary-200">
            <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
            Cooperative Federation Administrative Center
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Admin Dashboard & Revenue Ledger
          </h1>
          <p className="text-xs text-slate-500">
            Maharashtra Shramik Swavalamban Federation • Pune Chapter Central Node
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchDashboardData}
          disabled={loading || actionInProgress}
          className="self-start md:self-auto text-xs font-bold gap-1.5 text-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Live Data
        </Button>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1 (TOP PRIORITY): PENDING VERIFICATION */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                Pending Verification
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                pendingWorkers.length > 0
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {pendingWorkers.length > 0 ? `${pendingWorkers.length} workers awaiting review` : 'No workers awaiting review'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              New worker profiles waiting for verification before gaining customer marketplace visibility
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary-900" />
            Loading real-time pending submissions...
          </div>
        ) : pendingWorkers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">Queue is Clear!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No new worker profiles are waiting for verification. All submitted artisans have been reviewed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingWorkers.map((worker) => {
              const wId = worker._id || worker.id;
              const trade = worker.primarySkill || 'General Services';
              const exp = typeof worker.experience === 'number' ? `${worker.experience} years experience` : worker.experience;
              const locality = worker.location || 'Pune';
              const certs = Array.isArray(worker.certifications) ? worker.certifications : [trade];
              const submittedDate = worker.createdAt ? new Date(worker.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent Submission';

              return (
                <Card key={wId} className="p-5 border-amber-200 shadow-sm bg-amber-50/20 rounded-2xl flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">#{wId}</span>
                        <h4 className="text-base font-black text-slate-900 mt-0.5">{worker.name}</h4>
                        <p className="text-xs text-primary-900 font-bold">{trade} • {exp}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        PENDING VERIFICATION
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200/60">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Location:</strong> {locality}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Profile Submitted:</strong> {submittedDate}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <FileCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span><strong>Govt ID:</strong> <span className="font-mono text-[11px]">{worker.governmentIdMasked || 'UIDAI-SUBMITTED'}</span></span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      <p className="text-[11px] font-bold text-slate-700">Skills / Certifications:</p>
                      <div className="flex flex-wrap gap-1">
                        {(worker.skills || [trade]).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white rounded-md text-[11px] font-semibold text-slate-700 border border-slate-200">
                            {typeof skill === 'string' ? skill : skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewModalWorker(worker)}
                      className="w-full text-xs font-bold gap-1.5 text-primary-900 border-primary-200 hover:bg-primary-50"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review Full Profile
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={actionInProgress}
                        onClick={() => handleApprove(worker)}
                        className="flex-1 font-bold text-xs gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Worker
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionInProgress}
                        onClick={() => {
                          setRejectModalWorker(worker);
                          setRejectionReason('Certificate mismatch with government registry');
                        }}
                        className="font-semibold text-xs text-danger-600 border-danger-200 hover:bg-danger-50"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: PLATFORM OVERVIEW (REAL DB STATS) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
            Platform Overview
          </h2>
          <p className="text-xs text-slate-500">Authoritative platform metrics derived from real database records</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <Card className="p-4 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Workers</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{overview?.totalWorkers ?? queue.length}</p>
            <p className="text-[10px] text-slate-400">Registered Artisans</p>
          </Card>

          <Card className="p-4 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Verified Workers</p>
            <p className="text-2xl font-black text-success-700 tracking-tight">{overview?.verifiedWorkers ?? verifiedWorkers.length}</p>
            <p className="text-[10px] text-success-600 font-medium">Publicly Listed</p>
          </Card>

          <Card className="p-4 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Pending Review</p>
            <p className="text-2xl font-black text-amber-700 tracking-tight">{overview?.pendingVerification ?? pendingWorkers.length}</p>
            <p className="text-[10px] text-amber-600 font-medium">Awaiting Action</p>
          </Card>

          <Card className="p-4 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Customers</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{overview?.totalCustomers ?? 0}</p>
            <p className="text-[10px] text-slate-400">Active Accounts</p>
          </Card>

          <Card className="p-4 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Bookings</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">{overview?.totalBookings ?? 0}</p>
            <p className="text-[10px] text-slate-400">All Statuses</p>
          </Card>

          <Card className="p-4 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Completed Gigs</p>
            <p className="text-2xl font-black text-primary-900 tracking-tight">{overview?.completedBookings ?? 0}</p>
            <p className="text-[10px] text-primary-700 font-medium">Revenue Generating</p>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: COMMISSION OVERVIEW (10% BUSINESS MODEL) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Commission Overview
            </h2>
            <span className="px-2 py-0.5 bg-primary-100 text-primary-900 font-bold text-[10px] rounded-md border border-primary-200">
              10% Statutory Platform Fee
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Platform revenue recognized strictly upon successful service completion (Cancelled/Incomplete = ₹0)
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-xs font-semibold text-slate-500">Commission Rate</p>
            <p className="text-2xl font-black text-primary-900 tracking-tight">10%</p>
            <p className="text-[11px] text-slate-400">Cooperative Platform Split</p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white space-y-1">
            <p className="text-xs font-semibold text-slate-500">Completed Service Value</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {formatINR(commissionStats?.completedServiceValue || 0)}
            </p>
            <p className="text-[11px] text-slate-500">Gross Settled Amount</p>
          </Card>

          <Card className="p-4 sm:p-5 border-primary-200 shadow-xs bg-primary-50/40 space-y-1">
            <p className="text-xs font-bold text-primary-950">SevaConnect Commission</p>
            <p className="text-2xl font-black text-primary-900 tracking-tight">
              {formatINR(commissionStats?.commissionAmount || 0)}
            </p>
            <p className="text-[11px] text-primary-700 font-medium">10% Platform Revenue</p>
          </Card>

          <Card className="p-4 sm:p-5 border-success-200 shadow-xs bg-success-50/40 space-y-1">
            <p className="text-xs font-bold text-success-950">Worker Net Earnings</p>
            <p className="text-2xl font-black text-success-700 tracking-tight">
              {formatINR(commissionStats?.workerEarnings || 0)}
            </p>
            <p className="text-[11px] text-success-700 font-medium">90% Direct Artisan Payout</p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200 shadow-xs bg-white space-y-1 col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold text-slate-500">Completed Bookings</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight">
              {commissionStats?.completedBookingsCount || 0}
            </p>
            <p className="text-[11px] text-slate-500">Finalized Transactions</p>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: VERIFIED WORKERS DIRECTORY */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
              Verified Workers Directory
            </h2>
            <p className="text-xs text-slate-500">Approved artisans discoverable by customers on the live marketplace</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search verified artisan..."
                value={verifiedSearch}
                onChange={(e) => setVerifiedSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-900"
              />
            </div>
            <select
              value={verifiedCategory}
              onChange={(e) => setVerifiedCategory(e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-900"
            >
              <option value="All">All Crafts</option>
              <option value="Plumber">Plumber</option>
              <option value="Electrician">Electrician</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Cleaner">Cleaner</option>
              <option value="Painter">Painter</option>
              <option value="Domestic Helper">Domestic Helper</option>
            </select>
          </div>
        </div>

        {filteredVerifiedWorkers.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No verified workers match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVerifiedWorkers.map((worker) => (
              <Card key={worker._id} className="p-4 border-slate-200 shadow-xs bg-white rounded-xl flex items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{worker.name}</h4>
                    <span className="px-1.5 py-0.2 bg-success-50 text-success-700 border border-success-200 rounded text-[9px] font-bold">
                      VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-primary-900 font-semibold">{worker.primarySkill || 'Artisan'} • {worker.experience || 3} yrs</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" /> {worker.location || 'Pune'} ({worker.phone || '9822000000'})
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setReviewModalWorker(worker)}
                  className="text-xs font-semibold shrink-0"
                >
                  View Profile
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: COMPLETED BOOKINGS & COMMISSION LEDGER */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
            Completed Bookings & Commission Ledger
          </h2>
          <p className="text-xs text-slate-500">Live transaction records from completed services across the cooperative platform</p>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-1">
            <AlertCircle className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No completed bookings yet</p>
            <p className="text-slate-400">Commission revenue and transaction splits will automatically record here upon service completion.</p>
          </div>
        ) : (
          <Card className="overflow-x-auto border-slate-200 shadow-xs bg-white rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Booking ID</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Artisan</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Completed Amount</th>
                  <th className="p-3.5">Platform Commission (10%)</th>
                  <th className="p-3.5">Worker Earning (90%)</th>
                  <th className="p-3.5">Completed Date</th>
                  <th className="p-3.5">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map((tx, idx) => (
                  <tr key={tx._id || idx} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-primary-900 font-mono text-[11px]">{tx.bookingId}</td>
                    <td className="p-3.5 font-semibold text-slate-900">{tx.serviceTitle || tx.serviceCategory}</td>
                    <td className="p-3.5 text-slate-800">{tx.workerName}</td>
                    <td className="p-3.5 text-slate-600">{tx.customerName}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatINR(tx.amount)}</td>
                    <td className="p-3.5 font-bold text-primary-900">{formatINR(tx.commissionAmount)}</td>
                    <td className="p-3.5 font-bold text-success-700">{formatINR(tx.workerEarning)}</td>
                    <td className="p-3.5 text-slate-500">{tx.completedAt ? new Date(tx.completedAt).toLocaleDateString('en-IN') : 'Completed'}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-success-50 text-success-700 font-semibold rounded-full border border-success-200 text-[10px]">
                        {tx.paymentStatus === 'PAID' ? 'Settled (UPI/Card)' : 'Cash on Service'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: FULL WORKER REVIEW MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(reviewModalWorker)}
        onClose={() => setReviewModalWorker(null)}
        title="Artisan Profile & Verification Review"
        className="max-w-xl text-left"
      >
        {reviewModalWorker && (
          <div className="space-y-4 text-xs text-slate-700">
            <div className="flex items-start justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900">{reviewModalWorker.name}</h3>
                <p className="text-xs text-primary-900 font-bold mt-0.5">
                  {reviewModalWorker.primarySkill} • {reviewModalWorker.experience} years experience
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Cooperative: {reviewModalWorker.cooperativeName || 'Maharashtra Shramik Swavalamban Cooperative'}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                (reviewModalWorker.verificationStatus || reviewModalWorker.status) === 'PENDING'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-success-50 text-success-700 border border-success-200'
              }`}>
                {reviewModalWorker.verificationStatus || reviewModalWorker.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Contact Phone</span>
                <p className="font-bold text-slate-900">{reviewModalWorker.phone || '9822000000'}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Email Address</span>
                <p className="font-bold text-slate-900">{reviewModalWorker.email || 'worker@demo.com'}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Service Locality</span>
                <p className="font-bold text-slate-900">{reviewModalWorker.location || 'Pune'}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Govt ID Reference</span>
                <p className="font-mono text-xs font-bold text-slate-900">{reviewModalWorker.governmentIdMasked || 'UIDAI-VERIFIED-AUTH'}</p>
              </div>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Trade Skills & Certifications</span>
              <div className="flex flex-wrap gap-1.5">
                {(reviewModalWorker.skills || [reviewModalWorker.primarySkill]).map((s, i) => (
                  <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-800 border border-slate-200">
                    {typeof s === 'string' ? s : s.name}
                  </span>
                ))}
              </div>
            </div>

            {reviewModalWorker.bio && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Professional Statement</span>
                <p className="text-xs text-slate-600 leading-relaxed">{reviewModalWorker.bio}</p>
              </div>
            )}

            {(reviewModalWorker.verificationStatus || reviewModalWorker.status) === 'PENDING' ? (
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                <Button
                  size="sm"
                  variant="primary"
                  disabled={actionInProgress}
                  onClick={() => handleApprove(reviewModalWorker)}
                  className="flex-1 font-bold gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Approve & List Worker
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={actionInProgress}
                  onClick={() => {
                    setRejectModalWorker(reviewModalWorker);
                    setRejectionReason('Certificate mismatch with government registry');
                  }}
                  className="font-semibold text-danger-600 border-danger-200 hover:bg-danger-50"
                >
                  Reject / Request Changes
                </Button>
              </div>
            ) : (
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <Button size="sm" variant="outline" onClick={() => setReviewModalWorker(null)}>
                  Close
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: REJECTION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={Boolean(rejectModalWorker)}
        onClose={() => setRejectModalWorker(null)}
        title="Reject Artisan Application"
        className="max-w-md text-left"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p>Provide official administrative feedback for <strong>{rejectModalWorker?.name}</strong>:</p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500 text-xs text-slate-900"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => setRejectModalWorker(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" disabled={actionInProgress} onClick={handleConfirmReject} className="font-bold">
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FederationDashboard;
