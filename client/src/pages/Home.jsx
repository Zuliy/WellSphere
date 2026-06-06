import { Link } from 'react-router-dom';
import {
  Shield,
  Play,
  FolderOpen,
  MapPin,
  QrCode,
  Clock,
  Users,
} from 'lucide-react';
import { useHealthPassport } from '../context/HealthPassportContext';
import { getFirstName, getSecureIdSuffix } from '../utils/helpers';

const features = [
  {
    icon: FolderOpen,
    iconBg: 'bg-med-bg',
    iconColor: 'text-primary',
    title: 'Unified Medical History',
    description:
      'Access your complete medical records from all providers in one secure, centralized platform.',
  },
  {
    icon: MapPin,
    iconBg: 'bg-med-bg',
    iconColor: 'text-primary',
    title: 'AI Medical Summary',
    description:
      'Get intelligent, AI-powered summaries of your health data for faster clinical decisions.',
  },
  {
    icon: QrCode,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500',
    title: 'QR-Based Access',
    description:
      'Share your verified health identity instantly with any authorized provider via QR code.',
  },
];

const valueProps = [
  {
    icon: Clock,
    title: 'Faster Diagnosis',
    description: 'Providers access your full history instantly, reducing diagnostic delays.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption and blockchain verification protect every record.',
  },
  {
    icon: Users,
    title: 'Provider Network',
    description: 'Connected to 2,000+ medical institutions worldwide for seamless care.',
  },
];

export default function Home() {
  const { auth, passport, hasPassport } = useHealthPassport();
  const firstName = getFirstName(passport?.fullName || auth?.email?.split('@')[0] || '');
  const getStartedPath = hasPassport ? '/dashboard' : '/create-passport';

  return (
    <div>
      {/* Hero Section */}
      <section className="mx-auto max-w-[1280px] px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-med-bg px-4 py-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold tracking-wider text-primary">
                CLINICAL GRADE SECURITY
              </span>
            </div>
            {firstName && (
              <p className="mb-3 text-lg font-semibold text-primary">
                Welcome{firstName ? `, ${firstName}` : ''}!
              </p>
            )}
            <h1 className="text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Health Passport AI
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              One QR Code. One Health Identity. Anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={getStartedPath}
                className="rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
              >
                Get Started
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-med-bg px-8 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-blue-200"
              >
                <Play className="h-4 w-4 fill-primary" />
                Watch Demo
              </button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/photo-${i === 1 ? '1559839734-2b71ea197ec2' : i === 2 ? '1612349317150-e413f6a5b16d' : '1582750433449-648ed127bb23'}?w=40&h=40&fit=crop&crop=face`}
                    alt=""
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <p className="text-sm text-text-muted">
                <span className="font-semibold text-navy">+2k</span> Trusted by 2,000+ medical
                institutions worldwide.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=450&fit=crop"
              alt="Medical dashboard on tablet"
              className="w-full rounded-2xl shadow-lg"
            />
            <div className="absolute -bottom-4 -right-2 flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-lg md:-right-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-navy">Scan to access</p>
                <p className="text-[11px] text-text-muted">
                  Secure ID #{getSecureIdSuffix(passport?.patientId)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-navy">Revolutionizing Personal Health</h2>
            <p className="mx-auto mt-3 max-w-xl text-text-muted">
              A comprehensive digital health identity platform built for patients and providers.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <div
                  className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.iconBg}`}
                >
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-navy">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="mx-auto max-w-[1280px] px-6 py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-navy">Why Health Passport AI Matters</h2>
            <div className="mt-8 space-y-6">
              {valueProps.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">{item.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-end rounded-xl bg-primary p-6 text-white">
              <p className="text-lg font-bold leading-snug">98% Accuracy in Data Syncing</p>
            </div>
            <div
              className="relative flex min-h-[140px] items-end overflow-hidden rounded-xl bg-cover bg-center p-6"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1532187863486-abf9db5811ce?w=400&h=300&fit=crop)',
              }}
            >
              <div className="absolute inset-0 bg-primary/60" />
              <p className="relative text-lg font-bold text-white">Clinical Validation</p>
            </div>
            <div className="flex items-end rounded-xl bg-med-bg p-6">
              <p className="text-lg font-bold leading-snug text-primary">
                15s Average Access Time
              </p>
            </div>
            <div className="flex items-end rounded-xl bg-footer p-6">
              <p className="text-lg font-bold leading-snug text-primary-light">
                24/7 Real-time Monitoring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-[1280px] px-6 pb-20 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-light px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to own your health?</h2>
          <p className="mx-auto mt-3 max-w-lg text-blue-100">
            Join the future of healthcare and keep your medical identity in your pocket.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={getStartedPath}
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-md transition-colors hover:bg-blue-50"
            >
              Create Free Account
            </Link>
            <Link
              to="/doctor-portal"
              className="rounded-xl border-2 border-white px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              For Providers
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
