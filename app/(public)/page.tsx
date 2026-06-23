import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone, Quote } from 'lucide-react';
import * as Icons from 'lucide-react';
import { prisma } from '@/lib/db';
import { testimonials } from '@/lib/homepage-data';
import { GraduationCap as CustomGradCap, Badge as CustomBadge, People as CustomPeople } from '@/components/ui/CustomIcons';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

function getIconComponent(iconName: string, className = "h-6 w-6 text-primary") {
  if (iconName === 'GraduationCap') return <CustomGradCap className={className} />;
  if (iconName === 'Award') return <CustomBadge className={className} />;
  if (iconName === 'Users') return <CustomPeople className={className} />;

  const Icon = (Icons as any)[iconName];
  if (!Icon) return <CustomGradCap className={className} />;
  return <Icon className={className} />;
}

async function getHomepageData() {
  try {
    const stats = await prisma.siteStatistic.findMany({ orderBy: { order: 'asc' } });
    const programs = await prisma.courseProgram.findMany({ orderBy: { order: 'asc' } });
    const steps = await prisma.admissionStep.findMany({ orderBy: { stepNumber: 'asc' } });
    const partnerColleges = await prisma.college.findMany({
      where: { status: 'published' },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });

    return { stats, programs, steps, partnerColleges };
  } catch (error) {
    console.error('Failed to load homepage data:', error);
    return { stats: [], programs: [], steps: [], partnerColleges: [] };
  }
}

export const metadata = {
  title: 'Start Your Nursing Career with Expert Guidance | Promise Land India',
  description: 'Your trusted partner for nursing college admissions with transparent fees and personalized support.',
};

