import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Phone, Mail, GraduationCap, CheckCircle,
  ExternalLink, Star, Building2, Wifi, Bus,
  FlaskConical, BookOpen, Utensils, Home as HomeIcon
} from 'lucide-react';
import { AdmissionBadge } from '@/components/public/AdmissionBadge';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import ImagePreview from '@/components/ui/ImagePreview';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { CollegeLeadForm } from '@/components/public/CollegeLeadForm';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug, status: 'published' },
  });
  if (!college) return { title: 'College Not Found | Promise India Education Consultancy' };
  const fees = college.fees as any;
  const currentYear = new Date().getFullYear();
  const title = `${college.name} | Fees, Courses, Admission ${currentYear} | Promise India Education Consultancy`;

  let totalFeeText = '';
  if (fees?.courseFees && typeof fees.courseFees === 'object') {
    const values = Object.values(fees.courseFees).map(Number).filter(v => v > 0);
    if (values.length > 0) {
      totalFeeText = ` starting from ₹${Math.min(...values).toLocaleString('en-IN')}`;
    }
  } else if (fees?.total) {
    totalFeeText = ` around ₹${fees.total.toLocaleString('en-IN')}`;
  }
  const description = `${college.shortDescription} Located in ${college.location}.${totalFeeText ? ' Total Fee:' + totalFeeText : ''} Apply now.`;
  return {
    title,
    description,
    openGraph: { title, description, images: college.thumbnailUrl ? [college.thumbnailUrl] : [] },
  };
}

const facilityIconMap: Record<string, any> = {
  'Modern Labs': FlaskConical,
  'Digital Library': BookOpen,
  'Hostel Available': HomeIcon,
  'Lecture Halls': GraduationCap,
  'Student Canteen': Utensils,
  'Transport': Bus,
  'Wi-Fi Campus': Wifi,
  'Auditorium': Building2,
  'Sports Complex': Star,
};

