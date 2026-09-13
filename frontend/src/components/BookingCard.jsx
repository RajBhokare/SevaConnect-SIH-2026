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

  const isWorker = userRole === 'WORKER';
  const isEmergency = booking.isEmergency;
  const currentStepIndex = STATUS_STEPS.indexOf(booking.status);

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
              <strong className="text-slate-900 font-medium">{isWorker ? 'Customer: ' : 'Worker: '}</strong>
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
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Standard Payable:</span>
          <span className="text-base font-black text-slate-900">{formatINR(booking.amount || 299)}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
        {/* Worker Actions */}
        {isWorker && (
          <>
            {booking.status === 'PENDING' && (
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
              <Button size="sm" variant="primary" onClick={() => onStartService && onStartService(booking)} className="font-bold">
                Mark Arrived & In-Progress
              </Button>
            )}

            {booking.status === 'IN_PROGRESS' && (
              <Button size="sm" variant="success" onClick={() => onCompleteService && onCompleteService(booking)} className="font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Complete
              </Button>
            )}

            {booking.status === 'COMPLETED' && (
              <Button size="sm" variant="outline" onClick={() => onViewInvoice && onViewInvoice(booking)} className="font-semibold text-slate-700">
                <FileText className="w-3.5 h-3.5 mr-1" /> View Digital Invoice
              </Button>
            )}
          </>
        )}

        {/* Customer Actions */}
        {!isWorker && (
          <>
            {booking.status === 'PENDING' && (
              <Button size="sm" variant="ghost" onClick={() => onCancel && onCancel(booking)} className="text-danger-600 hover:text-danger-700 font-semibold text-xs">
                Cancel Request
              </Button>
            )}

            {booking.status === 'COMPLETED' && !booking.paymentSettled && (
              <Button size="sm" variant="primary" onClick={() => onPay && onPay(booking)} className="font-bold">
                <CreditCard className="w-3.5 h-3.5 mr-1" /> Settle Payment
              </Button>
            )}

            {booking.status === 'COMPLETED' && (
              <>
                <Button size="sm" variant="outline" onClick={() => onViewInvoice && onViewInvoice(booking)} className="font-semibold text-slate-700">
                  <FileText className="w-3.5 h-3.5 mr-1" /> Tax Invoice
                </Button>
                {!booking.rated && (
                  <Button size="sm" variant="outline" onClick={() => onRate && onRate(booking)} className="font-semibold text-primary-900 border-primary-300">
                    <Star className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" /> Rate Artisan
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Card>
  );
}

export default BookingCard;
