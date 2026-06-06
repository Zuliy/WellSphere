import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Droplets,
  AlertTriangle,
  Pill,
  HeartPulse,
  Contact,
  Save,
  IdCard,
} from 'lucide-react';
import { useHealthPassport } from '../context/HealthPassportContext';

const initialForm = {
  fullName: '',
  dateOfBirth: '',
  gender: '',
  phoneNumber: '',
  email: '',
  bloodType: '',
  allergies: '',
  currentMedications: '',
  chronicConditions: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
};

export default function CreatePassport() {
  const navigate = useNavigate();
  const { savePassport, auth, hasPassport } = useHealthPassport();
  const [form, setForm] = useState({ ...initialForm, email: auth?.email || '' });

  useEffect(() => {
    if (hasPassport) {
      navigate('/dashboard', { replace: true });
    }
  }, [hasPassport, navigate]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    savePassport(form);
    navigate('/dashboard');
  };

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <IdCard className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold tracking-widest text-primary">
            PASSPORT SETUP
          </span>
        </div>
        <h1 className="text-[32px] font-bold leading-tight text-navy">Create Health Passport</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-muted">
          Enter your personal and medical information to generate your secure digital health
          passport. This data is encrypted end-to-end.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-border bg-white p-6 shadow-sm md:p-8">
          <SectionTitle title="Personal Information" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field
              label="Full Name"
              icon={User}
              value={form.fullName}
              onChange={updateField('fullName')}
              placeholder="e.g. John Smith"
              required
            />
            <Field
              label="Date of Birth"
              icon={Calendar}
              type="date"
              value={form.dateOfBirth}
              onChange={updateField('dateOfBirth')}
              required
            />
            <SelectField
              label="Gender"
              icon={User}
              value={form.gender}
              onChange={updateField('gender')}
              options={['Male', 'Female', 'Non-binary', 'Prefer not to say']}
              required
            />
            <Field
              label="Phone Number"
              icon={Phone}
              type="tel"
              value={form.phoneNumber}
              onChange={updateField('phoneNumber')}
              placeholder="e.g. +1 (555) 123-4567"
              required
            />
            <Field
              label="Email"
              icon={Mail}
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="e.g. john@email.com"
              required
              className="md:col-span-2"
            />
          </div>

          <SectionTitle title="Medical Information" className="mt-10" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SelectField
              label="Blood Type"
              icon={Droplets}
              value={form.bloodType}
              onChange={updateField('bloodType')}
              options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
              required
            />
            <Field
              label="Allergies"
              icon={AlertTriangle}
              value={form.allergies}
              onChange={updateField('allergies')}
              placeholder="e.g. Penicillin, Peanuts"
            />
            <Field
              label="Current Medications"
              icon={Pill}
              value={form.currentMedications}
              onChange={updateField('currentMedications')}
              placeholder="e.g. Lisinopril 10mg daily"
            />
            <Field
              label="Chronic Conditions"
              icon={HeartPulse}
              value={form.chronicConditions}
              onChange={updateField('chronicConditions')}
              placeholder="e.g. Hypertension, Asthma"
            />
          </div>

          <SectionTitle title="Emergency Information" className="mt-10" />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Field
              label="Emergency Contact Name"
              icon={Contact}
              value={form.emergencyContactName}
              onChange={updateField('emergencyContactName')}
              placeholder="e.g. Jane Smith"
              required
            />
            <Field
              label="Emergency Contact Phone Number"
              icon={Phone}
              type="tel"
              value={form.emergencyContactPhone}
              onChange={updateField('emergencyContactPhone')}
              placeholder="e.g. +1 (555) 987-6543"
              required
            />
          </div>

          <div className="mt-8 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-primary-dark"
            >
              <Save className="h-4 w-4" />
              Create Passport
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({ title, className = '' }) {
  return (
    <h2 className={`mb-6 text-sm font-bold tracking-wide text-primary ${className}`}>{title}</h2>
  );
}

function Field({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  className = '',
}) {
  return (
    <div className={className}>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-navy">
        <Icon className="h-4 w-4 text-text-muted" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-navy placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function SelectField({ label, icon: Icon, value, onChange, options, required = false }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-navy">
        <Icon className="h-4 w-4 text-text-muted" />
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-border bg-bg-input px-4 py-3 text-sm text-navy focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      >
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
