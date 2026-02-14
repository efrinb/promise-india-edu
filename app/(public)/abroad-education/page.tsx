import { Card } from '@/components/ui/Card';
import { Plane, Globe, GraduationCap } from 'lucide-react';

export default function AbroadEducationPage() {
  return (
    <div className="section">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Abroad Education</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Coming Soon - Study abroad opportunities and international education guidance
          </p>
        </div>

        <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-secondary/5">
          <Globe className="h-32 w-32 text-primary/30 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Expanding Horizons</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            We are currently expanding our services to include abroad education consultation.
            Soon, you'll be able to explore international nursing programs and educational
            opportunities across the globe with our expert guidance.
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <Plane className="h-5 w-5" />
              <span>International Programs</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <GraduationCap className="h-5 w-5" />
              <span>Visa Assistance</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
