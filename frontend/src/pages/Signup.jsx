import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent } from '../components/ui/Card';
import { toast } from 'sonner';
import {
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export function Signup() {
  const [role, setRole] = useState('CUSTOMER'); // 'CUSTOMER' | 'WORKER'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Kothrud, Pune');
  
  // Worker-specific fields
  const [primarySkill, setPrimarySkill] = useState('Plumber');
  const [experience, setExperience] = useState('4');
  const [governmentIdRef, setGovernmentIdRef] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email || !password) {
      toast.error('Please fill in all mandatory fields.');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        name,
        phone,
        email,
        password,
        role,
        location,
        ...(role === 'WORKER' && {
          skills: [primarySkill, `${primarySkill} Maintenance`, 'General Work'],
          experience: Number(experience),
          governmentIdRef: governmentIdRef || 'GOV-AADHAAR-DEMO'
        })
      };

      const res = await authApi.signup(payload);
      setAuth(res.data.token, res.data.user);
      toast.success(`Account created! Welcome to SevaConnect, ${res.data.user.name}.`);

      if (role === 'WORKER') {
        navigate('/worker/dashboard');
      } else {
        navigate('/customer/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden shadow-md shadow-brand-500/20 mb-1 border border-slate-100 bg-white">
            <img src="/logo.png" alt="SevaConnect Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Join <span className="text-brand-600">SevaConnect</span>
          </h2>
          <p className="text-xs text-slate-500">
            Create an account to discover verified services or offer your skilled craft.
          </p>
        </div>

        {/* Role Toggle Switch */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/90 border border-slate-200/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              role === 'CUSTOMER'
                ? 'bg-white text-brand-800 shadow-subtle border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('WORKER')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              role === 'WORKER'
                ? 'bg-white text-coop-700 shadow-subtle border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            I am a Skilled Worker
          </button>
        </div>

        <Card className="border-slate-200/90 shadow-card bg-white">
          <CardContent className="p-6">
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Rahul Deshmukh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Phone Number"
                  placeholder="9822011223"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  icon={Phone}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={Mail}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={Lock}
                  required
                />
                <Input
                  label="Locality / Area"
                  placeholder="e.g. Kothrud, Pune"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  icon={MapPin}
                  required
                />
              </div>

              {/* Worker-Specific KYC & Professional Fields */}
              {role === 'WORKER' && (
                <div className="pt-3 border-t border-slate-100 space-y-3 bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Cooperative Worker Registration
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="Primary Craft / Skill"
                      value={primarySkill}
                      onChange={(e) => setPrimarySkill(e.target.value)}
                      options={[
                        { label: 'Plumber', value: 'Plumber' },
                        { label: 'Electrician', value: 'Electrician' },
                        { label: 'Carpenter', value: 'Carpenter' },
                        { label: 'Home Cleaner', value: 'Cleaner' },
                        { label: 'Painter', value: 'Painter' },
                        { label: 'Appliance Repair', value: 'Appliance Repair' }
                      ]}
                    />

                    <Input
                      label="Experience (Years)"
                      type="number"
                      min="1"
                      max="40"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                  </div>

                  <Input
                    label="Government ID / Aadhaar Ref (Stored Encrypted)"
                    placeholder="e.g. XXXX-XXXX-4092"
                    value={governmentIdRef}
                    onChange={(e) => setGovernmentIdRef(e.target.value)}
                    helperText="🔒 Strictly private. Never shared with customers."
                  />
                </div>
              )}

              <Button
                type="submit"
                variant={role === 'WORKER' ? 'coop' : 'primary'}
                size="lg"
                className="w-full font-bold shadow-md"
                isLoading={isLoading}
              >
                {role === 'WORKER' ? 'Register as Cooperative Worker' : 'Create Customer Account'}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <Link to="/login" className="text-brand-600 font-bold hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
