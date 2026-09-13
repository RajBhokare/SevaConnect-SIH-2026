import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { matchApi, bookingApi } from '../../services/api';
import { PriceBreakdown } from '../../components/PriceBreakdown';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { ensureArray, formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Zap,
  AlertTriangle,
  Droplets,
  KeyRound,
  ShieldCheck,
  MapPin,
  Check
} from 'lucide-react';

const EMERGENCY_SERVICES = [
  {
    category: 'Plumber',
    title: 'Water Leak / Pipe Burst',
    desc: 'Uncontrolled leak, main valve failure, or severe bathroom flooding.',
    icon: Droplets
  },
  {
    category: 'Electrician',
    title: 'Short Circuit / Sparking',
    desc: 'Burning smell from MCB, total phase failure, or hazardous sparking.',
    icon: Zap
  },
  {
    category: 'Carpenter',
    title: 'Door Jammed / Lock Failure',
    desc: 'Locked outside home, latch broken, or main lock failure.',
    icon: KeyRound
  }
];

export function EmergencyBooking() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(EMERGENCY_SERVICES[0]);
  const [emergencyDetails, setEmergencyDetails] = useState('');
  const [location, setLocation] = useState(user?.location || 'Flat 402, Anand Park, Kothrud, Pune');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTriggerEmergency = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please log in to trigger an emergency dispatch.');
      navigate('/login');
      return;
    }

    if (!emergencyDetails.trim() || !location.trim()) {
      toast.error('Please describe the emergency and confirm your address.');
      return;
    }

    try {
      setIsSubmitting(true);

      const matchRes = await matchApi.getFairMatch({
        category: selectedService.category,
        userLocation: location,
        isEmergency: true
      });

      const ranked = ensureArray(matchRes?.data?.rankedWorkers || matchRes?.data);
      const worker = matchRes?.data?.recommendedWorker || ranked[0];
      if (!worker) {
        toast.error('No emergency worker is immediately reachable. Please try another craft or contact helpline.');
        return;
      }

      const base = worker.hourlyRate || 300;
      const totalAmount = base + 49 + 25 + 100;

      await bookingApi.createBooking({
        workerId: worker._id,
        serviceCategory: selectedService.category,
        serviceTitle: `[EMERGENCY] ${selectedService.title}`,
        requirement: emergencyDetails,
        location,
        date: new Date().toISOString().split('T')[0],
        timeSlot: 'Immediate (Emergency SOS)',
        amount: totalAmount,
        isEmergency: true
      });

      toast.success(`Emergency request dispatched to ${worker.name}!`);
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch emergency service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      {/* Emergency Header */}
      <div className="bg-danger-600 text-white p-6 rounded-2xl shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" />
          Emergency Priority Service
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          Find an Emergency Worker
        </h1>
        <p className="text-xs text-red-100 leading-relaxed">
          SevaConnect prioritizes eligible verified workers based on skill, availability and close proximity.
        </p>
      </div>

      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleTriggerEmergency} className="space-y-5">
            {/* Service Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800">
                What service do you need urgently? <span className="text-danger-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {EMERGENCY_SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedService.category === srv.category;
                  return (
                    <div
                      key={srv.category}
                      onClick={() => setSelectedService(srv)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-danger-600 bg-danger-50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-danger-600" />
                        <span className="text-xs font-bold text-slate-900">{srv.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">{srv.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Details */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Immediate Requirement Description <span className="text-danger-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Main water pipe burst under bathroom sink, water flowing rapidly."
                value={emergencyDetails}
                onChange={(e) => setEmergencyDetails(e.target.value)}
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-danger-500"
              />
            </div>

            {/* Location */}
            <Input
              label="Confirm Your Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={MapPin}
              required
              helperText="Nearest available worker in this locality will be notified."
            />

            {/* Transparent Emergency Price Breakdown */}
            <PriceBreakdown baseRate={300} isEmergency={true} />

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-success-600" />
                Cooperative Fair-Dispatch Guarantee
              </div>
              <p className="text-[11px] text-slate-500">
                Dispatches certified cooperative members in your immediate area with verified government background checks.
              </p>
            </div>

            <Button
              type="submit"
              variant="emergency"
              size="lg"
              className="w-full font-bold shadow-xs py-3"
              isLoading={isSubmitting}
            >
              <Zap className="w-4 h-4 mr-2" />
              Find Emergency Worker
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EmergencyBooking;
