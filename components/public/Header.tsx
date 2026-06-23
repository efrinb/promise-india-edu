'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/colleges', label: 'Colleges' },
  { href: '/admission-process', label: 'Admission Process' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

interface HeaderProps {
  phone?: string | null;
}

export function Header({ phone = '+91 98765 43210' }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-lg font-bold text-[#001b4d] leading-tight" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Promise India<br />
              <span className="text-xs font-semibold text-[#d9a441] tracking-wide">Education Consultancy</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#001b4d] font-bold border-b-2 border-[#d9a441] rounded-none pb-[6px]'
                      : 'text-gray-600 hover:text-[#001b4d]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: phone + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${phone?.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm font-semibold text-[#001b4d] hover:text-[#d9a441] transition-colors"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <Link
              href="/contact?type=consultation&source=navbar"
              className="bg-[#d9a441] text-[#001b4d] px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#c4922e] transition-colors shadow-sm"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#001b4d] hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#f0f3ff] text-[#001b4d] font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#001b4d]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <a
                  href={`tel:${phone?.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#001b4d]"
                >
                  <Phone className="h-4 w-4" />
                  {phone}
                </a>
                <Link
                  href="/contact?type=consultation&source=navbar"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-[#d9a441] text-[#001b4d] px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#c4922e] transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}