import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Download,
  Share2,
  BadgeCheck,
  Fingerprint,
  Building2,
  CheckCircle2,
  Phone,
  AlertTriangle,
  Pill,
} from 'lucide-react';
import { useHealthPassport } from '../context/HealthPassportContext';
import { splitList, getPassportExpiry, getInitials } from '../utils/helpers';

export default function Passport() {
  const { passport, medicalRecords } = useHealthPassport();

  const allergies = splitList(passport?.allergies);
  const medications = splitList(passport?.currentMedications);
  const initials = getInitials(passport?.fullName);
  const issuingClinic = medicalRecords[0]?.hospitalName || 'Pending first visit';
  const qrValue = JSON.stringify({
    patientId: passport?.patientId,
    authId: passport?.authId,
    name: passport?.fullName,
    bloodType: passport?.bloodType,
  });

  const identityCards = [
    {
      icon: BadgeCheck,
      label: 'Status',
      value: 'Verified Active',
      valueColor: 'text-success',
    },
    {
      icon: Fingerprint,
      label: 'Auth ID',
      value: passport?.authId || '—',
      valueColor: 'text-navy',
    },
    {
      icon: Building2,
      label: 'Issuing Clinic',
      value: issuingClinic,
      valueColor: 'text-navy',
    },
    {
      icon: CheckCircle2,
      label: 'Verification',
      value: 'Blockchain Verified',
      valueColor: 'text-success',
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold leading-tight text-navy">Health Passport</h1>
        <p className="mt-2 text-base text-text-muted">
          Your verified digital health identity, accessible anywhere.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        {/* Digital Passport Card */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-light to-blue-400 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-semibold">Digital Health Passport</span>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-xl bg-white p-4">
                <QRCodeSVG value={qrValue} size={112} level="M" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 text-lg font-bold">
                {initials}
              </div>
              <div>
                <h2 className="text-xl font-bold">{passport?.fullName}</h2>
                <p className="text-sm text-blue-100">Patient ID: {passport?.patientId}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-5">
              <div>
                <p className="text-xs text-blue-200">Blood Type</p>
                <p className="text-lg font-bold">{passport?.bloodType || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-blue-200">Expires</p>
                <p className="text-lg font-bold">
                  {getPassportExpiry(passport?.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
            >
              <Download className="h-4 w-4" />
              Download Passport
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-white py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-bg-input"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-bold text-navy">Verified Patient Identity</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {identityCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <card.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold tracking-wider text-text-muted">
                      {card.label.toUpperCase()}
                    </span>
                  </div>
                  <p className={`mt-2 text-base font-bold ${card.valueColor}`}>{card.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-navy">Emergency Contact</h3>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-navy">
                  {passport?.emergencyContactName || '—'}
                </p>
                <p className="text-sm text-text-muted">
                  {passport?.emergencyContactPhone || '—'}
                </p>
              </div>
              <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
                Primary
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="font-bold text-navy">Allergies</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {allergies.length > 0 ? (
                allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="rounded-full bg-allergy-bg px-4 py-1.5 text-sm font-semibold text-allergy-text"
                  >
                    {allergy}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-muted">None listed</span>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-navy">Active Medications</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {medications.length > 0 ? (
                medications.map((med) => (
                  <span
                    key={med}
                    className="rounded-full bg-med-bg px-4 py-1.5 text-sm font-semibold text-med-text"
                  >
                    {med}
                  </span>
                ))
              ) : (
                <span className="text-sm text-text-muted">None listed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
