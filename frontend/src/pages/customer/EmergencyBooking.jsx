import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { matchApi, bookingApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  Zap,
  AlertTriangle,
  Flame,
  Droplets,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';

const EMERGENCY_SERVICES = [
  {
    category: 'Plumber',
    title: 'Severe Water Leak / Pipe Burst',
    desc: 'Uncontrolled pipe rupture, main valve failure, or severe bathroom flooding.',
    icon: Droplets,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    category: 'Electrician',
    title: 'Short Circuit / Sparking / Power Loss',
    desc: 'Burning smell from MCB, total phase failure, or hazardous sparking.',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  {
    category: 'Carpenter',
    title: 'Door Jammed / Main Lock Failure',
    desc: 'Locked outside home, latch broken, or emergency lock latching issue.',
    icon: KeyRound,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  }
];

export function EmergencyBooking() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState(EMERGENCY_SERVICES[0]);
  const [emergencyDetails, setEmergencyDetails] = useState('');
  const [location, setLocation] = useState(user?.location || 'Flat 402, Anand Park, Kothrud, Pune');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedWorker, setDispatchedWorker] = useState(null);

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

      // 1. Run FairMatch with Emergency priority
      const matchRes = await matchApi.getFairMatch({
        category: selectedService.category,
        userLocation: location,
        isEmergency: true
      });

      const worker = matchRes.data.recommendedWorker || matchRes.data.rankedWorkers?.[0];
      if (!worker) {
        toast.error('No emergency worker is immediately reachable. Please try another craft or contact helpline.');
        return;
      }

      setDispatchedWorker(worker);

      // 2. Create the emergency booking
      const bkRes = await bookingApi.createBooking({
        workerId: worker._id,
        serviceCategory: selectedService.category,
        serviceTitle: `[EMERGENCY] ${selectedService.title}`,
        requirement: emergencyDetails,
        location,
        date: new Date().toISOString().split('T')[0],
        timeSlot: 'Immediate (Emergency SOS)',
        amount: (worker.hourlyRate || 300) + 100, // Emergency surcharge
        isEmergency: true
      });

      toast.success(`Emergency request dispatched to ${worker.name}!`);
      setTimeout(() => {
        navigate('/customer/bookings');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to dispatch emergency service.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Emergency Header Warning */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
          Rapid Emergency Response Protocol
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          One-Tap Emergency Artisan Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-red-100 leading-relaxed max-w-xl">
          FairMatch immediately prioritizes closest certified cooperative members with active emergency standby availability.
        </p>
      </div>

      <Card className="border-red-200/80 shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleTriggerEmergency} className="space-y-6">
            {/* Service Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Select Emergency Issue Type *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {EMERGENCY_SERVICES.map((srv) => {
                  const Icon = srv.icon;
                  const isSelected = selectedService.category === srv.category;
                  return (
                    <div
                      key={srv.category}
                      onClick={() => setSelectedService(srv)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-2 rounded-xl ${srv.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">{srv.category}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{srv.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Emergency Details */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                Describe the Breakdown / Urgency *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Main water pipe burst in the master bathroom, water entering bedroom rapidly."
                value={emergencyDetails}
                onChange={(e) => setEmergencyDetails(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Location */}
            <Input
              label="Exact Location / Flat & Building *"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={MapPin}
              required
              helperText="Artisans will be dispatched to this location."
            />

            {/* Protocol Guarantees */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Cooperative Rapid Response SLA
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Emergency requests trigger high-priority alerts to verified on-call cooperative members within 5km. Standard emergency rate applies transparently.
              </p>
            </div>

            <Button
              type="submit"
              variant="emergency"
              size="lg"
              className="w-full py-4 text-sm font-black shadow-lg shadow-red-500/20"
              isLoading={isSubmitting}
            >
              <Zap className="w-4 h-4 mr-2 fill-white" />
              Dispatch Emergency Artisan Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