export default async function HomePage() {
  const { stats, programs, steps, partnerColleges } = await getHomepageData();

  return (
    <div className="flex flex-col min-h-screen bg-background font-body-md text-on-surface">
      {/* 1. Hero Section */}
      <section className="relative min-h-[870px] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <img
            alt="Medical students studying"
            className="w-full h-full object-cover opacity-40"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6H_2zur9_Zy2uCohCIgWwB7sFbgo-tkCljznxwaAusRP_52lnj9U-avISqz9YGvSuDsKo_lfa_miI-CCqbJrmjeUi4IxliqO3fnVdtIc3z8qggHNQELXEi3c_8w7jj7XAVBJYQ3Lb955TNNOeGnY6IKjGs-kIMmoekZ2fkPNWtp8lvHnDgmTYAGa2u_CtaFUheqgn5_A5buPmDTdsqWY1mIvxK8lEwxGJwjxLLozJ4JPM3korYmF5VkUqUoOOCl5s9YwI1a-V6rU"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,4,23,0.95)] to-[rgba(0,4,23,0.6)]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20">
          <div className="text-white space-y-4">
            <span className="inline-block bg-[#d9a441]/10 text-[#d9a441] px-3 py-1 rounded-full text-sm font-bold border border-[#d9a441]/30">
              Trusted Admission Experts
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight font-heading text-white">
              Start Your Nursing Career with Expert Admission Guidance
            </h1>
            <p className="text-lg text-gray-200 max-w-xl">
              We help students secure admissions in top nursing colleges across India with complete support from counseling to enrollment.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/contact?type=apply&source=hero" className="bg-[#d9a441] text-[#001b4d] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#c4922e] transition-all shadow-lg">
                Apply Now
              </Link>
              <Link href="/contact?type=consultation&source=hero" className="bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-all shadow-lg border border-white/20">
                Free Consultation
              </Link>
            </div>
            <div className="pt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img alt="Student" className="w-12 h-12 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDew2MYf46QNgQuhT3Ku8AeBi0c0wSQ0zbmVusZQ2MpdT84kQP_EFlhTFHx2CB028UVZB1MX6JSl84CMLfvARwC1cboLdQ0IMyuAcccaCBR11XguSiTrKmFsJNL8NUbw_EZHV63mVx8yZtmfrUCHMp2nv57Pt2ZDEjdzPgjszXCIVT0tu-dFrYmntD2KDniOdlovMM_TlQU07the5XPNnUczY5pDr-F7shZdNNA3hRb3_CRGeD_FNpLwvunqk87tF472tSYUkPu0ZA" />
                <img alt="Student" className="w-12 h-12 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzXq3jAK6XGt2fl-lZNlXNdy5EmUK8wS_2yG1gvBLnixhXGfGyT7CsMozkOCrb6WXhU_OQChuxugrIjhZQF0zMFqnvbjmBvUO2BdvnVUG4tymXI-D0uzh118zMyOJ3YrkFo3Nq3nNCCWJPPbhLcedOJBb29ROpFdli9AhAJiUop0KpU173HJZZ72u4S5Ndh2GTeaiq1ci58PW3PQuh2O86VEjgTeRVQvBEDS2xI6BOOZP77ZgL5f07w7qxJM60KsYVqFVPWtKygtE" />
                <img alt="Student" className="w-12 h-12 rounded-full border-2 border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClPZUPkR7exMrNW4KEERM-SVQYeQ9GZxR49NKym3XyYjo7MUgf1pN785253bgQllfthRD5zOLrrmYGGUnHc1fPE9OvwdvWuOiPrbULZVZH9FxJZ69StQazCvHEiFSbfVuWufhpju6A00Ssln5WrWQAeVkRop-wcoDABstE7scuCUHA3NW-7X52zf3FvEyhNEH4oq7RLYRuUWvMfr8wpoicVR4_iXM-s2nGAqYZybi650J8jBQfAxvef89EL94bGylVkKNfLcQpqrE" />
              </div>
              <p className="text-sm text-gray-200">
                <span className="text-[#d9a441] font-bold">Trusted by 2500+</span> Students &amp; Parents
              </p>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-4 border-on-primary/10">
              <img alt="Nursing Student" className="w-full h-[600px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcMd_hdWoui7gCZlmEMyvUVwOxxFgFKkxNNfKt6Nk_X2phEm1yxUtLFUkrWCLp0tJU57HrfawQara699gsjgNTHoWUv-n9eunsrKPdjv0-pii7whonU5zHfZI-Uu2PyPKTGIrZ-3uVU9SE9C3SXaQ7PiZdZxt7yPSn6CtVbxLh_pZu3KuegZLj7nC91OjUNMkTBBf8hiHUfhGyLjgxywZmH7ynPZtPiT0HM9W-iMhJ2BJeh1cWX4O6BwrNqxn3dknsH7KJFlcIcAQ" />
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary-container rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute z-20 -bottom-10 -left-10 bg-on-primary p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center gap-4 border border-surface-variant">
              <div className="bg-secondary-container/20 p-3 rounded-full">
                <Icons.Verified className="text-secondary h-8 w-8" />
              </div>
              <div>
                <p className="text-primary font-bold text-2xl">12+ Years</p>
                <p className="text-on-surface-variant text-sm">Of Excellence</p>
              </div>
            </div>
            <svg className="absolute z-20 -right-12 top-1/2 -translate-y-1/2 w-24 h-48 text-secondary-fixed-dim opacity-50" viewBox="0 0 100 200">
              <path d="M0 0 C 50 50, 50 150, 0 200" fill="none" stroke="currentColor" strokeDasharray="8 4" strokeWidth="2"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section */}
      {stats.length > 0 && (
        <section className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.id} className="bg-white p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] text-center border border-surface-variant hover:-translate-y-1 transition-transform">
                  <div className="flex justify-center mb-2">
                    {getIconComponent(stat.icon, "text-secondary h-10 w-10")}
                  </div>
                  <h3 className="text-4xl font-bold text-primary font-heading mb-1">
                    <AnimatedCounter
                      target={parseInt(stat.value?.replace(/\D/g, '') || '0')}
                      suffix={stat.value?.replace(/^[0-9]*/, '') || ''}
                    />
                  </h3>
                  <p className="text-on-surface-variant text-sm uppercase tracking-wider font-bold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Programs Section */}
      {programs.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-sm block mb-2">Future in Nursing</span>
              <AnimatedHeading as="h2" direction="left" className="text-4xl md:text-5xl font-bold text-primary font-heading">Nursing Programs We Offer</AnimatedHeading>
              <div className="h-1 w-24 bg-secondary-container mx-auto mt-4 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div key={program.id} className="group bg-[#0059ff] text-white p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/10 hover:border-white/30 transition-all flex flex-col h-full">
                  <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/25 transition-colors">
                    {getIconComponent(program.icon, "text-white h-8 w-8")}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-heading">{program.title}</h3>
                  <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full self-start mb-4">
                    {program.duration}
                  </span>
                  <p className="text-white/85 mb-8 flex-grow">
                    {program.description}
                  </p>
                  <Link href="/colleges" className="flex items-center gap-2 text-[#d9a441] hover:text-white font-bold hover:gap-4 transition-all">
                    Learn More <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Admission Process */}
      {steps.length > 0 && (
        <section className="py-20 bg-surface overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <AnimatedHeading as="h2" direction="left" className="text-4xl md:text-5xl font-bold text-primary font-heading">Simplified Admission Process</AnimatedHeading>
              <p className="text-on-surface-variant mt-4 text-lg">Your journey to a nursing degree in four easy steps</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-secondary-fixed-dim/30 -z-10"></div>
              {steps.map((step) => (
                <div key={step.id} className="relative text-center group">
                  <div className="w-20 h-20 bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center mx-auto mb-6 border-4 border-surface group-hover:border-secondary transition-colors relative z-10">
                    {getIconComponent(step.icon, "text-secondary h-8 w-8")}
                    <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                      {step.stepNumber}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-2 font-heading">{step.title}</h4>
                  <p className="text-on-surface-variant text-base">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Partner Colleges Carousel */}
      {partnerColleges.length > 0 && (
        <section className="py-16 bg-white overflow-hidden border-y border-surface-variant">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Associated with Top Institutions</p>
          </div>
          <div className="flex overflow-hidden relative">
            <div className="flex whitespace-nowrap gap-20 animate-[scroll_40s_linear_infinite]">
              {/* Create a continuous scrolling effect by duplicating the list */}
              {[...partnerColleges, ...partnerColleges].map((college, idx) => (
                <div key={`${college.id}-${idx}`} className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-surface-dim/80 grayscale hover:grayscale-0 transition-all">
                    {college.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <AnimatedHeading as="h2" direction="left" className="text-4xl md:text-5xl font-bold text-primary font-heading">Student Stories</AnimatedHeading>
              <p className="text-on-surface-variant mt-2 max-w-lg text-lg">Hear from our students who successfully started their professional journey with us.</p>
            </div>
            <Link href="/about" className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-bold hover:bg-primary hover:text-white transition-all text-center">
              View All Success Stories
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className={`bg-[#0059ff] text-white p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/10 flex flex-col relative card-stagger card-stagger-${(idx % 3) + 1}`}>
                <Quote className="absolute top-6 right-6 h-10 w-10 text-white/10" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{testimonial.name}</p>
                    <p className="text-white/80 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-[#d9a441] mb-4">
                  {[1, 2, 3, 4, 5].map(star => <Icons.Star key={star} className="h-5 w-5 fill-current" />)}
                </div>
                <p className="text-white/90 italic leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[40px] p-12 md:p-20 relative overflow-hidden text-center text-on-primary">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-on-primary rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10 font-heading text-white">Ready to Begin Your Nursing Career?</h2>
            <p className="text-xl text-surface-variant mb-10 max-w-2xl mx-auto relative z-10">
              Get expert guidance today and secure your seat in India's leading nursing institutions.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link href="/contact?type=consultation&source=footer" className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                Book Free Consultation
              </Link>
              <Link href="/contact" className="bg-on-primary/10 backdrop-blur-sm text-on-primary border border-on-primary/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-on-primary/20 transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}