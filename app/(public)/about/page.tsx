import Link from 'next/link';
import { ShieldCheck, Target, Eye, Star, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export const metadata = {
  title: 'About Us | Promise India Education Consultancy',
  description: 'Learn about our mission, vision, values, and leadership team guiding students to top nursing colleges across India.',
};

export default async function AboutPage() {
  // Try to load team members from database, fallback to static if empty or not matching.
  let dbTeam: any[] = [];
  try {
    dbTeam = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('Failed to fetch team members:', error);
  }

  // Leadership matching the Stitch mockup
  const staticLeadership = [
    {
      name: 'Dr. Rajesh Varma',
      role: 'FOUNDER & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
      description: 'Leading educationist with 20+ years of experience in healthcare admissions and academic advisory.'
    },
    {
      name: 'Anjali Menon',
      role: 'DIRECTOR OF OPERATIONS',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      description: 'Managing operations and partner college alliances to ensure standard guidelines and compliance.'
    },
    {
      name: 'Samrat Chatterjee',
      role: 'HEAD OF ACADEMIC ADVISORY',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
      description: 'Expert counselor specializing in curriculum matching, career mapping and student placement guidance.'
    }
  ];

  const leadershipList = dbTeam.length > 0 ? dbTeam : staticLeadership;

  return (
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section className="relative bg-[#001b4d] text-white py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="inline-block bg-[#d9a441]/10 text-[#d9a441] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-[#d9a441]/20">
                Promising Nursing Education
              </span>
              <AnimatedHeading as="h1" direction="left" className="text-3xl sm:text-5xl font-bold mb-4 text-white">
                Shaping the Future <br />
                of Global <span className="text-[#d9a441]">Healthcare</span>.
              </AnimatedHeading>
              <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
                Promise India Education Consultancy is more than a consultancy; we are architects of careers, dedicated to connecting the finest nursing talent with world-class academic institutions.
              </p>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-4 bg-[#d9a441]/20 blur-3xl rounded-full"></div>
                <img
                  src="/about-office.png"
                  alt="Excellence in Nursing"
                  className="relative w-full aspect-[4/3] object-cover rounded-[32px] shadow-2xl border-4 border-white/10"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Our Story & Mission/Vision ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

          {/* Left Column: Story + Mission/Vision Cards */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Our History</span>
              <AnimatedHeading as="h2" direction="left" className="text-2xl md:text-3xl font-bold text-[#001b4d] mb-4">Our Story</AnimatedHeading>
              <p className="text-gray-600 text-base leading-relaxed">
                Founded with a vision to bridge the gap between academic potential and clinical excellence, Promise India Education Consultancy has grown from a local advisory to a nation-wide brand. We believe that every aspiring nurse deserves a pathway to a prestigious education, free of compromise.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Mission */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#f0f3ff] flex items-center justify-center mb-4">
                  <Target className="h-5 w-5 text-[#001b4d]" />
                </div>
                <h3 className="font-bold text-[#001b4d] text-base mb-2">Our Mission</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To empower students through ethical guidance, matching their aspirations with ideal institutions that match their career dreams.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#f0f3ff] flex items-center justify-center mb-4">
                  <Eye className="h-5 w-5 text-[#001b4d]" />
                </div>
                <h3 className="font-bold text-[#001b4d] text-base mb-2">Our Vision</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  To be the global benchmark in healthcare education consultancy, recognized for our integrity and student-first philosophy.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Core Values Navy Card */}
          <div className="lg:col-span-4 bg-[#001b4d] rounded-xl p-6 md:p-8 text-white self-start">
            <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Guiding Principles</span>
            <h3 className="text-lg font-bold mb-5">Core Values</h3>
            <div className="space-y-5">
              {[
                { title: 'Integrity First', desc: 'Trust is our currency; we operate with total honesty.' },
                { title: 'Academic Excellence', desc: 'Partnering only with top-tier, recognized colleges.' },
                { title: 'Global Outlook', desc: 'Preparing candidates for national and international success.' }
              ].map((val, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#d9a441]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3 w-3 text-[#d9a441]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#d9a441]">{val.title}</h4>
                    <p className="text-white/90 text-sm mt-0.5 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats Banner (Gold/Amber Bg) ── */}
      <section className="bg-[#d9a441] text-[#001b4d] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">
                <AnimatedCounter target={15} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90 mt-0.5">Years Experience</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">
                <AnimatedCounter target={12000} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90 mt-0.5">Students Guided</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">
                <AnimatedCounter target={85} suffix="+" />
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90 mt-0.5">Partner Colleges</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold">
                <AnimatedCounter target={98} suffix="%" />
              </p>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider opacity-90 mt-0.5">Placement Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us + Growth Journey ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">

          {/* Left: Why Choose Us */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Our Advantage</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#001b4d]">Why Students Choose Us</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Direct Admissions', desc: 'Only top-tier institutions, direct tie-ups with administrative departments.' },
                { title: 'Transparent Fees', desc: 'Zero hidden charges, detailed breakdown of all administrative and college expenses.' },
                { title: '24/7 Support', desc: 'Expert education advisors available throughout your program tenure and settlement.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#f0f3ff] flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-[#001b4d]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#001b4d] text-base">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Growth Journey */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Timeline</span>
              <h2 className="text-2xl md:text-3xl font-bold text-[#001b4d]">Our Growth Journey</h2>
            </div>
            <div className="relative border-l-2 border-gray-200 pl-6 ml-2 space-y-6 py-2">
              {[
                { year: '2010', title: 'Inception', desc: 'Started as a small group of advisors in Bangalore with a mission to help local nursing aspirants.' },
                { year: '2015', title: 'National Expansion', desc: 'Established partnerships in major states and grew to support over 100+ medical colleges.' },
                { year: '2020', title: 'Digital Transformation', desc: 'Launched internal CRM and digital tools to streamline application and documentation.' },
                { year: '2025', title: 'The Market Leader', desc: 'Recognized as India\'s most trusted nursing education consultancy with global partnerships.' }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#d9a441] border-2 border-white" />
                  <span className="text-xs font-bold text-[#d9a441] tracking-wider block mb-0.5">{step.year}</span>
                  <h3 className="font-bold text-base text-[#001b4d]">{step.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── Meet Our Leadership ── */}
      <section className="bg-white border-t border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Board of Directors</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#001b4d]">Meet Our Leadership</h2>
            <p className="text-gray-500 text-sm mt-1.5">The seasoned professionals committed to educational transformation and ethical advisory.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {leadershipList.slice(0, 3).map((member, idx) => (
              <div key={idx} className="bg-[#f8f9fb] border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-200 relative">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#001b4d] text-lg mb-0.5">{member.name}</h3>
                  <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-3">{member.role}</span>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global Alumni Network Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-1">Alumni Network</span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#001b4d]">Global Alumni Network</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Priya D.', loc: 'US Registered Nurse', text: 'PromiseLand guided me from selecting the right B.Sc course in Bangalore to preparing for NCLEX. Today I practice in Texas!' },
            { name: 'Sanjay Nair', loc: 'Staff Nurse, NHS UK', text: 'Their direct alliance with colleges is authentic. I got exactly the fee package they promised. Highly recommended!' },
            { name: 'Mariya John', loc: 'Nurse Educator, Canada', text: 'The scholarship support was crucial. I received complete guidance to apply for State government grants.' },
            { name: 'Rahul Gupta', loc: 'Senior Nurse, UAE', text: 'My career mapping was perfect. The advisors showed me exactly where the global demand is and how to prepare.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm text-center flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center font-bold text-[#001b4d] text-sm mx-auto mb-3">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-base text-[#001b4d]">{item.name}</h3>
                <span className="text-xs font-bold text-[#d9a441] uppercase tracking-wider block mb-3">{item.loc}</span>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{item.text}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#001b4d] rounded-xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Ready to begin your nursing journey?</h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              Speak with our senior admission counselors today. Get complete guidance on courses, eligibility, and scholarship programs.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0 w-full md:w-auto">
            <Link href="/contact?type=consultation&source=about_bottom" className="flex-1 md:flex-initial">
              <span className="block text-center px-6 py-3 bg-[#d9a441] text-[#001b4d] font-bold rounded-lg text-sm hover:bg-[#c4922e] transition-colors cursor-pointer">
                Book Free Consultation
              </span>
            </Link>
            <Link href="/contact?type=apply&source=about_bottom" className="flex-1 md:flex-initial">
              <span className="block text-center px-6 py-3 border border-white/20 text-white font-bold rounded-lg text-sm hover:bg-white/10 transition-colors cursor-pointer">
                Download Brochure
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}