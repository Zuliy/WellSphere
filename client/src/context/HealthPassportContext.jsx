import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const HealthPassportContext = createContext(null);
const API_URL = 'http://localhost:5000/api';

export function HealthPassportProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('health_passport_auth');
      return savedAuth ? JSON.parse(savedAuth) : null;
    } catch {
      return null;
    }
  });
  const [passport, setPassport] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch passport & medical records if authenticated
  useEffect(() => {
    const token = localStorage.getItem('health_passport_token');
    if (auth && token) {
      setLoading(true);
      const fetchData = async () => {
        try {
          // Fetch passport
          const passportRes = await fetch(`${API_URL}/passport`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (passportRes.ok) {
            const passportData = await passportRes.json();
            setPassport(passportData);
          }

          // Fetch medical records
          const recordsRes = await fetch(`${API_URL}/records`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (recordsRes.ok) {
            const recordsData = await recordsRes.json();
            setMedicalRecords(recordsData);
          }
        } catch (err) {
          console.error('Failed to sync health passport data:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setPassport(null);
      setMedicalRecords([]);
      setLoading(false);
    }
  }, [auth]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('health_passport_token', data.token);
    localStorage.setItem('health_passport_auth', JSON.stringify(data.user));
    setAuth(data.user);
    setPassport(data.passport);
    setMedicalRecords(data.medicalRecords || []);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    localStorage.setItem('health_passport_token', data.token);
    localStorage.setItem('health_passport_auth', JSON.stringify(data.user));
    setAuth(data.user);
    setPassport(null);
    setMedicalRecords([]);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('health_passport_token');
    localStorage.removeItem('health_passport_auth');
    setAuth(null);
    setPassport(null);
    setMedicalRecords([]);
  };

  const savePassport = async (formData) => {
    const token = localStorage.getItem('health_passport_token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/passport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to save passport');
    }

    setPassport(data);
    return data;
  };

  const addMedicalRecord = async (record) => {
    const token = localStorage.getItem('health_passport_token');
    if (!token) throw new Error('Not authenticated');

    const res = await fetch(`${API_URL}/records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(record),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to add medical record');
    }

    setMedicalRecords((prev) =>
      [data, ...prev].sort(
        (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt),
      ),
    );
    return data;
  };

  const value = useMemo(
    () => ({
      auth,
      passport,
      medicalRecords,
      loading,
      isAuthenticated: Boolean(auth?.email),
      hasPassport: Boolean(passport?.fullName),
      login,
      register,
      logout,
      savePassport,
      addMedicalRecord,
    }),
    [auth, passport, medicalRecords, loading],
  );

  return (
    <HealthPassportContext.Provider value={value}>{children}</HealthPassportContext.Provider>
  );
}

export function useHealthPassport() {
  const context = useContext(HealthPassportContext);
  if (!context) {
    throw new Error('useHealthPassport must be used within HealthPassportProvider');
  }
  return context;
}
