import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { workerApi } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent } from '../../components/ui/Card';
import { formatINR } from '../../lib/utils';
import { toast } from 'sonner';
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  ShieldCheck,
  Award,
  Lock,
  CheckCircle2,
  Save
} from 'lucide-react';

export function WorkerProfile() {
  const { user, updateUser } = useAuthStore();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(280);
  const [serviceRadius, setServiceRadius] = useState(10);
  const [bio, setBio] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await workerApi.getDashboard();
      const w = res.data.worker;
      setWorker(w);
      if (w) {
        setName(w.name || '');
        setPhone(w.phone || '');
        setLocation(w.location || '');
        setServiceArea(w.serviceArea || '');
        setSkills(w.skills ? w.skills.join(', ') : '');
        setExperience(w.experience || 3);
        setHourlyRate(w.hourlyRate || 280);
        setServiceRadius(w.serviceRadius || 10);
        setBio(w.bio || '');
      }
    } catch (err) {
      toast.error('Could not load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!worker) return;

    try {
      setSaving(true);
      const res = await workerApi.updateProfile(worker._id, {
        name,
        phone,
        location,
        serviceArea,
        skills,
        experience,
        hourlyRate,
        serviceRadius,
        bio
      });

      toast.success('Worker profile updated successfully!');
      setWorker(res.data.worker);
      if (user) {
        updateUser({ ...user, name, phone, location });
      }
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Artisan Profile & Professional Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage your skills, service localities, and cooperative verified credentials
        </p>
      </div>

      {/* Verification & Cooperative Status Strip */}
      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-emerald-950">
                KYC Verification Status: VERIFIED
              </h3>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-extrabold rounded-md uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-emerald-800">
              Cooperative: {worker?.cooperativeName || 'Maharashtra Shramik Swavalamban Cooperative'} (Member #{worker?.cooperativeMemberId || 'MSSC-4092'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Govt ID Securely Tokenized</span>
        </div>
      </div>

      {/* Profile Form */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />

              <Input
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={Phone}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Operating Base / City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                icon={MapPin}
                required
              />

              <Input
                label="Service Radius (KM)"
                type="number"
                min="1"
                max="50"
                value={serviceRadius}
                onChange={(e) => setServiceRadius(e.target.value)}
                required
              />
            </div>

            <Input
              label="Localities Covered (Comma Separated)"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              placeholder="e.g. Kothrud, Karve Nagar, Deccan, Shivajinagar"
              helperText="These localities help FairMatch route nearby customers to you."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Skills & Specialties (Comma Separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Plumber, Pipe Fitting, Tap Repair, Geyser Service"
                icon={Briefcase}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Experience (Years)"
                  type="number"
                  min="1"
                  max="40"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
                <Input
                  label="Standard Rate (₹/hr)"
                  type="number"
                  min="100"
                  max="5000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Professional Bio & Track Record
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your specialization, certifications, and years of experience..."
                className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <Button
                type="submit"
                variant="coop"
                size="md"
                className="font-bold"
                isLoading={saving}
              >
                <Save className="w-4 h-4 mr-1.5" />
                Save Profile Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
