import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, GraduationCap, CheckCircle, Calendar, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AdmissionBadge } from '@/components/public/AdmissionBadge';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';
import ImagePreview from '@/components/ui/ImagePreview';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug, status: 'published' },
  });

  if (!college) {
    return {
      title: 'College Not Found | Promise India',
    };
  }

  const courses = Array.isArray(college.courses) ? college.courses.join(', ') : '';
  const fees = college.fees as any;
  const currentYear = new Date().getFullYear();

  const title = `${college.name} | Fees, Courses, Admission ${currentYear} | Promise India`;
  const description = `${college.shortDescription} Offering ${courses}. Total Fee: ₹${fees.total?.toLocaleString('en-IN')}. Apply now for ${currentYear} admissions. Located in ${college.location}.`;

  return {
    title,
    description,
    keywords: [
      college.name,
      college.category,
      college.location,
      'nursing college',
      'admission',
      'fees',
      currentYear.toString(),
      ...college.courses,
      'Promise India',
    ].join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://promiseindia.com/colleges/${college.slug}`,
      siteName: 'Promise India Education Consultancy',
      images: college.thumbnailUrl ? [
        {
          url: college.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: college.name,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: college.thumbnailUrl ? [college.thumbnailUrl] : [],
    },
    alternates: {
      canonical: `https://promiseindia.com/colleges/${college.slug}`,
    },
  };
}

export default async function CollegeDetailPage({ params }: Props) {
  const college = await prisma.college.findUnique({
    where: { slug: params.slug, status: 'published' },
  });

  if (!college) {
    notFound();
  }

  const fees = college.fees as any;
  const courses = college.courses as string[];
  const galleryUrls = college.galleryUrls as string[];
  const currentYear = new Date().getFullYear();

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: college.name,
    description: college.shortDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: college.location,
      addressCountry: 'IN',
    },
    image: college.thumbnailUrl,
    priceRange: `₹${fees.total?.toLocaleString('en-IN')}`,
    educationalCredentialAwarded: courses.join(', '),
    offers: {
      '@type': 'Offer',
      category: college.category,
      availability: college.admissionStatus === 'open'
        ? 'https://schema.org/InStock'
        : college.admissionStatus === 'closing_soon'
          ? 'https://schema.org/LimitedAvailability'
          : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero Section with Image */}
        <section className="relative h-96 bg-gradient-to-br from-primary to-secondary">
          {college.thumbnailUrl ? (
            <Image
              src={college.thumbnailUrl}
              alt={college.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-32 w-32 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 text-white">
            <div className="container-custom py-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {college.featured && (
                  <span className="bg-accent px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ Featured
                  </span>
                )}
                <AdmissionBadge status={college.admissionStatus as any} />
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">
                  {college.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-3">{college.name}</h1>
              <div className="flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{college.location}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="section">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-4">About {college.name}</h2>
                  <p className="text-text-light dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {college.about}
                  </p>
                </Card>

                {/* Courses Offered */}
                {courses && courses.length > 0 && (
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Courses Offered</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {courses.map((course: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium">{course}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Gallery & Videos */}
                {((galleryUrls && galleryUrls.length > 0) || (college.videoUrls && college.videoUrls.length > 0)) && (
                  <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Campus Gallery & Videos</h2>

                    {/* Images Section */}
                    {galleryUrls && galleryUrls.length > 0 && (
                      <div className='mb-8'>
                        <h3 className="text-lg font-semibold mb-4 text-primary dark:text-primary-400">Campus Photos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryUrls.map((url: string, index: number) => (
                            <ImagePreview
                              key={index}
                              src={url}
                              alt={`${college.name} - Campus Image ${index + 1}`}
                              className="relative aspect-video rounded-lg overflow-hidden group"
                              images={galleryUrls}
                              currentIndex={index}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos Section */}
                    {college.videoUrls && college.videoUrls.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-primary dark:text-primary-400">Campus Videos</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {college.videoUrls.map((url: string, index: number) => (
                            <VideoPlayer
                              key={index}
                              url={url}
                              title={`${college.name} - Video ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Admission Status Card */}
                <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
                  <div className="text-center mb-4">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-80" />
                    <h3 className="text-xl font-bold">Admission Status</h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-4">
                    <AdmissionBadge status={college.admissionStatus as any} className="w-full justify-center" />
                  </div>
                  <p className="text-sm text-center text-gray-100">
                    Academic Year {currentYear}-{currentYear + 1}
                  </p>
                </Card>

                {/* Fee Structure */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Fee Structure</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                      <span className="text-sm text-text-light dark:text-gray-400">1st Year</span>
                      <span className="font-semibold">{formatCurrency(fees.year1)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                      <span className="text-sm text-text-light dark:text-gray-400">2nd Year</span>
                      <span className="font-semibold">{formatCurrency(fees.year2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                      <span className="text-sm text-text-light dark:text-gray-400">3rd Year</span>
                      <span className="font-semibold">{formatCurrency(fees.year3)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                      <span className="text-sm text-text-light dark:text-gray-400">4th Year</span>
                      <span className="font-semibold">{formatCurrency(fees.year4)}</span>
                    </div>
                    {fees.hostel && fees.hostel > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                        <span className="text-sm text-text-light dark:text-gray-400">Hostel (Annual)</span>
                        <span className="font-semibold">{formatCurrency(fees.hostel)}</span>
                      </div>
                    )}
                    {fees.other && fees.other > 0 && (
                      <div className="flex justify-between items-center pb-3 border-b dark:border-gray-700">
                        <span className="text-sm text-text-light dark:text-gray-400">Other Fees</span>
                        <span className="font-semibold">{formatCurrency(fees.other)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <span className="font-bold">Total (4 Years)</span>
                      <span className="text-xl font-bold text-primary dark:text-primary-400">
                        {formatCurrency(fees.total)}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3">
                  <Link href={`/contact?type=apply&source=college_detail`}>
                    <Button variant="danger" className="w-full">
                      Apply Now
                    </Button>
                  </Link>

                  {college.googleFormUrl && (

                    <a href={college.googleFormUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" className="w-full">
                        Application Form
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </a>
                  )}

                  <Link href={`/contact?type=visit&source=college_detail`}>
                    <Button variant="outline" className="w-full">
                      Schedule Visit
                    </Button>
                  </Link>
                </div>

                {/* Quick Contact */}
                <Card className="p-6 bg-background dark:bg-gray-800">
                  <h3 className="font-bold mb-4">Need Help?</h3>
                  <div className="space-y-3 text-sm">
                    <a href="tel:+919876543210" className="flex items-center space-x-3 text-text-light dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">
                      <Phone className="h-4 w-4" />
                      <span>Call Us</span>
                    </a>
                    <a href="mailto:info@promiseindia.com" className="flex items-center space-x-3 text-text-light dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">
                      <Mail className="h-4 w-4" />
                      <span>Email Us</span>
                    </a>
                    <Link href={`/contact?type=consultation&source=college_detail`} className="flex items-center space-x-3 text-text-light dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">
                      <CheckCircle className="h-4 w-4" />
                      <span>Free Consultation</span>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}