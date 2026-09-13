import React from 'react';
import { formatINR } from '../lib/utils';
import { HeartHandshake } from 'lucide-react';

export function PriceBreakdown({ baseRate = 299, isEmergency = false, className = '' }) {
  const serviceCharge = Number(baseRate) || 299;
  const visitCharge = 49;
  const welfareContribution = 25;
  const emergencySurcharge = isEmergency ? 100 : 0;
  const totalAmount = serviceCharge + visitCharge + welfareContribution + emergencySurcharge;

  return (
    <div className={`p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5 text-left ${className}`}>
      <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
        <span>Itemized Cooperative Price Breakdown</span>
        <span className="text-[10px] text-success-800 bg-success-50 px-2 py-0.5 rounded border border-success-200">
          Fair Pricing
        </span>
      </div>

      <div className="space-y-1.5 text-slate-600">
        <div className="flex items-center justify-between">
          <span>Service Base Rate</span>
          <span className="font-semibold text-slate-900">{formatINR(serviceCharge)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Standard Visiting & Safety Charge</span>
          <span className="font-semibold text-slate-900">{formatINR(visitCharge)}</span>
        </div>

        <div className="flex items-center justify-between text-success-800 bg-success-50/80 px-2 py-1 rounded-lg border border-success-100">
          <span className="flex items-center gap-1 font-medium">
            <HeartHandshake className="w-3.5 h-3.5 text-success-600" />
            Cooperative Worker Welfare Fund
          </span>
          <span className="font-bold">+{formatINR(welfareContribution)}</span>
        </div>

        {isEmergency && (
          <div className="flex items-center justify-between text-danger-700 font-semibold">
            <span>Priority Emergency Surcharge</span>
            <span>+{formatINR(emergencySurcharge)}</span>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-slate-900 block">Total Payable</span>
          <span className="text-[10px] text-slate-400">Includes all taxes & cooperative dues</span>
        </div>
        <span className="text-base font-black text-primary-800">{formatINR(totalAmount)}</span>
      </div>
    </div>
  );
}
