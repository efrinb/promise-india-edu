import Link from 'next/link';
import { ShieldCheck, Sparkles, UserCheck, GraduationCap, CheckCircle2, FileText, ClipboardList } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';

export const metadata = {
  title: 'Admission Process | Promise India Education Consultancy',
  description: 'Learn about our simplified four-step admission process for securing seats in top INC-approved nursing colleges.',
};

export default async function AdmissionProcessPage() {
  let dbSteps: any[] = [];
  try {
    dbSteps = await prisma.admissionStep.findMany({ orderBy: { stepNumber: 'asc' } });
  } catch (error) {
    console.error('Failed to fetch admission steps:', error);
  }

  const staticSteps = [
    {
      stepNumber: 1,
      title: 'Counseling',
      description: 'Personalized guidance to understand your goals and align them with the right programs.',
      icon: 'Users',
    },
    {
      stepNumber: 2,
      title: 'Course Selection',
      description: 'Choosing the right program and college that fits your academic profile and budget.',
      icon: 'BookOpen',
    },
    {
      stepNumber: 3,
      title: 'Documentation',
      description: 'Seamless management of application paperwork, transcripts, and eligibility verification.',
      icon: 'FileText',
    },
    {
      stepNumber: 4,
      title: 'Confirmation',
      description: 'Official admission letter from your focus college to secure your academic seat.',
      icon: 'CheckCircle2',
    },
  ];

  const stepsList = dbSteps.length > 0 ? dbSteps : staticSteps;

  const benefits = [
    {
      title: '100% Transparent Process',
      description: 'No hidden admin fees. Complete breakdown of tuition and university charges before you apply.',
      icon: ShieldCheck,
    },
    {
      title: 'Structured Guidance',
      description: 'Our senior counselors will manage all verification requirements step-by-step.',
      icon: Sparkles,
    },
    {
      title: 'Direct Seat Allotment',
      description: 'Direct tie-ups with administrative authorities for quick processing.',
      icon: UserCheck,
    },
    {
      title: 'Career Placement Aid',
      description: 'Ongoing post-admission mentorship and internship advice at leading hospitals.',
      icon: GraduationCap,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section className="relative bg-[#001b4d] text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200"
            alt="Nursing Hero Bg"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="inline-block bg-[#d9a441]/10 text-[#d9a441] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-[#d9a441]/20">
            Trusted Admission Experts
          </span>
          <div className="max-w-3xl">
            <AnimatedHeading as="h1" direction="left" className="text-3xl sm:text-5xl font-bold mb-4 text-white">
              Simplified Admission <span className="text-[#d9a441]">Process</span>.
            </AnimatedHeading>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              Your journey to a professional nursing degree in four easy steps. We handle the complexity so you can focus on your studies.
            </p>
          </div>
        </div>
      </section>

      {/* ── Process Steps ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Your Journey</span>
          <AnimatedHeading as="h2" direction="left" className="text-2xl md:text-3xl font-bold text-[#001b4d]">Four Easy Steps</AnimatedHeading>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {stepsList.map((step, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center relative flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="absolute top-4 right-4 text-xs font-extrabold text-[#d9a441] bg-[#d9a441]/10 px-2 py-0.5 rounded-md">
                  Step {step.stepNumber}
                </span>
                <div className="w-12 h-12 rounded-full bg-[#f0f3ff] flex items-center justify-center font-bold text-[#001b4d] text-base mx-auto mb-4 mt-2">
                  {step.stepNumber}
                </div>
                <h3 className="font-bold text-base text-[#001b4d] mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Key Benefits ── */}
      <section className="bg-white border-t border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Why Choose Us</span>
            <AnimatedHeading as="h2" direction="right" className="text-2xl md:text-3xl font-bold text-[#001b4d]">Key Benefits of Our Counseling</AnimatedHeading>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-[#f8f9fb] border border-gray-200 p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-[#e7eeff] flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-5 w-5 text-[#001b4d]" />
                  </div>
                  <h3 className="font-bold text-[#001b4d] text-base mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#001b4d] rounded-xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Ready to Start Your Admission Journey?</h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              Book your free counseling session today and take the first step towards a successful career. Our counselors are online to guide you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0 w-full md:w-auto">
            <Link href="/contact?type=consultation&source=admission_bottom" className="flex-1 md:flex-initial">
              <span className="block text-center px-6 py-3 bg-[#d9a441] text-[#001b4d] font-bold rounded-lg text-sm hover:bg-[#c4922e] transition-colors cursor-pointer">
                Book Free Consultation
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
