import Link from 'next/link';
import { Facebook, Instagram, Youtube, MessageCircle, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/db';

async function getFooterData() {
  try {
    const settings = await prisma.settings.findFirst();
    const courses = await prisma.courseProgram.findMany({
      orderBy: { order: 'asc' },
    });
    return { settings, courses };
  } catch (error) {
    console.error('Failed to fetch footer data:', error);
    return { settings: null, courses: [] };
  }
}

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/colleges', label: 'Colleges' },
  { href: '/admission-process', label: 'Admission Process' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

export async function Footer() {
  const { settings, courses } = await getFooterData();

  return (
    <footer className="bg-primary pt-20 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="col-span-1 md:col-span-1">
          <p className="text-xl font-bold text-on-primary mb-1">Promise India</p>
          <p className="text-xs font-semibold text-[#d9a441] tracking-wide mb-6">Education Consultancy</p>
          <p className="text-surface-variant opacity-80 mb-6">
            Empowering the next generation of healthcare professionals with expert guidance and world-class educational opportunities.
          </p>
          <div className="flex gap-4">
            {settings?.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-on-primary/10 rounded-full flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-all text-on-primary">
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-on-primary/10 rounded-full flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-all text-on-primary">
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {settings?.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-on-primary/10 rounded-full flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-all text-on-primary">
                <Youtube className="h-5 w-5" />
              </a>
            )}
            {settings?.whatsappUrl && (
              <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-on-primary/10 rounded-full flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-all text-on-primary">
                <MessageCircle className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-on-primary font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-surface-variant opacity-80 hover:text-secondary-fixed transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-on-primary font-bold mb-6">Courses</h4>
          <ul className="space-y-4">
            {courses.slice(0, 5).map((course) => (
              <li key={course.slug}>
                <Link href={`/colleges`} className="text-surface-variant opacity-80 hover:text-secondary-fixed transition-colors">
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-on-primary font-bold mb-6">Our Offices</h4>
          <div className="space-y-4 text-surface-variant opacity-80">
            <div className="flex gap-3">
              <MapPin className="h-5 w-5 text-secondary-fixed-dim flex-shrink-0" />
              <p>{settings?.address || '123 Education Plaza, New Delhi, India 110001'}</p>
            </div>
            {settings?.phone && (
              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-secondary-fixed-dim flex-shrink-0" />
                <p>{settings.phone}</p>
              </div>
            )}
            {settings?.adminEmail && (
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-secondary-fixed-dim flex-shrink-0" />
                <p>{settings.adminEmail}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-on-primary/10 pt-10 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-surface-variant opacity-80 text-sm">
          &copy; {new Date().getFullYear()} Promise India Education Consultancy. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link href="/privacy-policy" className="text-surface-variant opacity-80 hover:text-secondary-fixed transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms-conditions" className="text-surface-variant opacity-80 hover:text-secondary-fixed transition-colors text-sm">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}