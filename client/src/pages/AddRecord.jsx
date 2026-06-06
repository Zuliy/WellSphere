import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  Stethoscope,
  Pill,
  FileText,
  Upload,
  Save,
  Info,
  PlusSquare,
} from 'lucide-react';
import { useHealthPassport } from '../context/HealthPassportContext';

const initialForm = {
  hospitalName: '',
  date: '',
  diagnosis: '',
  medication: '',
  notes: '',
};

export default function AddRecord() {
  const navigate = useNavigate();
  const { addMedicalRecord } = useHealthPassport();
  const [form, setForm] = useState(initialForm);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMedicalRecord(form);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <PlusSquare className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold tracking-widest text-primary">
            CLINICAL ENTRY
          </span>
        </div>
        <h1 className="text-[32px] font-bold leading-tight text-navy">
          Add Medical Record
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
          Ensure your health timeline is accurate. This data is encrypted end-to-end and
          shared only with authorized clinical partners.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field
              label="Hospital Name"
              icon={Building2}
              placeholder="e.g. Mayo Clinic, Rochester"
              value={form.hospitalName}
              onChange={updateField('hospitalName')}
              required
            />
            <Field
              label="Date of Procedure/Visit"
              icon={Calendar}
              type="date"
              value={form.date}
              onChange={updateField('date')}
              required
            />
            <Field
              label="Clinical Diagnosis"
              icon={Stethoscope}
              placeholder="e.g. Hypertension, Stage 1"
              value={form.diagnosis}
              onChange={updateField('diagnosis')}
              required
            />
            <Field
              label="Prescribed Medication"
              icon={Pill}
              placeholder="e.g. Lisinopril 10mg daily"
              value={form.medication}
              onChange={updateField('medication')}
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-navy">
              <FileText className="h-4 w-4 text-text-muted" />
              Clinical Notes &amp; Observations
            </label>
            <textarea
              rows={4}
              placeholder="Detail any specific symptoms, reactions, or follow-up instructions provided by the specialist..."
              value={form.notes}
              onChange={updateField('notes')}
              className="w-full resize-none rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-navy placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-banner-bg/50 px-6 py-12">
            <Upload className="h-10 w-10 text-primary/60" strokeWidth={1.5} />
            <p className="mt-4 text-sm font-semibold text-navy">
              Upload lab results or medical imaging
            </p>
            <p className="mt-1 text-xs text-text-muted">PDF, JPEG, or DICOM up to 50MB</p>
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-primary hover:underline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
            >
              <Save className="h-4 w-4" />
              Save Record
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 flex gap-4 rounded-xl border border-banner-border bg-banner-bg p-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-bold text-primary">Privacy Protocol</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            All clinical data is automatically verified using the Health Passport AI blockchain
            protocol. This ensures your record cannot be tampered with once saved.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, placeholder, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-navy">
        <Icon className="h-4 w-4 text-text-muted" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-navy placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        {type === 'date' && (
          <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        )}
      </div>
    </div>
  );
}
