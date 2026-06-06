import { BadgeCheck } from 'lucide-react';

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Security', 'Support'];

export default function Footer({ variant = 'default' }) {
  return (
    <footer className="bg-footer text-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-6 py-8 md:flex-row md:items-center lg:px-8">
        <div>
          {variant === 'login' ? (
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="h-5 w-5 text-white/80" strokeWidth={1.75} />
              <p className="text-base font-bold">Health Passport AI</p>
            </div>
          ) : (
            <p className="text-base font-bold">Health Passport AI</p>
          )}
          <p className="mt-1 text-sm text-text-light">
            © 2024 Health Passport AI. Secure. Verified. Clinical.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-text-light transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
