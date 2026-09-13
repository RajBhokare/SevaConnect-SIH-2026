import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { AiDemandForecast } from '../../components/AiDemandForecast';
import { workerApi } from '../../services/api';
import { formatINR } from '../../lib/utils';
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
  RefreshCw
} from 'lucide-react';

const WAGE_FLOOR_BENCHMARKS = [
  { trade: 'Electrician', wageFloor: 350, marketAvg: 260, coopMargin: '+34.6%', totalHours: 1420, compliance: '100% Compliant' },
  { trade: 'Plumber', wageFloor: 300, marketAvg: 230, coopMargin: '+30.4%', totalHours: 1840, compliance: '100% Compliant' },
  { trade: 'Deep Cleaning', wageFloor: 250, marketAvg: 190, coopMargin: '+31.5%', totalHours: 2210, compliance: '100% Compliant' },
  { trade: 'Appliance Repair', wageFloor: 400, marketAvg: 300, coopMargin: '+33.3%', totalHours: 980, compliance: '100% Compliant' },
  { trade: 'Carpentry', wageFloor: 320, marketAvg: 250, coopMargin: '+28.0%', totalHours: 1150, compliance: '100% Compliant' }
];

const LOCALITIES = ['Kothrud', 'Karve Nagar', 'Shivajinagar', 'Deccan', 'Warje', 'Aundh'];
const CATEGORIES = ['Electrician', 'Plumber', 'Cleaning', 'Appliance', 'Carpentry'];

