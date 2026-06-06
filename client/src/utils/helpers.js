export function getFirstName(fullName = '') {
  return fullName.trim().split(/\s+/)[0] || '';
}

export function getInitials(fullName = '') {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function splitList(value = '') {
  return value
    .split(/[,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

export function formatDisplayDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getYearFromDate(dateString) {
  if (!dateString) return new Date().getFullYear().toString();
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return new Date().getFullYear().toString();
  return date.getFullYear().toString();
}

export function generatePatientId() {
  return `HP-${Math.floor(10000 + Math.random() * 90000)}`;
}

export function generateAuthId() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HP-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${suffix}`;
}

export function getPassportExpiry(createdAt) {
  const date = createdAt ? new Date(createdAt) : new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getSecureIdSuffix(patientId = '') {
  const digits = patientId.replace(/\D/g, '');
  return digits.slice(-4) || '0000';
}
