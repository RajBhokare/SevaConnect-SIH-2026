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
  CheckCircle,
  Play
} from 'lucide-react';

export function BookingCard({
  booking,
  isWorkerView = false,
  onAccept,
  onDecline,
  onStartService,
  onCompleteService,
  onPay,
  onRate,
  onCancel
}) {
  const isEmergency = booking.isEmergency;

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
        isEmergency ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'
      }`}
    >
      {/* Emergency Header Flag */}
      {isEmergency && (
        <div className="bg-red-600 text-white px-4 py-1.5 text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
            EMERGENCY PRIORITY BOOKING
          </span>
          <span className="text-[11px] uppercase tracking-wider font-semibold">Immediate Dispatch</span>
        </div>
      )}

      <div className="p-5">
        {/* Header: Service Title & Status */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">
                #{booking.bookingId}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">
                {formatDate(booking.createdAt)}
              </span>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-1">
              {booking.serviceTitle || booking.serviceCategory}
            </h4>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Issue / Requirement */}
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-800 mb-0.5">Requirement Details:</p>
          <p>{booking.requirement}</p>
        </div>

        {/* Counterpart Contact Info */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span className="truncate">
              <strong className="text-slate-900">
                {isWorkerView ? 'Customer: ' : 'Assigned Worker: '}
              </strong>
              {isWorkerView ? booking.customerName : booking.workerName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>
              {isWorkerView ? booking.customerPhone : booking.workerPhone}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>
              {booking.date} • {booking.timeSlot}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span className="truncate">{booking.location}</span>
          </div>
        </div>

        {/* Settlement & Amount Summary */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">Total Payable</span>
            <span className="text-base font-extrabold text-slate-900">
              {formatINR(booking.amount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {booking.paymentStatus === 'PAID' ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                Payment Settled
              </span>
            ) : booking.paymentStatus === 'CASH_ON_SERVICE' ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                Cash On Service
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Payment Pending
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Context Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2">
          {isWorkerView ? (
            /* Worker Actions */
            <>
              {booking.status === 'REQUESTED' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDecline && onDecline(booking)}
                    className="text-rose-600 hover:bg-rose-50 border-rose-200"
                  >
                    Decline
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onAccept && onAccept(booking)}
                    className="font-semibold"
                  >
                    Accept Service Request
                  </Button>
                </>
              )}

              {booking.status === 'ACCEPTED' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onStartService && onStartService(booking)}
                  className="bg-purple-600 hover:bg-purple-700 font-semibold"
                >
                  <Play className="w-3.5 h-3.5 mr-1" />
                  Start Service (On-Site)
                </Button>
              )}

              {booking.status === 'IN_PROGRESS' && (
                <Button
                  variant="coop"
                  size="sm"
                  onClick={() => onCompleteService && onCompleteService(booking)}
                  className="font-bold"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Mark Service Completed
                </Button>
              )}
            </>
          ) : (
            /* Customer Actions */
            <>
              {booking.status === 'REQUESTED' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel && onCancel(booking)}
                  className="text-slate-500 hover:text-rose-600 text-xs"
                >
                  Cancel Request
                </Button>
              )}

              {booking.status === 'COMPLETED' && booking.paymentStatus === 'PENDING' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onPay && onPay(booking)}
                  className="font-bold shadow-sm"
                >
                  <CreditCard className="w-4 h-4 mr-1.5" />
                  Pay {formatINR(booking.amount)}
                </Button>
              )}

              {booking.status === 'COMPLETED' && !booking.isRated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRate && onRate(booking)}
                  className="border-amber-300 text-amber-900 hover:bg-amber-50 font-semibold"
                >
                  <Star className="w-3.5 h-3.5 mr-1 text-amber-500 fill-amber-500" />
                  Rate & Review
                </Button>
              )}

              {booking.status === 'COMPLETED' && booking.isRated && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Feedback Submitted
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
