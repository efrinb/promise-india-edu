import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye, Heart, Users, Award, Shield, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const OFFICE_GALLERY = [
  {
    src: '/gallery/reception-area.jpg',
    alt: 'Promise India Office Reception',
    title: 'Modern Reception Area'
  },
  {
    src: '/gallery/consultation-room.jpg',
    alt: 'Consultation Room',
    title: 'Consultation Room'
  },
  {
    src: '/gallery/counseling-area.jpg',
    alt: 'Counseling Area',
    title: 'Student Counseling Area'
  },
  // {
  //   src: '/gallery/office-4.jpg',
  //   alt: 'Team Meeting',
  //   title: 'Our Team at Work'
  // },
  // {
  //   src: '/gallery/office-5.jpg',
  //   alt: 'Office Interior',
  //   title: 'Office Interior'
  // },
  // {
  //   src: '/gallery/office-6.jpg',
  //   alt: 'Waiting Area',
  //   title: 'Comfortable Waiting Area'
  // },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary py-20">
        <div className="container-custom">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Promise India</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100">
              Your trusted partner in nursing education, dedicated to empowering aspiring nurses with transparent guidance and unwavering support.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    To empower aspiring nurses with access to quality education by providing comprehensive guidance,
                    transparent information, and unwavering support throughout their admission journey to the best
                    nursing institutions in India. We strive to make nursing education accessible, affordable, and
                    transparent for every student who dreams of serving in healthcare.
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
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    To become India's most trusted education consultancy, known for ethical practices, student-first
                    approach, and contributing to building a skilled nursing workforce that serves the nation with
                    excellence and compassion. We envision a future where every aspiring nurse has access to transparent,
                    reliable guidance for their educational journey.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Promise India Education Consultancy was founded with a simple yet powerful vision: to make quality nursing
              education accessible to every aspiring healthcare professional. We recognized the challenges students face
              in navigating the complex admission process and the lack of transparent information about colleges and fees.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4">
              Today, we have helped hundreds of students achieve their dreams of becoming skilled nurses, working with
              top institutions across India. Our commitment to transparency, personalized guidance, and ethical practices
              has made us a trusted name in education consultancy.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p className="text-gray-600">
                Complete honesty about fees, processes, and college information with no hidden charges.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Student-First</h3>
              <p className="text-gray-600">
                Every decision we make is centered around what's best for our students' future.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Commitment to providing the highest quality guidance and service at every step.
              </p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="text-gray-600">
                Ethical practices and honest advice, even when it's not the easiest path.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Office Gallery */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Office</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit us at our modern facility designed to provide comfortable and professional consultancy services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {OFFICE_GALLERY.map((image, index) => (
              <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-semibold text-lg">{image.title}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Card className="inline-block p-6 bg-primary/5 border-primary/20">
              <p className="text-lg mb-4">
                <strong>Visit Our Office:</strong> Experience personalized guidance in a professional setting
              </p>
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  Schedule a Visit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Promise India?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What sets us apart in education consultancy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Verified Institutions</h3>
                <p className="text-gray-600">
                  We partner only with accredited and recognized nursing colleges with proven track records.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-secondary/10 p-3 rounded-full flex-shrink-0">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Personalized Guidance</h3>
                <p className="text-gray-600">
                  One-on-one counseling tailored to your academic background and career goals.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-accent/10 p-3 rounded-full flex-shrink-0">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Transparent Fees</h3>
                <p className="text-gray-600">
                  Clear, upfront information about all costs with no hidden charges or surprises.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">End-to-End Support</h3>
                <p className="text-gray-600">
                  Complete assistance from college selection to admission completion and beyond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Nursing Journey?
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Let us guide you towards the right nursing college that matches your aspirations and goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colleges">
              <Button variant="secondary" size="lg">
                Explore Colleges
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Book Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}