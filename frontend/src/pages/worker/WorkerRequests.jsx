import React, { useState, useEffect } from 'react';
import { bookingApi } from '../../services/api';
import { BookingCard } from '../../components/BookingCard';
import { toast } from 'sonner';
import { Clock, CheckCircle2, Play, AlertCircle } from 'lucide-react';

export function WorkerRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('PENDING');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingApi.getWorkerBookings();
      setBookings(res.data || []);
    } catch (err) {
      toast.error('Failed to load worker requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'ACCEPTED');
      toast.success(`Accepted request #${booking.bookingId}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to accept request.');
    }
  };

  const handleDecline = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'DECLINED');
      toast.info(`Declined request #${booking.bookingId}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to decline request.');
    }
  };

  const handleStartService = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'IN_PROGRESS');
      toast.success('Service marked as In-Progress (Arrived on site)!');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to start service.');
    }
  };

  const handleCompleteService = async (booking) => {
    try {
      await bookingApi.updateStatus(booking._id, 'COMPLETED');
      toast.success('Service marked as Completed! Direct credit scheduled.');
      fetchBookings();
    } catch (err) {
      toast.error('Failed to complete service.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'PENDING') return b.status === 'REQUESTED';
    if (activeTab === 'ACTIVE') return b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'ALL') return true;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Job Requests & Service Workflow
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accept incoming bookings, manage active field jobs, and complete tasks
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl self-start sm:self-auto">
          {[
            { id: 'PENDING', label: 'Pending Requests' },
            { id: 'ACTIVE', label: 'Active Jobs' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'ALL', label: 'All History' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading service requests...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Clock className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No requests in this view</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Stay active and available to receive nearby FairMatch requests.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((bk) => (
            <BookingCard
              key={bk._id}
              booking={bk}
              isWorkerView={true}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onStartService={handleStartService}
              onCompleteService={handleCompleteService}
            />
          ))}
        </div>
      )}
    </div>
  );
}
