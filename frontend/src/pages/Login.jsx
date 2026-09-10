import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { toast } from 'sonner';
import { Mail, Lock, HeartHandshake, UserCheck, Briefcase } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await authApi.login({ email, password });
      setAuth(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);

      if (res.data.user.role === 'WORKER') {
        navigate('/worker/dashboard');
      } else {
        navigate('/customer/home');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const autofillDemo = (role) => {
    if (role === 'CUSTOMER') {
      setEmail('customer@demo.com');
      setPassword('password123');
    } else {
      setEmail('worker@demo.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-500/30 mb-2">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Log in to <span className="text-brand-600">SevaConnect</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Connecting verified independent workers and valued customers across cooperative networks.
          </p>
        </div>

        {/* Demo Fast-Fill Buttons */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider text-center">
            ⚡ Quick Demo Evaluator Autofill
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => autofillDemo('CUSTOMER')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 transition-colors shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-brand-600" />
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => autofillDemo('WORKER')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-blue-100/60 border border-blue-200 rounded-xl text-xs font-semibold text-blue-900 transition-colors shadow-xs"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              Demo Worker
            </button>
          </div>
        </div>

        <Card className="border-slate-200/90 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold shadow-md shadow-brand-500/20"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                New to SevaConnect?{' '}
                <Link to="/signup" className="text-brand-600 font-bold hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
