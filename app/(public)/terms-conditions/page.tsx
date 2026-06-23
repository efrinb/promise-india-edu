import Link from 'next/link';
import { FileText, UserCheck, AlertTriangle, Scale, BookOpen, Globe, Ban, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions | Promise Land India Education Consultancy',
  description: 'Review the terms and conditions governing your use of Promise Land India\'s education consultancy services and website.',
};

const sections = [
  {
    id: 'acceptance',
    icon: UserCheck,
    title: 'Acceptance of Terms',
    content: [
      {
        subtitle: 'Agreement to Terms',
        text: 'By accessing our website at promiselandindia.com, booking a consultation, or using any of our education consultancy services, you confirm that you are at least 16 years of age and that you have read, understood, and agree to be bound by these Terms & Conditions. If you are under 18, a parent or legal guardian must accept these terms on your behalf.',
      },
      {
        subtitle: 'Changes to Terms',
        text: 'We reserve the right to modify these terms at any time. Material changes will be communicated via email to registered users or through a prominent notice on our website. Your continued use of our services after any modification constitutes your acceptance of the revised terms.',
      },
    ],
  },
  {
    id: 'services',
    icon: BookOpen,
    title: 'Our Services',
    content: [
      {
        subtitle: 'Consultancy Services',
        text: 'Promise Land India provides education consultancy services including college identification and shortlisting, admission counselling, application assistance, documentation guidance, and follow-up support. We act as an intermediary between students and nursing colleges — we do not guarantee admission to any specific college.',
      },
      {
        subtitle: 'Information Accuracy',
        text: 'We make every effort to ensure that information provided about partner colleges — including fees, facilities, and admission criteria — is accurate and up to date. However, college policies, seat availability, and fee structures may change without notice. Always verify critical details directly with the respective institution.',
      },
      {
        subtitle: 'Service Availability',
        text: 'Our services are primarily available to students seeking nursing college admissions within India. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of services.',
      },
    ],
  },
  {
    id: 'user-obligations',
    icon: UserCheck,
    title: 'User Obligations',
    content: [
      {
        subtitle: 'Accurate Information',
        text: 'You agree to provide accurate, current, and complete information when registering or submitting consultation requests. Providing false, misleading, or fraudulent information may result in disqualification from our services and may have legal consequences during the college admission process.',
      },
      {
        subtitle: 'Account Responsibility',
        text: 'You are responsible for maintaining the confidentiality of any account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorised use of your account or any other breach of security.',
      },
      {
        subtitle: 'Prohibited Conduct',
        text: 'You agree not to: (a) use our services for any unlawful purpose; (b) attempt to gain unauthorised access to our systems; (c) post or transmit harmful, offensive, or misleading content; (d) reverse engineer, decompile, or disassemble any part of our platform; or (e) use automated tools to scrape or harvest data from our website.',
      },
    ],
  },
  {
    id: 'fees-payment',
    icon: Scale,
    title: 'Fees & Payment',
    content: [
      {
        subtitle: 'Consultancy Fees',
        text: 'Our consultancy services may involve fees that are clearly communicated before you engage with any paid service. Initial counselling sessions may be offered free of charge. Detailed fee structures for application processing or premium advisory will be disclosed in writing before any payment is collected.',
      },
      {
        subtitle: 'Refund Policy',
        text: 'Consultancy service fees are generally non-refundable once services have been rendered. If a service cannot be delivered due to our fault, a full or partial refund will be considered on a case-by-case basis. Refund requests must be submitted in writing within 14 days of the service date.',
      },
      {
        subtitle: 'College Fees',
        text: 'Any fees paid directly to colleges — including tuition, hostel, or registration fees — are governed solely by the respective institution\'s policies. Promise Land India is not responsible for college fee refunds, disputes, or changes in fee structures.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: Globe,
    title: 'Intellectual Property',
    content: [
      {
        subtitle: 'Our Content',
        text: 'All content on this website — including text, graphics, logos, icons, images, audio clips, and software — is the property of Promise Land India or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.',
      },
      {
        subtitle: 'User-Submitted Content',
        text: 'By submitting reviews, testimonials, or any other content to us, you grant Promise Land India a non-exclusive, royalty-free, worldwide licence to use, publish, and display that content for promotional and operational purposes. You represent that you have the right to grant such a licence.',
      },
    ],
  },
  {
    id: 'disclaimers',
    icon: AlertTriangle,
    title: 'Disclaimers & Limitation of Liability',
    content: [
      {
        subtitle: 'No Guarantee of Admission',
        text: 'Promise Land India does not guarantee admission to any nursing college. Admission decisions are made solely by the respective institutions based on their own criteria. Our role is to assist and guide — the final decision rests with the college.',
      },
      {
        subtitle: 'Website Disclaimer',
        text: 'Our website is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.',
      },
      {
        subtitle: 'Limitation of Liability',
        text: 'To the maximum extent permitted by applicable law, Promise Land India shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising from your use of or inability to use our services, even if we have been advised of the possibility of such damages.',
      },
    ],
  },
  {
    id: 'termination',
    icon: Ban,
    title: 'Termination',
    content: [
      {
        subtitle: 'Termination by Us',
        text: 'We reserve the right to terminate or suspend your access to our services immediately and without prior notice if you breach these Terms & Conditions, engage in fraudulent activity, or if we determine, in our sole discretion, that your use of our services is harmful to other users or to us.',
      },
      {
        subtitle: 'Effect of Termination',
        text: 'Upon termination, all provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.',
      },
    ],
  },
  {
    id: 'governing-law',
    icon: Scale,
    title: 'Governing Law & Disputes',
    content: [
      {
        subtitle: 'Jurisdiction',
        text: 'These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts located in Kerala, India.',
      },
      {
        subtitle: 'Dispute Resolution',
        text: 'We encourage you to contact us first to resolve any concerns amicably. If a dispute cannot be resolved through direct communication within 30 days, either party may seek resolution through formal legal proceedings as described above.',
      },
    ],
  },
];

export default function TermsConditionsPage() {
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
            <span className="text-[#d9a441]">Terms & Conditions</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#d9a441]/20 rounded-xl flex items-center justify-center border border-[#d9a441]/30">
              <FileText className="h-6 w-6 text-[#d9a441]" />
            </div>
            <span className="text-xs font-bold text-[#d9a441] uppercase tracking-[0.2em]">Legal Document</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Please read these terms carefully before using our services. They set out your rights, responsibilities, and what you can expect from us.
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
          <ul className="grid sm:grid-cols-2 gap-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#001b4d] transition-all group"
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
            These Terms & Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the services offered by{' '}
            <span className="text-[#d9a441] font-semibold">Promise Land India Education Consultancy</span> through our website{' '}
            <span className="text-[#d9a441] font-semibold">promiselandindia.com</span> and related digital platforms. By accessing or using our services, you enter into a binding agreement with us. These Terms should be read alongside our{' '}
            <Link href="/privacy-policy" className="text-[#d9a441] underline hover:text-white transition-colors">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
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

        {/* Privacy Policy Link */}
        <div className="mt-8 bg-[#f0f3ff] rounded-2xl border border-[#001b4d]/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div>
            <h3 className="font-bold text-[#001b4d] mb-1">Also Read Our Privacy Policy</h3>
            <p className="text-gray-500 text-sm">Understand how we collect and protect your personal data.</p>
          </div>
          <Link
            href="/privacy-policy"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 border-2 border-[#001b4d] text-[#001b4d] text-sm font-bold rounded-lg hover:bg-[#001b4d] hover:text-white transition-colors"
          >
            Privacy Policy <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Contact Block */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#d9a441]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-[#d9a441]" />
            </div>
            <div>
              <h3 className="font-bold text-[#001b4d] mb-1">Questions About These Terms?</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                If you have any questions about these Terms & Conditions or how they apply to your use of our services, please get in touch with our team.
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
          These Terms & Conditions are effective as of {lastUpdated}. Promise Land India reserves the right to update these terms at any time.
        </p>
      </div>
    </div>
  );
}
