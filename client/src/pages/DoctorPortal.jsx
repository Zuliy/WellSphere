import { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  AlertTriangle,
  Pill,
  FileText,
  ExternalLink,
  Search,
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
  const [searchId, setSearchId] = useState('');
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [searchedRecords, setSearchedRecords] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearchError(null);
    setSearchLoading(true);
    setSearchedPatient(null);
    setSearchedRecords([]);

    try {
      const res = await fetch(`https://wellsphere-w7kt.onrender.com/api/records/doctor/${searchId.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch patient profile');
      }

      setSearchedPatient(data.passport);
      setSearchedRecords(data.medicalRecords || []);
    } catch (err) {
      setSearchError(err.message || 'Patient profile not found');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchId('');
    setSearchedPatient(null);
    setSearchedRecords([]);
    setSearchError(null);
  };

  // Determine which data to display
  const activePassport = searchedPatient || passport;
  const activeRecords = searchedPatient ? searchedRecords : medicalRecords;

  useEffect(() => {
    const patientId = activePassport?.patientId;
    if (patientId) {
      setAiLoading(true);
      fetch(`https://wellsphere-w7kt.onrender.com/api/ai-summary/${patientId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAiSummary(data);
          } else {
            setAiSummary(null);
          }
          setAiLoading(false);
        })
        .catch(err => {
          console.error(err);
          setAiLoading(false);
          setAiSummary(null);
        });
    } else {
      setAiSummary(null);
    }
  }, [activePassport?.patientId]);

  const initials = getInitials(activePassport?.fullName);
  const allergies = splitList(activePassport?.allergies);
  const medications = splitList(activePassport?.currentMedications);
  const conditions = splitList(activePassport?.chronicConditions);
  const age = calculateAge(activePassport?.dateOfBirth);
  const lastVisit = activeRecords[0];

  const summaryUpdated = lastVisit
    ? formatDisplayDate(lastVisit.date)
    : formatDisplayDate(activePassport?.createdAt);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[32px] font-bold leading-tight text-navy">Doctor Portal</h1>
          <p className="mt-2 text-base text-text-muted">
            Access patient records and AI-powered clinical insights.
          </p>
        </div>
      </div>

      {/* Patient Auth ID Search Box */}
      <div className="mb-10 rounded-xl border border-border bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-navy">Patient Access Verification</h2>
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Patient Auth ID (e.g. HP-AUTH-1234-ABCD)"
              className="w-full rounded-lg border border-border bg-bg-input pl-10 pr-4 py-3 text-sm text-navy placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:bg-primary/50"
          >
            {searchLoading ? 'Verifying...' : 'Verify Access'}
          </button>
          {searchedPatient && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg border border-border bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-bg-input"
            >
              Clear
            </button>
          )}
        </form>
        {searchError && (
          <p className="mt-3 text-sm font-semibold text-red-500">{searchError}</p>
        )}
        {searchedPatient && (
          <p className="mt-3 text-sm font-semibold text-success">
            ✓ Decrypted profile for patient: {searchedPatient.fullName}
          </p>
        )}
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
                <h3 className="text-lg font-bold text-navy">{activePassport?.fullName || '—'}</h3>
                <p className="text-xs font-medium tracking-wide text-text-muted">
                  PATIENT ID: {activePassport?.patientId || '—'}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-0 divide-y divide-border">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-text-muted">Blood Type</span>
                <span className="text-sm font-bold text-primary">{activePassport?.bloodType || '—'}</span>
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
                  Generated from {aiSummary?.recordsCount ?? activeRecords.length} record
                  {activeRecords.length === 1 ? '' : 's'} · Last updated {summaryUpdated}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {aiLoading ? (
                <div className="p-10 text-center text-text-muted">Generating AI Summary...</div>
              ) : aiSummary ? (
                <>
                  {aiSummary.riskFlag && (
                    <div className="rounded-lg bg-red-50 p-4 border-l-4 border-red-500 shadow-sm flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="font-bold text-red-700">CRITICAL ALERT: {aiSummary.riskFlag}</span>
                    </div>
                  )}
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-primary">Summary</h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {aiSummary.summary}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-bold text-primary">Key Health Insights</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-muted">
                      {aiSummary.healthInsights?.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm text-text-muted">AI Summary unavailable. Ensure backend is running.</p>
                </div>
              )}
            </div>
          </div>

          {/* Medical History Table */}
          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="font-bold text-navy">Medical History</h2>
            </div>
            <div className="overflow-x-auto">
              {activeRecords.length === 0 ? (
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
                    {activeRecords.map((record) => (
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
