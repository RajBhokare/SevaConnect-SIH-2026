import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { bookingApi, paymentApi, ratingApi } from '../../services/api';
import { BookingCard } from '../../components/BookingCard';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  CalendarCheck,
  CreditCard,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  Banknote,
  ShieldCheck
} from 'lucide-react';

export function CustomerBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Rating Modal State
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getCustomerBookings();
      setBookings(res.data || []);
    } catch (err) {
      toast.error('Failed to load your bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    if (!window.confirm('Are you sure you want to cancel this service request?')) return;
    try {
      await bookingApi.updateStatus(booking._id, 'CANCELLED');
      toast.info('Booking request cancelled.');
      fetchBookings();
    } catch (err) {
      toast.error('Could not cancel booking.');
    }
  };

  const handleOpenPayment = (booking) => {
    setSelectedBookingForPayment(booking);
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    try {
      setIsProcessingPayment(true);
      const res = await paymentApi.processPayment({
        bookingId: selectedBookingForPayment._id,
        amount: selectedBookingForPayment.amount,
        method: paymentMethod
      });

      toast.success(res.data.message || 'Payment simulated successfully!');
      setPaymentModalOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error('Payment processing failed.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleOpenRating = (booking) => {
    setSelectedBookingForRating(booking);
    setRatingStars(5);
    setRatingComment('');
    setRatingModalOpen(true);
  };

  const handleProcessRating = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingRating(true);
      const res = await ratingApi.submitRating({
        bookingId: selectedBookingForRating._id,
        stars: ratingStars,
        comment: ratingComment
      });

      toast.success('Thank you for your rating & feedback!');
      setRatingModalOpen(false);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to submit rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'REQUESTED') return b.status === 'REQUESTED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            My Service Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track service statuses, make payments, and rate verified artisans
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl self-start sm:self-auto">
          {['ALL', 'ACTIVE', 'REQUESTED', 'COMPLETED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading bookings history...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No bookings in this tab</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our service catalog to find verified cooperative artisans whenever you need assistance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((bk) => (
            <BookingCard
              key={bk._id}
              booking={bk}
              isWorkerView={false}
              onCancel={handleCancelBooking}
              onPay={handleOpenPayment}
              onRate={handleOpenRating}
            />
          ))}
        </div>
      )}

      {/* Simulated Payment Modal */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Complete Service Settlement"
      >
        {selectedBookingForPayment && (
          <form onSubmit={handleProcessPayment} className="space-y-4 text-left">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Service Rendered</p>
                <h4 className="text-sm font-bold text-slate-900">
                  {selectedBookingForPayment.serviceTitle}
                </h4>
                <p className="text-xs text-slate-600">
                  Artisan: {selectedBookingForPayment.workerName}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-semibold block">Payable Amount</span>
                <span className="text-xl font-black text-slate-900">
                  {formatINR(selectedBookingForPayment.amount)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Select Payment Mode (Simulated MVP)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI (GPay / PhonePe)', icon: QrCode },
                  { id: 'CARD', label: 'Debit / Credit Card', icon: CreditCard },
                  { id: 'CASH_ON_SERVICE', label: 'Cash on Service', icon: Banknote }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-1.5 ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/50 text-brand-900'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-brand-600" />
                      <span className="text-xs font-bold leading-tight">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 text-[11px] text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <span>
                Simulated settlement: Funds are credited directly to the cooperative worker's ledger with automated insurance contribution deductions.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setPaymentModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-bold"
                isLoading={isProcessingPayment}
              >
                Pay {formatINR(selectedBookingForPayment.amount)}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Rating & Review Modal */}
      <Modal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        title="Rate & Review Artisan Service"
      >
        {selectedBookingForRating && (
          <form onSubmit={handleProcessRating} className="space-y-4 text-left">
            <div className="text-center space-y-1">
              <p className="text-xs text-slate-500">How was your service experience with</p>
              <h4 className="text-base font-bold text-slate-900">
                {selectedBookingForRating.workerName}
              </h4>
            </div>

            {/* Interactive Stars */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= ratingStars
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comments Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Feedback & Comments (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Share your experience to help fellow community members..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setRatingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="font-bold"
                isLoading={isSubmittingRating}
              >
                Submit Feedback
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