export function FederationDashboard() {
  const [activeTab, setActiveTab] = useState('QUEUE');
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('Certificate mismatch with government registry');
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await workerApi.getAdminQueue();
      if (res.data && Array.isArray(res.data)) {
        setQueue(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch queue from API:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleApprove = async (worker) => {
    try {
      setActionInProgress(true);
      const workerId = worker._id || worker.id;
      await workerApi.verifyWorker(workerId, { status: 'VERIFIED' });
      setQueue((prev) =>
        prev.map((w) => ((w._id || w.id) === workerId ? { ...w, verificationStatus: 'VERIFIED', isListed: true } : w))
      );
      toast.success(`Artisan ${worker.name} approved & listed on Cooperative Marketplace!`);
    } catch (err) {
      toast.error('Failed to approve worker: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionInProgress(false);
    }
  };

  const handleOpenReject = (worker) => {
    setSelectedWorker(worker);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedWorker) return;
    try {
      setActionInProgress(true);
      const workerId = selectedWorker._id || selectedWorker.id;
      await workerApi.verifyWorker(workerId, { status: 'REJECTED', rejectionReason });
      setQueue((prev) =>
        prev.map((w) =>
          (w._id || w.id) === workerId
            ? { ...w, verificationStatus: 'REJECTED', rejectionReason, isListed: false }
            : w
        )
      );
      toast.error(`Artisan ${selectedWorker.name} rejected: ${rejectionReason}`);
      setRejectModalOpen(false);
      setSelectedWorker(null);
    } catch (err) {
      toast.error('Failed to reject worker: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionInProgress(false);
    }
  };

  const pendingCount = queue.filter((w) => (w.verificationStatus || w.status) === 'PENDING').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      {/* 1. Federation Header */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary-50 text-primary-900 rounded-md text-xs font-bold border border-primary-200">
            <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
            Cooperative Federation Administrative Center
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Cooperative Workforce Intelligence
          </h1>
          <p className="text-xs text-slate-500">
            Maharashtra Shramik Swavalamban Federation • Pune Chapter Central Node
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs font-bold self-start md:self-auto">
          {[
            { id: 'QUEUE', label: `Verification Queue (${pendingCount})` },
            { id: 'DEMAND', label: 'Demand & Forecast' },
            { id: 'BENCHMARKS', label: 'Wage Floor Compliance' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Workforce & Demand Key Intelligence Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200/90 shadow-xs bg-white space-y-1">
          <p className="text-xs font-semibold text-slate-500">Active Workforce Pool</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">48 Artisans</p>
          <p className="text-[11px] text-success-700 font-medium">42 Verified • 31 Available</p>
        </Card>

        <Card className="p-5 border-slate-200/90 shadow-xs bg-white space-y-1">
          <p className="text-xs font-semibold text-slate-500">Peak Demand Category</p>
          <p className="text-2xl font-black text-primary-900 tracking-tight">Electrician</p>
          <p className="text-[11px] text-slate-500">92% Cluster Utilization</p>
        </Card>

        <Card className="p-5 border-slate-200/90 shadow-xs bg-white space-y-1">
          <p className="text-xs font-semibold text-slate-500">Wage Floor Margin</p>
          <p className="text-2xl font-black text-success-700 tracking-tight">+32.4%</p>
          <p className="text-[11px] text-slate-500">Above unorganized market rate</p>
        </Card>

        <Card className="p-5 border-slate-200/90 shadow-xs bg-white space-y-1">
          <p className="text-xs font-semibold text-slate-500">Social Security Pool</p>
          <p className="text-2xl font-black text-slate-900 tracking-tight">₹48,250</p>
          <p className="text-[11px] text-primary-800 font-medium">100% Policy Contribution</p>
        </Card>
      </section>

      {/* TAB 1: Verification Queue */}
      {activeTab === 'QUEUE' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Artisan Verification Queue</h2>
              <p className="text-xs text-slate-500">Verify government licenses and trade certificates before granting marketplace access</p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary-900" />
              Loading real-time verification queue...
            </div>
          ) : queue.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
              No workers currently in the queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {queue.map((worker) => {
                const wId = worker._id || worker.id;
                const status = worker.verificationStatus || worker.status || 'PENDING';
                const trade = worker.primarySkill || worker.trade || 'General Services';
                const exp = typeof worker.experience === 'number' ? `${worker.experience} Yrs Exp` : worker.experience;
                const locality = worker.location || worker.locality || 'Pune';
                const coop = worker.cooperativeName || worker.coopBranch || 'Maharashtra Shramik Swavalamban Cooperative';
                const certs = Array.isArray(worker.certifications) ? worker.certifications : [trade];

                return (
                  <Card key={wId} className="p-5 border-slate-200 shadow-xs bg-white flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">#{wId}</span>
                          <h4 className="text-sm font-bold text-slate-900 mt-0.5">{worker.name}</h4>
                          <p className="text-xs text-primary-900 font-semibold">{trade} • {exp}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          status === 'APPROVED' || status === 'VERIFIED'
                            ? 'bg-success-50 text-success-700 border border-success-200'
                            : status === 'REJECTED'
                            ? 'bg-danger-50 text-danger-700 border border-danger-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {locality} ({coop})
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <p className="text-[11px] font-bold text-slate-700">Govt ID & Certifications:</p>
                        <div className="p-2 bg-slate-50 rounded-lg text-xs space-y-0.5">
                          <div className="flex items-center justify-between font-semibold text-slate-800">
                            <span className="truncate max-w-[180px] font-mono text-[11px]">{worker.governmentIdMasked || 'UIDAI-VERIFIED-AUTH'}</span>
                            <span className="text-success-700 text-[10px]">✓ ID Verified</span>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Trade Skills: {certs.map(c => (typeof c === 'string' ? c : c.name)).join(', ')}
                          </p>
                        </div>
                        {worker.rejectionReason && (
                          <p className="text-[11px] text-danger-600 font-semibold bg-danger-50 p-2 rounded-lg border border-danger-200">
                            Reason: {worker.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>

                    {status === 'PENDING' ? (
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={actionInProgress}
                          onClick={() => handleApprove(worker)}
                          className="flex-1 font-bold"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionInProgress}
                          onClick={() => handleOpenReject(worker)}
                          className="font-semibold text-danger-600 border-danger-200"
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100 italic">
                        {status === 'VERIFIED' || status === 'APPROVED' ? '✓ Listed on Marketplace' : '✕ Application Rejected'}
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Demand & AI Forecast */}
      {activeTab === 'DEMAND' && (
        <section className="space-y-6">
          <AiDemandForecast localities={LOCALITIES} categories={CATEGORIES} />
        </section>
      )}

      {/* TAB 3: Wage Floor Benchmarks */}
      {activeTab === 'BENCHMARKS' && (
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Statutory Cooperative Wage Floor Benchmarks</h2>
            <p className="text-xs text-slate-500">Enforcing minimum dignified earnings across Maharashtra urban clusters</p>
          </div>

          <Card className="overflow-x-auto border-slate-200 shadow-xs bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Craft / Trade</th>
                  <th className="p-3.5">Cooperative Wage Floor</th>
                  <th className="p-3.5">Informal Market Average</th>
                  <th className="p-3.5">Artisan Net Margin</th>
                  <th className="p-3.5">Settled Hours</th>
                  <th className="p-3.5">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {WAGE_FLOOR_BENCHMARKS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900">{row.trade}</td>
                    <td className="p-3.5 font-black text-primary-900">{formatINR(row.wageFloor)}/hr</td>
                    <td className="p-3.5 text-slate-500 line-through">{formatINR(row.marketAvg)}/hr</td>
                    <td className="p-3.5 font-bold text-success-700">{row.coopMargin}</td>
                    <td className="p-3.5 text-slate-700">{row.totalHours} hrs</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 bg-success-50 text-success-700 font-semibold rounded-full border border-success-200 text-[10px]">
                        {row.compliance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
      )}

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Artisan Application"
        className="max-w-md text-left"
      >
        <div className="space-y-4 text-xs text-slate-700">
          <p>Provide official administrative feedback for <strong>{selectedWorker?.name}</strong>:</p>
          <textarea
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-danger-500 text-xs text-slate-900"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="outline" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" onClick={handleConfirmReject} className="font-bold">
              Confirm Rejection
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FederationDashboard;
