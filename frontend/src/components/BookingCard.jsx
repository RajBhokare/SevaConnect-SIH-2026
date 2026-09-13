import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { StatusBadge } from './StatusBadge';
import { formatINR, formatDate } from '../lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  AlertTriangle,
  CreditCard,
  Star,
  CheckCircle2,
  FileText,
  Navigation,
  Check
} from 'lucide-react';

const STATUS_STEPS = ['REQUESTED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'];

export function BookingCard({
  booking,
  userRole = 'CUSTOMER',
  isWorkerView = false,
  onAccept,
  onDecline,
  onStartService,
  onCompleteService,
  onPay,
  onRate,
  onCancel,
  onViewInvoice
}) {
  if (!booking) return null;

  const isWorker = userRole === 'WORKER' || isWorkerView === true;
  const isEmergency = booking.isEmergency;
  const currentStepIndex = STATUS_STEPS.indexOf(booking.status);
  const isPaid = booking.paymentStatus === 'PAID' || booking.paymentSettled === true;
  const isRated = booking.isRated === true || booking.rated === true;

  return (
    <Card className={`overflow-hidden transition-all bg-white border-slate-200/90 shadow-xs flex flex-col justify-between text-left ${isEmergency ? 'border-red-300' : ''}`}>
      {/* Emergency Header Strip */}
      {isEmergency && (
        <div className="bg-danger-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            EMERGENCY PRIORITY SOS
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider">Fast-track Dispatch</span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header: Service Category & Status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>#{booking.bookingId || String(booking._id).slice(-6).toUpperCase()}</span>
              <span>•</span>
              <span>{formatDate(booking.createdAt || new Date())}</span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-0.5">
              {booking.serviceTitle || `${booking.category || booking.serviceCategory || 'Home'} Service`}
            </h4>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Clean Status Timeline (Requested -> Accepted -> In Progress -> Completed) */}
        {booking.status !== 'CANCELLED' && booking.status !== 'DECLINED' && (
          <div className="py-2">
            <div className="grid grid-cols-4 gap-1 items-center">
              {STATUS_STEPS.map((st, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;
                return (
                  <div key={st} className="space-y-1 text-center">
                    <div className={`h-1.5 rounded-full transition-all ${
                      isPassed ? 'bg-success-600' : 'bg-slate-200'
                    }`} />
                    <p className={`text-[10px] truncate font-semibold ${
                      isCurrent ? 'text-slate-900 font-bold' : isPassed ? 'text-success-700' : 'text-slate-400'
                    }`}>
                      {st.replace('_', ' ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Requirement Note */}
        {booking.requirement && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 text-[11px]">Requirement Note:</p>
            <p className="mt-0.5">{booking.requirement}</p>
          </div>
        )}

        {/* Counterpart Contact & Location Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 truncate">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              <strong className="text-slate-900 font-medium">{isWorker ? 'Customer: ' : 'Artisan: '}</strong>
              {isWorker ? booking.customerName : booking.workerName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{isWorker ? booking.customerPhone : booking.workerPhone}</span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{booking.location || 'Pune'}</span>
          </div>

          <div className="flex items-center gap-2 sm:col-span-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{booking.date} • {booking.timeSlot}</span>
          </div>
        </div>

        {/* Amount & Settlement Status */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Standard Service Payable:</span>
            <span className="text-base font-black text-slate-900">{formatINR(booking.amount || 299)}</span>
          </div>
          {booking.status === 'COMPLETED' && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span>Worker Payout (90% Floor): <strong className="text-success-700">{formatINR(booking.workerEarning ?? Math.round((booking.amount || 299) * 0.90))}</strong></span>
              <span>Coop Margin (10%): <strong className="text-primary-800">{formatINR(booking.commissionAmount ?? Math.round((booking.amount || 299) * 0.10))}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Badges on left */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {booking.status === 'COMPLETED' && (
            <>
              {isPaid ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success-700 bg-success-50 px-2.5 py-0.5 rounded-full border border-success-200">
                  <CheckCircle2 className="w-3 h-3 text-success-600" /> Payment Settled
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" /> Payment Pending
                </span>
              )}

              {isRated && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Rated
                </span>
              )}
            </>
          )}
        </div>

        {/* Buttons on right */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Worker Actions */}
          {isWorker && (
            <>
              {(booking.status === 'REQUESTED' || booking.status === 'PENDING') && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onDecline && onDecline(booking)}>
                    Decline
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => onAccept && onAccept(booking)} className="font-bold">
                    <Check className="w-3.5 h-3.5 mr-1" /> Accept Job
                  </Button>
                </>
              )}

              {booking.status === 'ACCEPTED' && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onStartService && onStartService(booking)} className="font-medium text-slate-700">
                    Mark In-Progress
                  </Button>
                  <Button size="sm" variant="success" onClick={() => onCompleteService && onCompleteService(booking)} className="font-bold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" /> Complete & Done
                  </Button>
                </>
              )}

              {booking.status === 'IN_PROGRESS' && (
                <Button size="sm" variant="success" onClick={() => onCompleteService && onCompleteService(booking)} className="font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" /> Mark Service Completed
                </Button>
              )}

              {booking.status === 'COMPLETED' && (
                <Button size="sm" variant="outline" onClick={() => onViewInvoice && onViewInvoice(booking)} className="font-semibold text-slate-700">
                  <FileText className="w-3.5 h-3.5 mr-1" /> View Invoice
                </Button>
              )}
            </>
          )}

          {/* Customer Actions */}
          {!isWorker && (
            <>
              {(booking.status === 'REQUESTED' || booking.status === 'PENDING') && (
                <Button size="sm" variant="ghost" onClick={() => onCancel && onCancel(booking)} className="text-danger-600 hover:text-danger-700 font-semibold text-xs">
                  Cancel Request
                </Button>
              )}

              {booking.status === 'COMPLETED' && !isPaid && (
                <Button size="sm" variant="primary" onClick={() => onPay && onPay(booking)} className="font-bold shadow-xs">
                  <CreditCard className="w-3.5 h-3.5 mr-1" /> Settle Payment
                </Button>
              )}

              {booking.status === 'COMPLETED' && (
                <>
                  <Button size="sm" variant="outline" onClick={() => onViewInvoice && onViewInvoice(booking)} className="font-semibold text-slate-700">
                    <FileText className="w-3.5 h-3.5 mr-1" /> Tax Invoice
                  </Button>
                  {!isRated && (
                    <Button size="sm" variant="outline" onClick={() => onRate && onRate(booking)} className="font-semibold text-primary-900 border-primary-300 bg-primary-50/50 hover:bg-primary-50">
                      <Star className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" /> Rate Artisan
                    </Button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}

export default BookingCard;
