import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  RefreshCw,
  BriefcaseMedical,
  LogIn,
  Fingerprint,
} from 'lucide-react';
import Footer from '../components/Footer';
import { useHealthPassport } from '../context/HealthPassportContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useHealthPassport();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isRegister && !name.trim()) return;

    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-page">
      <div className="flex flex-1 items-center justify-center px-4 py-10 md:px-8">
        <div className="flex w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl bg-white shadow-xl md:min-h-[620px] md:flex-row">
          {/* Left branding panel */}
          <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary-light to-blue-500 p-10 text-white md:w-[45%] md:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-20">
              <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-2xl bg-white/10 blur-sm" />
              <div className="absolute bottom-20 right-0 h-32 w-56 rounded-xl bg-white/10 blur-sm" />
              <div className="absolute top-1/2 left-1/4 h-24 w-40 rounded-lg bg-white/5" />
            </div>

            <div className="relative z-10">
              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10">
                <Shield className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                Your Health,
                <br />
                Digitally Verified.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-blue-100">
                Securely manage your clinical data, immunization records, and provider access
                with enterprise-grade encryption and AI-driven insights.
              </p>
            </div>

            <div className="relative z-10 mt-10 space-y-4 md:mt-0">
              <FeaturePill icon={ShieldCheck} label="End-to-End Clinical Security" />
              <FeaturePill icon={RefreshCw} label="Real-time Provider Sync" />
            </div>
          </div>

          {/* Right login form */}
          <div className="flex w-full flex-col justify-center px-8 py-10 md:w-[55%] md:px-14 md:py-12">
            <div className="mb-8 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-primary text-primary">
                <BriefcaseMedical className="h-5 w-5" strokeWidth={2} />
              </div>
              <span className="text-lg font-bold text-primary">Health Passport AI</span>
            </div>

            <h2 className="text-3xl font-bold text-navy">
              {isRegister ? 'Create your passport' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              {isRegister ? 'Setup your secure health profile.' : 'Access your secure clinical dashboard.'}
            </p>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {isRegister && (
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-navy">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Smith"
                    required
                    className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-navy">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@email.com"
                  required
                  className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-navy placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-navy">
                    Password
                  </label>
                  {!isRegister && (
                    <a href="#" className="text-sm font-medium text-primary hover:underline">
                      Forgot Password?
                    </a>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {!isRegister && (
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-muted">Keep me securely logged in</span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark disabled:bg-primary/50"
              >
                {loading ? 'Processing...' : isRegister ? 'Register & Setup Passport' : 'Sign In to Passport'}
                <LogIn className="h-4 w-4" />
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-text-light">
                  Or Continue With
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white py-3 text-sm font-medium text-navy transition-colors hover:bg-bg-input"
              >
                <Fingerprint className="h-4 w-4 text-text-muted" />
                Biometric
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white py-3 text-sm font-medium text-navy transition-colors hover:bg-bg-input"
              >
                <Shield className="h-4 w-4 text-text-muted" />
                SSO
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-text-muted">
              {isRegister ? 'Already have a Health Passport?' : 'New to Health Passport?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="font-bold text-primary hover:underline"
              >
                {isRegister ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <Footer variant="login" />
    </div>
  );
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
