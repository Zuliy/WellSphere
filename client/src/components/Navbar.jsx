import { NavLink, useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Passport', path: '/passport', alsoActive: ['/add-record', '/create-passport'] },
  { label: 'Doctor Portal', path: '/doctor-portal' },
];

function isNavActive(item, pathname) {
  if (pathname === item.path) return true;
  if (item.alsoActive?.includes(pathname)) return true;
  if (item.path === '/home' && pathname === '/') return false;
  return false;
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-8">
        <NavLink to="/dashboard" className="text-lg font-bold text-primary">
          Health Passport AI
        </NavLink>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map((item) => {
            const active = isNavActive(item, pathname);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/home'}
                className={`relative pb-1 text-[15px] font-medium transition-colors ${
                  active
                    ? 'text-primary after:absolute after:bottom-[-25px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-full p-2 text-primary transition-colors hover:bg-bg-input"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-border object-cover"
          />
        </div>
      </div>

      <nav className="flex gap-6 overflow-x-auto border-t border-border px-6 py-3 md:hidden">
        {navItems.map((item) => {
          const active = isNavActive(item, pathname);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/home'}
              className={`shrink-0 border-b-2 pb-1 text-sm font-medium transition-colors ${
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-primary'
              }`}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
