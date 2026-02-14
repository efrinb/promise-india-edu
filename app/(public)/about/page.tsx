import { Card } from '@/components/ui/Card';
import { Target, Eye, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Promise India</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Empowering students to achieve their nursing education dreams through transparent guidance and unwavering support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To empower aspiring nurses with access to quality education by providing comprehensive guidance,
                  transparent information, and unwavering support throughout their admission journey.
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
                <p className="text-gray-700 leading-relaxed">
                  To become India's most trusted education consultancy, known for ethical practices and
                  contributing to building a skilled nursing workforce that serves with excellence.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-bold mb-2">Verified Colleges</h4>
              <p className="text-gray-600 text-sm">Only accredited institutions with proven track records</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h4 className="font-bold mb-2">Expert Counselors</h4>
              <p className="text-gray-600 text-sm">Personalized guidance from experienced professionals</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-accent" />
              </div>
              <h4 className="font-bold mb-2">End-to-End Support</h4>
              <p className="text-gray-600 text-sm">Complete assistance from selection to admission</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
