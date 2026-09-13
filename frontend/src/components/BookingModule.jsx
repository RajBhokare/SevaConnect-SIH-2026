import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { bookingApi } from '../services/api';
import { PriceBreakdown } from './PriceBreakdown';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { formatINR } from '../lib/utils';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';

const TIME_SLOTS = [
  'Morning (09:00 AM - 12:00 PM)',
  'Afternoon (01:00 PM - 04:00 PM)',
  'Evening (05:00 PM - 08:00 PM)'
];

export function BookingModule({
  worker,
  isOpen,
  onClose,
  isEmergency = false,
  onSuccess
}) {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date(Date.now() + (isEmergency ? 0 : 86400000)).toISOString().split('T')[0]
  );
  const [timeSlot, setTimeSlot] = useState(
    isEmergency ? 'Immediate (Emergency SOS)' : TIME_SLOTS[0]
  );
  const [requirement, setRequirement] = useState('');
  const [location, setLocation] = useState(user?.location || 'Flat 402, Anand Park, Kothrud, Pune');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!worker || !isOpen) return null;

  const baseRate = Number(worker.hourlyRate) || 299;
  const visitCharge = 49;
  const welfareContribution = 25;
  const emergencySurcharge = isEmergency ? 100 : 0;
  const totalAmount = baseRate + visitCharge + welfareContribution + emergencySurcharge;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in or create an account to complete your booking.');
      navigate('/login');
      return;
    }

    if (!requirement.trim() || !location.trim()) {
      toast.error('Please specify your service requirement and address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await bookingApi.createBooking({
        workerId: worker._id,
        serviceCategory: worker.primarySkill || 'Home Service',
        serviceTitle: `${isEmergency ? '[EMERGENCY] ' : ''}${worker.primarySkill || 'Home'} Service`,
        requirement,
        location,
        date,
        timeSlot,
        amount: totalAmount,
        isEmergency
      });

      const newBooking = res.data.booking;
      setConfirmedBooking(newBooking);
      toast.success(isEmergency ? 'Emergency artisan dispatched!' : 'Booking confirmed!');

      if (onSuccess) onSuccess(newBooking);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit service request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={confirmedBooking ? 'Booking Confirmed' : (isEmergency ? 'Emergency Service Dispatch' : 'Schedule Service')}
      className="max-w-2xl text-left"
    >
      {confirmedBooking ? (
        /* Confirmation State */
        <div className="space-y-6 py-2 text-slate-800">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-success-50 text-success-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Service Request Placed!</h3>
            <p className="text-xs text-slate-500">
              Booking ID: <span className="font-mono font-bold text-slate-800">{confirmedBooking.bookingId}</span>
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Artisan:</span>
              <span className="font-bold text-slate-900">{worker.name} ({worker.primarySkill})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="font-medium text-slate-900">{date} • {timeSlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="font-medium text-slate-900 truncate max-w-[240px]">{location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Standard Price:</span>
              <span className="font-bold text-primary-900 text-sm">{formatINR(totalAmount)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-success-700">REQUESTED</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              className="flex-1 font-semibold"
              onClick={() => {
                handleClose();
                navigate('/customer/bookings');
              }}
            >
              View My Bookings
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold"
              onClick={handleClose}
            >
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Form Stepper */
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Worker Brief Header */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-900 text-white font-bold text-xs flex items-center justify-center">
                {worker.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{worker.name}</p>
                <p className="text-[11px] text-slate-500">{worker.primarySkill || 'Artisan'}</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary-900">{formatINR(baseRate)}/hr standard</span>
          </div>

          {/* Service Requirement */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Describe your requirement <span className="text-danger-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="e.g. Tap leaking in kitchen sink, requires washer replacement..."
              className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
          </div>

          {/* Location & Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Service Address"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Flat / Building / Locality"
              icon={MapPin}
            />

            {!isEmergency ? (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
            ) : (
              <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 text-xs text-danger-700 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Immediate Emergency Dispatch
              </div>
            )}
          </div>

          {/* Time Slot (if not emergency) */}
          {!isEmergency && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">Time Slot</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-left ${
                      timeSlot === slot
                        ? 'bg-primary-50 border-primary-900 text-primary-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {slot.split(' ')[0]}
                    <span className="block text-[10px] text-slate-400 font-normal">{slot.split('(')[1]?.replace(')', '')}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transparent Price Breakdown */}
          <PriceBreakdown
            baseRate={baseRate}
            visitCharge={visitCharge}
            welfareContribution={welfareContribution}
            emergencySurcharge={emergencySurcharge}
            totalAmount={totalAmount}
          />

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">Payment Option (Post-Service)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                { id: 'CARD', label: 'Card / Net', icon: CreditCard },
                { id: 'CASH', label: 'Direct Cash', icon: Banknote }
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === m.id
                        ? 'bg-primary-900 text-white border-primary-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold shadow-xs mt-2"
          >
            Confirm & Place Request ({formatINR(totalAmount)})
          </Button>
        </form>
      )}
    </Modal>
  );
}

export default BookingModule;
