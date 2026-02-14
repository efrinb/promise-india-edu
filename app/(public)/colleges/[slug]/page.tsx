import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, GraduationCap, ExternalLink, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { prisma } from '@/lib/db';
import { formatCurrency } from '@/lib/utils';

async function getCollege(slug: string) {
  const college = await prisma.college.findUnique({
    where: { slug, status: 'published' },
  });
  return college;
}

export default async function CollegeDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const college = await getCollege(params.slug);

  if (!college) {
    notFound();
  }

  const fees = college.fees as any;
  const courses = college.courses as string[] | undefined;

  return (
    <div className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-gray-600 mb-4">
            <Link href="/colleges" className="hover:text-primary">
              Colleges
            </Link>
            <span>/</span>
            <span>{college.name}</span>
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{college.name}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">{college.location}</span>
              </div>
            </div>
            {college.googleFormUrl && (
              <a href={college.googleFormUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary">
                  Apply Now
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <Card>
              {college.thumbnailUrl ? (
                <div className="relative w-full aspect-video">
                  <Image
                    src={college.thumbnailUrl}
                    alt={college.name}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <GraduationCap className="h-32 w-32 text-white/50" />
                </div>
              )}
            </Card>

            {/* Gallery */}
            {college.galleryUrls && college.galleryUrls.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {college.galleryUrls.map((url: string, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="relative w-full h-48">
                        <Image
                          src={url}
                          alt={`${college.name} - Image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* About */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">About the College</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {college.about}
              </div>
            </Card>

            {/* Registration Section */}
            {college.googleFormUrl && (
              <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
                <p className="mb-6 text-gray-100">
                  Fill out our application form to start your admission process to {college.name}.
                </p>
                <a href={college.googleFormUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="accent">
                    Fill Application Form
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Fee Structure */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Fee Structure (Annual)</h3>
              <div className="space-y-3">
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Tuition Fee</span>
                  <span className="font-semibold">{formatCurrency(fees.tuition)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Hostel Fee</span>
                  <span className="font-semibold">{formatCurrency(fees.hostel)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b">
                  <span className="text-gray-600">Other Fees</span>
                  <span className="font-semibold">{formatCurrency(fees.other)}</span>
                </div>
                <div className="flex justify-between pt-2 text-lg">
                  <span className="font-bold">Total Annual Fee</span>
                  <span className="font-bold text-primary">{formatCurrency(fees.total)}</span>
                </div>
              </div>
            </Card>

            {/* Courses Offered */}
            {courses && courses.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Courses Offered</h3>
                <div className="space-y-2">
                  {courses.map((course: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{course}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Key Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-semibold">{college.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-semibold">{college.location}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                    Accepting Applications
                  </span>
                </div>
              </div>
            </Card>

            {/* Contact CTA */}
            <Card className="p-6 bg-gray-50">
              <h3 className="text-lg font-bold mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Our counselors are here to answer your questions and guide you through the admission process.
              </p>
              <Link href="/contact">
                <Button variant="primary" className="w-full">
                  Get Free Consultation
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}