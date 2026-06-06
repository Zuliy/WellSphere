import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Syringe,
  Calendar,
  Activity,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { useHealthPassport } from '../context/HealthPassportContext';
import {
  getFirstName,
  getInitials,
  splitList,
  formatShortDate,
  getYearFromDate,
} from '../utils/helpers';

export default function Dashboard() {
  const { passport, medicalRecords } = useHealthPassport();

  const firstName = getFirstName(passport?.fullName);
  const initials = getInitials(passport?.fullName);
  const allergies = splitList(passport?.allergies);
  const medications = splitList(passport?.currentMedications);
  const lastVisit = medicalRecords[0];

  const stats = [
    {
      icon: FileText,
      value: String(medicalRecords.length),
      label: 'MEDICAL RECORDS',
      color: 'text-primary',
    },
    {
      icon: AlertTriangle,
      value: String(allergies.length),
      label: 'ALLERGIES',
      color: 'text-red-500',
    },
    {
      icon: Syringe,
      value: '0',
      label: 'VACCINATIONS',
      color: 'text-primary',
    },
    {
      icon: Calendar,
      value: lastVisit ? formatShortDate(lastVisit.date) : '—',
      label: 'LAST VISIT',
      color: 'text-red-500',
      isDate: true,
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold leading-tight text-navy">
          Welcome Back{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="mt-2 text-base text-text-muted">
          Your health profile is up to date and secured with AI encryption.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-med-bg text-xl font-bold text-primary">
                {initials || '?'}
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy">{passport?.fullName}</h2>
                <p className="text-xs font-medium tracking-wide text-text-muted">
                  PATIENT ID: {passport?.patientId}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-0 divide-y divide-border">
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-text-muted">Blood Type</span>
                <span className="text-sm font-bold text-primary">{passport?.bloodType || '—'}</span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-text-muted">Allergies</span>
                {allergies.length > 0 ? (
                  <span className="rounded-full bg-allergy-bg px-3 py-1 text-xs font-semibold text-allergy-text">
                    {allergies[0]}
                    {allergies.length > 1 ? ` +${allergies.length - 1}` : ''}
                  </span>
                ) : (
                  <span className="text-sm text-text-muted">None listed</span>
                )}
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-text-muted">Emergency Contact</span>
                <span className="text-sm font-medium text-navy">
                  {passport?.emergencyContactName || '—'}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-5">
              <p className="text-[11px] font-semibold tracking-widest text-text-muted">
                ACTIVE MEDICATIONS
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {medications.length > 0 ? (
                  medications.map((med) => (
                    <span
                      key={med}
                      className="rounded-full bg-med-bg px-3 py-1.5 text-xs font-semibold text-med-text"
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

          <Link
            to="/add-record"
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
          >
            <PlusCircle className="h-5 w-5" />
            Add Medical Record
          </Link>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-white p-5 shadow-sm"
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} strokeWidth={1.75} />
                <p
                  className={`mt-3 font-bold text-navy ${
                    stat.isDate ? 'text-xl' : 'text-3xl'
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-semibold tracking-wider text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-8 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" strokeWidth={2} />
              <h2 className="text-lg font-bold text-navy">Health Timeline</h2>
            </div>

            {medicalRecords.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">No medical records yet.</p>
            ) : (
              <div className="relative pl-8">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

                {medicalRecords.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`relative ${index < medicalRecords.length - 1 ? 'pb-10' : ''}`}
                  >
                    <div
                      className={`absolute -left-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        index === 0 ? 'bg-primary' : 'bg-text-light'
                      }`}
                    />

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span
                          className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                            index === 0
                              ? 'bg-med-bg text-med-text'
                              : 'bg-bg-input text-text-muted'
                          }`}
                        >
                          {getYearFromDate(entry.date)}
                        </span>
                        <h3 className="mt-2 text-base font-bold text-navy">{entry.diagnosis}</h3>
                        <p className="text-sm text-text-muted">{entry.hospitalName}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary">
                        View Report
                        <ExternalLink className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
