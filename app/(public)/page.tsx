import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Target,
  Eye,
  Shield,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { AdmissionBadge } from '@/components/public/AdmissionBadge';
import { Statistics } from '@/components/public/Statistics';
import { Testimonials } from '@/components/public/Testimonials';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

export const metadata = {
  title: 'Promise India Education Consultancy - Nursing College Admissions',
  description: 'Your trusted partner for nursing college admissions with transparent fees and personalized support.',
};

async function getFeaturedColleges() {
  const colleges = await prisma.college.findMany({
    where: {
      featured: true,
      status: 'published',
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });
  return colleges;
}

export default async function HomePage() {
  const featuredColleges = await getFeaturedColleges();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-600 to-secondary py-20 md:py-32">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Your Trusted Partner for Nursing College Admissions
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Guiding students toward top accredited nursing institutions with transparent fees and personalized support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/colleges">
                  <Button variant="secondary" size="lg">
                    Explore Colleges
                  </Button>
                </Link>
                <Link href="/contact?type=consultation&source=homepage">
                  <Button variant="danger" size="lg">
                    Get Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <GraduationCap className="h-64 w-64 text-white/80 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-background dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                  <p className="text-text-light dark:text-gray-400 leading-relaxed">
                    To empower aspiring nurses with access to quality education by providing comprehensive guidance,
                    transparent information, and unwavering support throughout their admission journey to the best
                    nursing institutions in India.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-secondary/10 p-4 rounded-full">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                  <p className="text-text-light dark:text-gray-400 leading-relaxed">
                    To become India's most trusted education consultancy, known for ethical practices, student-first
                    approach, and contributing to building a skilled nursing workforce that serves the nation with
                    excellence and compassion.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <Statistics />

      {/* Why Choose Us */}
      <section className="section bg-background dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Promise India?</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              We stand out with our commitment to transparency, personalized care, and proven track record.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-3">Verified Colleges</h4>
              <p className="text-text-light dark:text-gray-400">
                Only accredited and recognized nursing institutions with proven track records.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="text-xl font-bold mb-3">Transparent Fee Structure</h4>
              <p className="text-text-light dark:text-gray-400">
                Clear, upfront fee information with no hidden charges or surprises.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3">Personalized Counseling</h4>
              <p className="text-text-light dark:text-gray-400">
                One-on-one guidance tailored to your academic background and career goals.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-3">End-to-End Support</h4>
              <p className="text-text-light dark:text-gray-400">
                Complete assistance from college selection to admission completion.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="section bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Nursing Colleges</h2>
            <p className="text-xl text-text-light max-w-3xl mx-auto">
              Explore our featured nursing institutions offering excellent education and facilities.
            </p>
          </div>

          {featuredColleges.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredColleges.map((college) => (
                  <Card key={college.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
                    <div className="relative aspect-video overflow-hidden">
                      {college.thumbnailUrl ? (
                        <Image
                          src={college.thumbnailUrl}
                          alt={college.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <GraduationCap className="h-24 w-24 text-white/50" />
                        </div>
                      )}

                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {college.featured && (
                          <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Featured
                          </span>
                        )}
                        <AdmissionBadge status={college.admissionStatus as any} />
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-primary px-3 py-1 rounded-full text-xs font-semibold">
                          {college.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{college.location}</span>
                      </div>

                      <h3 className="text-xl font-bold mb-3 hover:text-primary transition-colors">
                        {college.name}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {college.shortDescription}
                      </p>

                      {college.courses && college.courses.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-2">Courses Offered:</p>
                          <div className="flex flex-wrap gap-1">
                            {college.courses.slice(0, 2).map((course, idx) => (
                              <span
                                key={idx}
                                className="bg-secondary-50 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300 px-2 py-1 rounded text-xs font-medium"
                              >
                                {course.split('(')[0].trim()}
                              </span>
                            ))}
                            {college.courses.length > 2 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                                +{college.courses.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b">
                          <span className="text-sm text-gray-600">Total Course Fee:</span>
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency((college.fees as any)?.total || 0)}
                          </span>
                        </div>

                        <Link href={`/colleges/${college.slug}`}>
                          <Button variant="primary" className="w-full">
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link href="/colleges">
                  <Button variant="outline" size="lg">
                    View All Colleges
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <GraduationCap className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Featured Colleges Yet</h3>
                <p className="text-text-light mb-6">
                  We're currently updating our featured colleges. Please check back soon!
                </p>
                <Link href="/colleges">
                  <Button variant="primary">
                    Browse All Colleges
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Strip */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Admission Journey Today
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Get personalized guidance from our expert counselors and secure your seat in a top nursing college.
          </p>
          <Link href="/contact?type=consultation&source=homepage">
            <Button variant="danger" size="lg">
              Book Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}