import React, { useState, useEffect } from 'react';
import { workerApi } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  ShieldCheck,
  HeartHandshake,
  Award,
  IndianRupee,
  Activity,
  Umbrella,
  FileCheck,
  Building,
  CheckCircle2,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export function WorkerWelfare() {
  const [welfareData, setWelfareData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWelfare();
  }, []);

  const fetchWelfare = async () => {
    try {
      setLoading(true);
      const res = await workerApi.getWelfare();
      setWelfareData(res.data);
    } catch (err) {
      toast.error('Failed to load welfare records.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading cooperative welfare records...</p>
      </div>
    );
  }

  const welfare = welfareData?.welfareStatus || {};
  const benefits = welfareData?.benefits || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 mb-2">
          <HeartHandshake className="w-4 h-4" />
          Welfare & Insurance Integration Ready
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Independent Worker Welfare & Social Security Layer
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Worker welfare information and future cooperative insurance integration layer under Ministry of Cooperation guidelines.
        </p>
      </div>

      {/* Cooperative Identity Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold">
              Affiliated Cooperative Society
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              {welfareData?.cooperativeName || 'Maharashtra Shramik Swavalamban Cooperative'}
            </h2>
            <p className="text-xs text-slate-300">
              Member ID: <strong className="text-white">{welfareData?.cooperativeMemberId || 'MSSC-4092'}</strong> • Registered under Maharashtra Cooperative Societies Act
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/20 self-start sm:self-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            <span className="text-xs font-bold text-white">KYC Verified Member</span>
          </div>
        </div>
      </div>

      {/* Welfare Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Accident Insurance</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md">
                ACTIVE
              </span>
            </div>
            <p className="text-sm font-bold text-slate-900">
              {welfare.insurancePolicy || 'PM-SYM / Shramik Suraksha #7782'}
            </p>
            <p className="text-[11px] text-slate-500">
              Comprehensive 24x7 on-duty & off-duty accidental safety cover.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Welfare Fund Balance</span>
              <Umbrella className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700">
              {formatINR(welfare.welfareFundContribution || 3850)}
            </p>
            <p className="text-[11px] text-slate-500">
              Auto-accumulated from completed jobs for healthcare & tool loans.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Direct Gig Earnings</span>
              <IndianRupee className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">
              {formatINR(welfare.totalEarnings || 34200)}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Payout (Zero commission cut)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Welfare Benefits Roster */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          Active Cooperative Benefits & Entitlements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b, idx) => (
            <Card key={idx} className="border-slate-200/90 shadow-xs">
              <CardContent className="p-5 flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                  <p className="text-xs text-brand-700 font-semibold">{b.coverage}</p>
                  <p className="text-[11px] text-slate-500">
                    Backed by District Cooperative Social Security Reserve
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200">
                  {b.status}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Transparency Note */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
        <span>
          <strong>Cooperative Ownership Guarantee:</strong> All welfare contributions are transparently governed by your elected district worker board. Unlike corporate gig platforms, no commissions are deducted from your base hourly rate.
        </span>
      </div>
    </div>
  );
}
