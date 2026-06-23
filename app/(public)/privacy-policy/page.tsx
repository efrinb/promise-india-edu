import Link from 'next/link';
import { ShieldCheck, Eye, Database, Lock, Bell, Users, Mail, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Promise Land India Education Consultancy',
  description: 'Learn how Promise Land India collects, uses, and protects your personal information when you use our education consultancy services.',
};

const sections = [
  {
    id: 'information-we-collect',
    icon: Database,
    title: 'Information We Collect',
    content: [
      {
        subtitle: 'Personal Information',
        text: 'When you use our services, register on our platform, or contact us for consultation, we may collect personal information including your full name, email address, phone number, date of birth, educational qualifications, preferred course of study, state and city of residence, and parent or guardian contact details.',
      },
      {
        subtitle: 'Usage & Technical Information',
        text: 'We automatically collect certain technical data when you visit our website, including your IP address, browser type, operating system, referring URLs, pages visited, and time spent on each page. This data is collected via cookies and similar tracking technologies to improve our website performance.',
      },
      {
        subtitle: 'Communication Records',
        text: 'If you contact us via phone, email, WhatsApp, or our consultation forms, we retain records of those communications to provide consistent support and follow-up services throughout your admission journey.',
      },
    ],
  },
  {
    id: 'how-we-use-information',
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      {
        subtitle: 'Providing Consultancy Services',
        text: 'We use your information to connect you with suitable nursing colleges, provide personalised admission guidance, assist with application and documentation processes, and follow up on your enrollment status.',
      },
      {
        subtitle: 'Communication & Support',
        text: 'We use your contact details to send important admission-related updates, respond to your queries, notify you about important deadlines, and share information about college fairs, new programs, and scholarship opportunities.',
      },
      {
        subtitle: 'Platform Improvement',
        text: 'Aggregated and anonymised usage data helps us improve the website experience, personalise content recommendations, and develop new features that better serve aspiring nursing students.',
      },
    ],
  },
  {
    id: 'data-sharing',
    icon: Users,
    title: 'Data Sharing & Disclosure',
    content: [
      {
        subtitle: 'Partner Colleges',
        text: 'With your explicit consent, we share relevant academic and contact information with our partner nursing colleges solely for the purpose of processing your admission application. We do not share your data with colleges you have not expressed interest in.',
      },
      {
        subtitle: 'Service Providers',
        text: 'We work with trusted third-party service providers for hosting, analytics, email delivery, and payment processing. These providers are contractually obligated to keep your data confidential and use it only for the specific services they provide to us.',
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required by law, court order, or governmental authority, or if we believe such disclosure is necessary to protect the rights, property, or safety of Promise Land India, our users, or the public.',
      },
    ],
  },
  {
    id: 'data-security',
    icon: Lock,
    title: 'Data Security',
    content: [
      {
        subtitle: 'Security Measures',
        text: 'We implement industry-standard security measures including SSL/TLS encryption for data transmission, access controls to limit data access to authorised personnel only, and regular security audits of our systems and databases.',
      },
      {
        subtitle: 'Data Retention',
        text: 'We retain your personal information for as long as necessary to provide our services and comply with legal obligations. If you request deletion of your account, we will remove your personal data within 30 days, except where retention is required by law.',
      },
    ],
  },
  {
    id: 'your-rights',
    icon: ShieldCheck,
    title: 'Your Rights',
    content: [
      {
        subtitle: 'Access & Correction',
        text: 'You have the right to access the personal information we hold about you, request corrections to inaccurate data, and ask for a copy of your data in a portable format.',
      },
      {
        subtitle: 'Deletion & Opt-Out',
        text: 'You may request deletion of your personal data at any time. You can also opt out of marketing communications by clicking the unsubscribe link in any email we send or by contacting us directly. Note that opting out of marketing does not affect transactional or service communications.',
      },
    ],
  },
  {
    id: 'cookies',
    icon: Bell,
    title: 'Cookies Policy',
    content: [
      {
        subtitle: 'Types of Cookies',
        text: 'We use essential cookies (required for the website to function), analytics cookies (to understand how visitors interact with our site), and preference cookies (to remember your settings and choices). We do not use cookies for cross-site advertising.',
      },
      {
        subtitle: 'Managing Cookies',
        text: 'You can control and manage cookies through your browser settings. Please note that disabling certain cookies may impact the functionality of our website. For full details, refer to your browser\'s help documentation.',
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
  const lastUpdated = 'June 24, 2025';

  return (
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* ── Hero Banner ── */}
      <section className="bg-[#001b4d] text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#d9a441] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 font-semibold uppercase tracking-wider mb-6">
            <Link href="/" className="hover:text-[#d9a441] transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#d9a441]">Privacy Policy</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#d9a441]/20 rounded-xl flex items-center justify-center border border-[#d9a441]/30">
              <ShieldCheck className="h-6 w-6 text-[#d9a441]" />
            </div>
            <span className="text-xs font-bold text-[#d9a441] uppercase tracking-[0.2em]">Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            We are committed to protecting your personal information and your right to privacy. This policy explains what information we collect and how we use it.
          </p>
          <p className="text-white/40 text-sm mt-6 font-medium">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        {/* Quick Nav */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          <h2 className="text-xs font-bold text-[#001b4d] uppercase tracking-wider mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#001b4d] hover:gap-4 transition-all group"
                >
                  <span className="w-6 h-6 rounded-full bg-[#001b4d]/5 group-hover:bg-[#d9a441]/20 flex items-center justify-center text-xs font-bold text-[#001b4d] flex-shrink-0 transition-colors">
                    {i + 1}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Introduction */}
        <div className="bg-[#001b4d] rounded-2xl p-6 sm:p-8 mb-10 text-white">
          <p className="text-white/80 leading-relaxed text-sm sm:text-base">
            Promise Land India Education Consultancy (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website{' '}
            <span className="text-[#d9a441] font-semibold">promiselandindia.com</span> and provides education consultancy services to aspiring nursing students across India. This Privacy Policy describes how we collect, use, store, and protect your personal information when you access our website or use our services. By using our platform, you agree to the collection and use of information as described in this policy.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden scroll-mt-24"
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 p-6 sm:p-8 border-b border-gray-100 bg-[#f0f3ff]">
                  <div className="w-10 h-10 bg-[#001b4d] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#001b4d]">{section.title}</h2>
                </div>

                {/* Section Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {section.content.map((block, bi) => (
                    <div key={bi}>
                      <h3 className="text-sm font-bold text-[#001b4d] mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d9a441] inline-block" />
                        {block.subtitle}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed pl-3.5">{block.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Contact Block */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#d9a441]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-[#d9a441]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001b4d] mb-1">Questions About This Policy?</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding your personal data or this Privacy Policy, please contact our data protection team.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#001b4d] text-white text-sm font-bold rounded-lg hover:bg-[#002870] transition-colors"
              >
                Contact Us <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-gray-400 text-xs mt-10">
          This policy is effective as of {lastUpdated}. We may update this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.
        </p>
      </div>
    </div>
  );
}
