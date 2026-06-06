import {
  User,
  Sparkles,
  AlertTriangle,
  Pill,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useHealthPassport } from '../context/HealthPassportContext';
import {
  getInitials,
  splitList,
  calculateAge,
  formatDisplayDate,
} from '../utils/helpers';

export default function DoctorPortal() {
  const { passport, medicalRecords } = useHealthPassport();

  const initials = getInitials(passport?.fullName);
  const allergies = splitList(passport?.allergies);
  const medications = splitList(passport?.currentMedications);
  const conditions = splitList(passport?.chronicConditions);
  const age = calculateAge(passport?.dateOfBirth);
  const lastVisit = medicalRecords[0];

  const summaryUpdated = lastVisit
    ? formatDisplayDate(lastVisit.date)
    : formatDisplayDate(passport?.createdAt);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
      <div className="mb-10">
        <h1 className="text-[32px] font-bold leading-tight text-navy">Doctor Portal</h1>
        <p className="mt-2 text-base text-text-muted">
          Access patient records and AI-powered clinical insights.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr]">
        {/* Patient Information Card */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h2 className="font-bold text-navy">Patient Information</h2>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-med-bg text-xl font-bold text-primary">
                {initials || '?'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy">{passport?.fullName}</h3>
                <p className="text-xs font-medium tracking-wide text-text-muted">
                  PATIENT ID: {passport?.patientId}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-0 divide-y divide-border">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-text-muted">Blood Type</span>
                <span className="text-sm font-bold text-primary">{passport?.bloodType || '—'}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-text-muted">Age</span>
                <span className="text-sm font-medium text-navy">
                  {age !== null ? `${age} years` : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-text-muted">Last Visit</span>
                <span className="text-sm font-medium text-navy">
                  {lastVisit ? formatDisplayDate(lastVisit.date) : 'No visits recorded'}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                <span className="text-xs font-semibold tracking-wider text-text-muted">
                  ALLERGIES
                </span>
              </div>
              {allergies.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="rounded-full bg-allergy-bg px-3 py-1 text-xs font-semibold text-allergy-text"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="mt-2 inline-block text-sm text-text-muted">None listed</span>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Pill className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wider text-text-muted">
                  ACTIVE MEDICATIONS
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {medications.length > 0 ? (
                  medications.map((med) => (
                    <span
                      key={med}
                      className="rounded-full bg-med-bg px-3 py-1 text-xs font-semibold text-med-text"
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

        {/* Main Content */}
        <div className="space-y-6">
          {/* AI Medical Summary - Primary Focus */}
          <div className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-banner-bg to-white p-6 shadow-md md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">AI Medical Summary</h2>
                <p className="text-sm text-text-muted">
                  Generated from {medicalRecords.length} record
                  {medicalRecords.length === 1 ? '' : 's'} · Last updated {summaryUpdated}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-primary">Primary Conditions</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {conditions.length > 0
                    ? `Patient has documented chronic conditions: ${conditions.join(', ')}.`
                    : 'No chronic conditions documented in the patient passport.'}
                  {medicalRecords.length > 0
                    ? ` Medical history includes ${medicalRecords.length} recorded visit${medicalRecords.length === 1 ? '' : 's'}, most recently ${lastVisit?.diagnosis} at ${lastVisit?.hospitalName}.`
                    : ' No medical visits have been recorded yet.'}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-primary">Critical Alerts</h3>
                {allergies.length > 0 ? (
                  <div className="mt-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-semibold text-allergy-text">
                      {allergies.join(', ')} Allergy — Avoid related medications and substances
                    </span>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-text-muted">No critical allergy alerts on file.</p>
                )}
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="text-sm font-bold text-primary">Recommended Actions</h3>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-muted">
                  {allergies.length > 0 && (
                    <li>Verify allergy band before any antibiotic or medication prescription</li>
                  )}
                  {medications.length > 0 && (
                    <li>Review current medications: {medications.join(', ')}</li>
                  )}
                  {conditions.length > 0 && (
                    <li>Monitor chronic conditions: {conditions.join(', ')}</li>
                  )}
                  {medicalRecords.length === 0 && (
                    <li>Schedule initial clinical assessment to establish baseline records</li>
                  )}
                  {allergies.length === 0 &&
                    medications.length === 0 &&
                    conditions.length === 0 &&
                    medicalRecords.length > 0 && (
                      <li>Continue routine follow-up based on recorded visit history</li>
                    )}
                </ul>
              </div>
            </div>
          </div>

          {/* Medical History Table */}
          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="font-bold text-navy">Medical History</h2>
            </div>
            <div className="overflow-x-auto">
              {medicalRecords.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-text-muted">
                  No medical records yet.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-bg-input/50">
                      <th className="px-6 py-3 text-xs font-semibold tracking-wider text-text-muted">
                        DATE
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold tracking-wider text-text-muted">
                        DIAGNOSIS
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold tracking-wider text-text-muted">
                        PROVIDER
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold tracking-wider text-text-muted">
                        STATUS
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold tracking-wider text-text-muted">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecords.map((record) => (
                      <tr key={record.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 text-text-muted">
                          {formatDisplayDate(record.date)}
                        </td>
                        <td className="px-6 py-4 font-semibold text-navy">{record.diagnosis}</td>
                        <td className="px-6 py-4 text-text-muted">{record.hospitalName}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-primary">
                            View
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
