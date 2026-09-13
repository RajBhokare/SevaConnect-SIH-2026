import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './StatusBadge';
import { PriceBreakdown } from './PriceBreakdown';
import { formatINR, formatDate } from '../lib/utils';
import {
  FileText,
  Printer,
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Phone
} from 'lucide-react';

export function DigitalInvoice({ booking, onClose }) {
  if (!booking) return null;

  const baseRate = booking.amount ? Math.max(0, booking.amount - 74) : 250;
  const invoiceNumber = `INV-${booking.bookingId || String(booking._id).slice(-6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-xl bg-white shadow-2xl rounded-3xl overflow-hidden my-6 border-slate-200">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-success-400" />
            <h3 className="font-bold text-base">Digital Tax Invoice & Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="text-slate-200 hover:text-white hover:bg-slate-800 text-xs gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6 text-left text-slate-800 max-h-[80vh] overflow-y-auto">
          {/* Cooperative Header & Invoice Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-success-800 bg-success-50 px-2.5 py-1 rounded-full border border-success-200 w-fit mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                Cooperative Certified
              </div>
              <h2 className="text-xl font-black text-slate-900">SevaConnect</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Maharashtra Shramik Swavalamban Cooperative Federation
              </p>
              <p className="text-[11px] text-slate-400">SIH 2026 • PS 26089 Registered Platform</p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs font-mono font-bold text-primary-800 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200 inline-block">
                {invoiceNumber}
              </span>
              <p className="text-xs text-slate-500">Date: {formatDate(booking.createdAt || new Date())}</p>
              <div className="mt-1">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          {/* Customer & Worker Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div className="space-y-1.5">
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Customer Details</p>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-primary-700" /> {booking.customerName || 'Customer'}
              </p>
              {booking.customerPhone && (
                <p className="text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {booking.customerPhone}
                </p>
              )}
              <p className="text-slate-600 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="truncate">{booking.location || 'Customer Address'}</span>
              </p>
            </div>

            <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Service Artisan</p>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-primary-700" /> {booking.workerName || 'Assigned Artisan'}
              </p>
              <p className="text-slate-600 font-medium">{booking.serviceTitle || booking.serviceCategory}</p>
              <p className="text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {booking.date} ({booking.timeSlot})
              </p>
            </div>
          </div>

          {/* Itemized Price Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Itemized Bill of Service</h4>
            <PriceBreakdown
              baseRate={baseRate}
              isEmergency={booking.isEmergency}
              className="bg-white border-slate-200 shadow-none p-4"
            />
          </div>

          {/* Payment & Settlement Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-success-50/70 border border-success-200 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success-600" />
              <div>
                <p className="font-bold text-success-900">
                  {booking.paymentStatus === 'PAID'
                    ? 'Payment Settled via Cooperative Escrow'
                    : booking.paymentStatus === 'CASH_ON_SERVICE'
                    ? 'Cash Settlement on Service Completion'
                    : 'Payment Awaiting Settlement'}
                </p>
                <p className="text-[11px] text-success-700">
                  Direct worker compensation + verified social welfare credit
                </p>
              </div>
            </div>
            <span className="font-mono font-bold text-sm text-success-900">{formatINR(booking.amount)}</span>
          </div>

          {/* Footer Close */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose} className="font-semibold text-xs">
              Close Receipt
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
