import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'health-passport-app-state';

const HealthPassportContext = createContext(null);

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function HealthPassportProvider({ children }) {
  const saved = loadState();

  const [auth, setAuth] = useState(saved?.auth ?? null);
  const [passport, setPassport] = useState(saved?.passport ?? null);
  const [medicalRecords, setMedicalRecords] = useState(saved?.medicalRecords ?? []);

  useEffect(() => {
    saveState({ auth, passport, medicalRecords });
  }, [auth, passport, medicalRecords]);

  const login = (email) => {
    setAuth({ email: email.trim() });
  };

  const logout = () => {
    setAuth(null);
    setPassport(null);
    setMedicalRecords([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const savePassport = (formData) => {
    const passportData = {
      ...formData,
      patientId: generatePatientId(),
      authId: generateAuthId(),
      createdAt: new Date().toISOString(),
    };
    setPassport(passportData);
    return passportData;
  };

  const addMedicalRecord = (record) => {
    const newRecord = {
      id: crypto.randomUUID(),
      ...record,
      createdAt: new Date().toISOString(),
    };
    setMedicalRecords((prev) =>
      [newRecord, ...prev].sort(
        (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
      ),
    );
    return newRecord;
  };

  const value = useMemo(
    () => ({
      auth,
      passport,
      medicalRecords,
      isAuthenticated: Boolean(auth?.email),
      hasPassport: Boolean(passport?.fullName),
      login,
      logout,
      savePassport,
      addMedicalRecord,
    }),
    [auth, passport, medicalRecords],
  );

  return (
    <HealthPassportContext.Provider value={value}>{children}</HealthPassportContext.Provider>
  );
}

function generatePatientId() {
  return `HP-${Math.floor(10000 + Math.random() * 90000)}`;
}

function generateAuthId() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HP-AUTH-${Math.floor(1000 + Math.random() * 9000)}-${suffix}`;
}

export function useHealthPassport() {
  const context = useContext(HealthPassportContext);
  if (!context) {
    throw new Error('useHealthPassport must be used within HealthPassportProvider');
  }
  return context;
}