export default async function CollegeDetailPage({ params }: Props) {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug, status: 'published' },
  });
  if (!college) notFound();

  const settings = await prisma.settings.findFirst();

  const fees = college.fees as any;
  const courses = college.courses as string[];
  const galleryUrls = (college.galleryUrls as string[]) || [];
  const currentYear = new Date().getFullYear();

  // Load dynamic course programs from DB
  const courseProgramsFromDb = await prisma.courseProgram.findMany({
    where: {
      title: {
        in: courses,
      },
    },
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: college.name,
    description: college.shortDescription,
    address: { '@type': 'PostalAddress', addressLocality: college.location, addressCountry: 'IN' },
    image: college.thumbnailUrl,
  };

  const tabLabels = ['OVERVIEW', 'COURSES', 'ADMISSION', 'FEES STRUCTURE', 'FACILITIES', 'GALLERY', 'REVIEWS'];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

        {/* ── Hero Image ── */}
        <section className="relative h-64 md:h-80 lg:h-96 bg-[#001b4d] overflow-hidden">
          {college.thumbnailUrl ? (
            <Image src={college.thumbnailUrl} alt={college.name} fill className="object-cover" priority />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#001b4d] to-[#002870] flex items-center justify-center">
              <GraduationCap className="h-24 w-24 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Hero Overlay Content */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-6 max-w-7xl mx-auto w-full">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {college.featured && (
                <span className="bg-[#d9a441] text-[#001b4d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  ⭐ Featured
                </span>
              )}
              <AdmissionBadge status={college.admissionStatus as any} />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{college.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#d9a441]" />
                {college.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#d9a441] text-[#d9a441]" />
                <span className="text-white font-semibold">4.8</span>
                <span className="text-white/60">(120+ Reviews)</span>
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-xs font-semibold uppercase">
                {college.category}
              </span>
            </div>
          </div>
        </section>

        {/* ── Tab Navigation ── */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex gap-0 overflow-x-auto scrollbar-hide">
              {tabLabels.map((tab) => (
                <a
                  key={tab}
                  href={`#${tab.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex-shrink-0 px-5 py-4 text-xs font-bold text-gray-500 hover:text-[#001b4d] border-b-2 border-transparent hover:border-[#d9a441] transition-all uppercase tracking-wider whitespace-nowrap"
                >
                  {tab}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Main Content + Sidebar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left Main Column ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* About the Institution */}
              <section id="overview" className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#001b4d] mb-5">About the Institution</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{college.about}</p>

                {/* Key Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center mx-auto mb-2">
                      <Building2 className="h-5 w-5 text-[#001b4d]" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Affiliation</p>
                    <p className="font-bold text-[#001b4d] text-sm mt-0.5 leading-snug break-words">
                      {college.affiliation || 'RGUHS'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-5 w-5 text-[#001b4d]" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Approval</p>
                    <p className="font-bold text-[#001b4d] text-sm mt-0.5 leading-snug break-words">
                      {college.approval || 'INC, KNC'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center mx-auto mb-2">
                      <GraduationCap className="h-5 w-5 text-[#001b4d]" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Established</p>
                    <p className="font-bold text-[#001b4d] text-sm mt-0.5 leading-snug break-words">
                      {college.established || '1998'}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center mx-auto mb-2">
                      <MapPin className="h-5 w-5 text-[#001b4d]" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Campus Size</p>
                    <p className="font-bold text-[#001b4d] text-sm mt-0.5 leading-snug break-words">
                      {college.campusSize || '15 Acres'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Offered Programs */}
              {courses && courses.length > 0 && (
                <section id="courses" className="bg-white rounded-xl border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#001b4d]">Offered Programs</h2>
                    <Link href="/colleges" className="text-sm font-semibold text-[#001b4d] hover:text-[#d9a441] transition-colors">
                      View all colleges →
                    </Link>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {courses.map((course, idx) => {
                      const program = courseProgramsFromDb.find(p => p.title.toLowerCase() === course.toLowerCase());
                      const duration = program?.duration || '4 Years';
                      const description = program?.description || 'Comprehensive program focusing on clinical nursing skills and healthcare management.';

                      let highlights: string[] = ['Clinical Training', 'Theory & Practicals', 'Hospital Internships'];
                      if (program?.bullets) {
                        if (Array.isArray(program.bullets)) {
                          highlights = program.bullets as string[];
                        } else if (typeof program.bullets === 'string') {
                          highlights = (program.bullets as string).split(',').map(s => s.trim()).filter(Boolean);
                        }
                      }

                      return (
                        <div key={idx} className="border border-gray-200 rounded-xl p-5 hover:border-[#d9a441] hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <span className="bg-[#001b4d] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                                {idx === 0 ? 'Popular' : 'Available'}
                              </span>
                              <span className="text-xs text-gray-400 font-medium">
                                {duration}
                              </span>
                            </div>
                            <h3 className="font-bold text-[#001b4d] text-lg mb-2">{course}</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-3">
                              {description}
                            </p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-4">
                              {highlights.map((h, i) => (
                                <span key={i}>• {h}</span>
                              ))}
                            </div>
                          </div>
                          {college.googleFormUrl ? (
                            <a href={college.googleFormUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-block w-full text-center py-2.5 bg-[#d9a441] text-[#001b4d] font-bold rounded-lg text-sm hover:bg-[#c4922e] transition-colors">
                              Apply Now
                            </a>
                          ) : (
                            <Link href="/contact?type=apply&source=college_detail"
                              className="inline-block w-full text-center py-2.5 bg-[#d9a441] text-[#001b4d] font-bold rounded-lg text-sm hover:bg-[#c4922e] transition-colors">
                              Apply Now
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Estimated Fees Structure */}
              <section id="fees-structure" className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#001b4d] mb-2">Estimated Fees Structure</h2>
                <p className="text-xs text-gray-400 mb-6">* Tuition fees are specified per program. Hostel and general administrative charges are separate.</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#001b4d] text-white">
                        <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Course Name</th>
                        <th className="text-left px-4 py-3 font-semibold">Total Duration</th>
                        <th className="text-left px-4 py-3 rounded-tr-lg font-semibold">Total Fees</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {courses.map((course, idx) => {
                        const program = courseProgramsFromDb.find(p => p.title.toLowerCase() === course.toLowerCase());
                        const duration = program?.duration || '4 Years';

                        let courseFee = 0;
                        if (fees?.courseFees && typeof fees.courseFees === 'object' && fees.courseFees[course]) {
                          courseFee = Number(fees.courseFees[course]);
                        } else {
                          courseFee = Number(fees?.total || 0);
                        }

                        return (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[#001b4d]">{course}</td>
                            <td className="px-4 py-3 text-gray-600">{duration}</td>
                            <td className="px-4 py-3 font-bold text-[#001b4d]">
                              {courseFee > 0 ? formatCurrency(courseFee) : 'Contact for Fees'}
                            </td>
                          </tr>
                        );
                      })}
                      {fees?.hostel && Number(fees.hostel) > 0 && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-[#001b4d]">Hostel Fee (Annual)</td>
                          <td className="px-4 py-3 text-gray-600">Per Year</td>
                          <td className="px-4 py-3 font-bold text-[#001b4d]">{formatCurrency(Number(fees.hostel))}</td>
                        </tr>
                      )}
                      {fees?.other && Number(fees.other) > 0 && (
                        <tr className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-[#001b4d]">Other Fee (Annual)</td>
                          <td className="px-4 py-3 text-gray-600">Per Year</td>
                          <td className="px-4 py-3 font-bold text-[#001b4d]">{formatCurrency(Number(fees.other))}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Campus Facilities */}
              <section id="facilities" className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#001b4d] mb-6">Campus Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(() => {
                    const collegeFacilities = (college.facilities as string[]) || [];
                    const facilitiesToRender = collegeFacilities.length > 0
                      ? collegeFacilities
                      : ['Modern Labs', 'Digital Library', 'Hostel Available', 'Lecture Halls', 'Student Canteen', 'Transport'];

                    return facilitiesToRender.map((label) => {
                      const Icon = facilityIconMap[label] || CheckCircle;
                      return (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-[#f8f9fb] border border-gray-100">
                          <div className="w-9 h-9 rounded-lg bg-[#e7eeff] flex items-center justify-center flex-shrink-0">
                            <Icon className="h-4 w-4 text-[#001b4d]" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700">{label}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>

              {/* Campus Gallery */}
              {galleryUrls.length > 0 && (
                <section id="gallery" className="bg-white rounded-xl border border-gray-200 p-8">
                  <h2 className="text-2xl font-bold text-[#001b4d] mb-6">Campus Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryUrls.map((url, idx) => (
                      <ImagePreview
                        key={idx}
                        src={url}
                        alt={`${college.name} campus ${idx + 1}`}
                        className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                        images={galleryUrls}
                        currentIndex={idx}
                      />
                    ))}
                  </div>

                  {/* Video Gallery */}
                  {college.videoUrls && college.videoUrls.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-[#001b4d] mb-4">Campus Videos</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(college.videoUrls as string[]).map((url, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden border border-gray-100">
                            <VideoPlayer url={url} title={`${college.name} Video ${idx + 1}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Student Success Stories */}
              <section id="reviews" className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#001b4d] mb-6">Student Success Stories</h2>
                <div className="space-y-5">
                  {[
                    { name: 'Anjali Sharma', course: 'B.Sc Nursing, Batch 2021', review: 'The clinical exposure is exceptional. The faculty members are extremely supportive, and the placement cell helped me secure a job at Apollo Hospital even before my final exams.' },
                  ].map((testimonial, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-xl p-6 bg-[#f8f9fb]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[#001b4d] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-bold text-[#001b4d] text-sm">{testimonial.name}</p>
                          <p className="text-xs text-gray-500">{testimonial.course}</p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-4 w-4 fill-[#d9a441] text-[#d9a441]" />)}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed italic">"{testimonial.review}"</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Right Sidebar ── */}
            <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">

              {/* Instant Admission Help Form */}
              <div className="bg-[#001b4d] rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-1">Instant Admission Help</h3>
                <p className="text-white/60 text-xs mb-5">Our senior counselors are online to assist you.</p>
                <CollegeLeadForm collegeName={college.name} googleFormUrl={college.googleFormUrl} />
              </div>

              {/* Direct Contact */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-bold text-[#001b4d] mb-4">Direct Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-[#d9a441] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Admissions Email</p>
                      <a href={`mailto:${settings?.adminEmail || 'admissions@promiseland.in'}`} className="text-sm font-semibold text-[#001b4d] hover:text-[#d9a441] transition-colors">
                        {settings?.adminEmail || 'admissions@promiseland.in'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-[#d9a441] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Toll Free</p>
                      <a href={settings?.phone ? `tel:${settings.phone.replace(/[^+\d]/g, '')}` : 'tel:18004567890'} className="text-sm font-semibold text-[#001b4d] hover:text-[#d9a441] transition-colors">
                        {settings?.phone || '1800-456-7890'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Gallery */}
              {galleryUrls.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#001b4d]">Share Gallery</h3>
                    <div className="flex gap-2">
                      <button className="w-8 h-8 rounded-full bg-[#f0f3ff] flex items-center justify-center text-[#001b4d] hover:bg-[#001b4d] hover:text-white transition-all">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {galleryUrls.slice(0, 3).map((url, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image src={url} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}