'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
  'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const BRANCHES = [
  'Biomaths',
  'Computer Science',
  'Commerce',
  'Humanities',
  'Others'
];

const NURSING_COURSES = [
  'GNM (General Nursing and Midwifery)',
  'BSc Nursing',
  'MSc Nursing',
  'Post Basic BSc Nursing',
  'ANM (Auxiliary Nurse Midwifery)',
  'Diploma in Nursing',
  'Certificate in Nursing',
  'Other'
];

const INQUIRY_TYPES = {
  apply: {
    title: 'Apply for Admission',
    description: 'Fill out the form below to start your admission process',
    buttonText: 'Submit Application',
    icon: '🎓',
  },
  consultation: {
    title: 'Request Free Consultation',
    description: 'Get personalized guidance from our expert counselors',
    buttonText: 'Book Consultation',
    icon: '💬',
  },
  visit: {
    title: 'Schedule Office Visit',
    description: 'Visit our office for in-person consultation',
    buttonText: 'Schedule Visit',
    icon: '📅',
  },
  general: {
    title: 'Get in Touch',
    description: 'Have questions? We\'re here to help',
    buttonText: 'Send Message',
    icon: '✉️',
  },
};

function ContactForm() {
  const searchParams = useSearchParams();
  const inquiryTypeParam = searchParams.get('type') || 'general';
  const sourceParam = searchParams.get('source') || 'direct';

  const inquiryType = (inquiryTypeParam in INQUIRY_TYPES)
    ? inquiryTypeParam as keyof typeof INQUIRY_TYPES
    : 'general';

  const inquiry = INQUIRY_TYPES[inquiryType];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fatherOccupation: '',
    dateOfBirth: '',
    gender: '',
    state: '',
    city: '',
    branch: '',
    preferredCourse: '',
    message: '',
    inquiryType: inquiryType,
    source: sourceParam,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (response.ok) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          fatherOccupation: '',
          dateOfBirth: '',
          gender: '',
          state: '',
          city: '',
          branch: '',
          preferredCourse: '',
          message: '',
          inquiryType: inquiryType,
          source: sourceParam,
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);

        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container-custom">
        {/* Header with Icon */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{inquiry.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{inquiry.title}</h1>
          <p className="text-xl text-text-light dark:text-gray-400 max-w-3xl mx-auto">
            {inquiry.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            {success && (
              <div className="mb-6 p-4 bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-800 rounded-lg animate-fade-in">
                <p className="text-secondary-800 dark:text-secondary-300 font-medium">
                  ✓ Thank you! We've received your request and will contact you soon.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-lg">
                <p className="text-accent-800 dark:text-accent-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary dark:text-primary-400">Personal Information</h3>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your full name"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+91 9876543210"
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Show additional fields only for apply type */}
                  {inquiryType === 'apply' && (
                    <>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          label="Date of Birth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gender
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="input"
                          >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <Input
                        label="Father's Occupation"
                        type="text"
                        value={formData.fatherOccupation}
                        onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                        placeholder="e.g., Teacher, Businessman, Doctor"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Location Information */}
              {inquiryType === 'apply' ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary dark:text-primary-400">Location</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="input"
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="City"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              ) : (
                <Input
                  label="City"
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Your city"
                />
              )}

              {/* Educational Information - Only for apply */}
              {inquiryType === 'apply' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary dark:text-primary-400">Educational Background</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Branch/Stream
                      </label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="input"
                      >
                        <option value="">Select Branch</option>
                        {BRANCHES.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Course
                      </label>
                      <select
                        value={formData.preferredCourse}
                        onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
                        className="input"
                      >
                        <option value="">Select Preferred Course</option>
                        {NURSING_COURSES.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="textarea"
                  placeholder="Tell us about your interests and questions..."
                />
              </div>

              <Button
                type="submit"
                variant="danger"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    {inquiry.buttonText}
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Email */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Email</h3>
                  <a href={`mailto:${settings?.adminEmail || 'info@promiseindia.com'}`}
                    className="text-text-light dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors"
                  >
                    {settings?.adminEmail || 'info@promiseindia.com'}
                  </a>
                </div>
              </div>
            </Card>

            {/* Phone */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Phone</h3>
                  <a href={`tel:${settings?.phone || '+919876543210'}`}
                    className="text-text-light dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors"
                  >
                    {settings?.phone || '+91 9876543210'}
                  </a>
                </div>
              </div>
            </Card>

            {/* WhatsApp - Only show if URL exists */}
            {
              settings?.whatsappUrl && (
                <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="bg-green-500/10 p-3 rounded-full">
                      <MessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-1 text-green-900 dark:text-green-300">WhatsApp</h3>
                      <p className="text-green-700 dark:text-green-400 text-sm mb-2">Chat with us directly</p>

                      <a href={settings.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Chat
                      </a>
                    </div>
                  </div>
                </Card >
              )
            }

            {/* Location */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Location</h3>
                  <p className="text-text-light dark:text-gray-400">
                    {settings?.address || 'Kochi, Kerala, India'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Office Hours */}
            <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white">
              <h3 className="text-xl font-bold mb-3">Office Hours</h3>
              <div className="space-y-2 text-gray-100">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </Card>

            {/* Quick Contact Note */}
            <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>Need immediate assistance?</strong><br />
                Call us during office hours or send us a message on WhatsApp for faster response.
              </p>
            </Card>

            {/* Different CTA based on inquiry type */}
            {
              inquiryType !== 'apply' && (
                <Card className="p-6 bg-accent/10 border-accent/20">
                  <h3 className="font-bold mb-2 text-accent">Ready to Apply?</h3>
                  <p className="text-sm text-text-light dark:text-gray-400 mb-4">
                    Start your admission process now by filling out our application form.
                  </p>
                  <a href="/contact?type=apply&source=contact_cta">
                    <Button variant="danger" className="w-full">
                      Start Application
                    </Button>
                  </a>
                </Card>
              )
            }
          </div >
        </div >
      </div >
    </div >
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="section">
        <div className="container-custom">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-light dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}