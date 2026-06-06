import { BrowserRouter } from 'react-router-dom';
import { HealthPassportProvider } from './context/HealthPassportContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <HealthPassportProvider>
        <AppRoutes />
      </HealthPassportProvider>
    </BrowserRouter>
  );
}
