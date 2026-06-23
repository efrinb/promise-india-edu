'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, HelpCircle, CheckCircle, ArrowRight, UserCheck, Star, Headset, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchFaqs();
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

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faqs');
      const data = await response.json();
      if (response.ok) {
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
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

        // Scroll to top of page / view
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
    <div className="flex flex-col min-h-screen bg-background font-body-md text-on-surface">
      {/* 1. Header Section */}
      <section className="relative bg-primary pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-container rounded-full mix-blend-screen filter blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-fixed rounded-full mix-blend-screen filter blur-[100px]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block bg-secondary-container/20 text-secondary-fixed-dim px-3 py-1 rounded-full text-sm font-bold border border-secondary-fixed-dim/30 mb-6">
                Contact Us
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-on-primary mb-6 font-heading leading-tight">
                We're Here to Help You Achieve Your <span className="text-secondary">Dream</span>
              </h1>
              <p className="text-xl text-surface-variant max-w-xl mx-auto lg:mx-0 mb-8">
                Have questions about admissions, courses, or our services? Our expert counselors are ready to assist you.
              </p>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3] rounded-[30px] overflow-hidden border-4 border-on-primary/10 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                 <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1000"
                  alt="Counselor with headset smiling"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Info & Form */}
      <section className="py-20 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* Left Column - Get In Touch Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-[30px] p-8 border border-surface-variant shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <span className="text-secondary font-bold tracking-[0.2em] uppercase text-sm block mb-2">Get In Touch</span>
                <h2 className="text-3xl font-bold font-heading text-primary mb-6">We'd Love to Hear From You!</h2>
                <p className="text-on-surface-variant leading-relaxed mb-8">
                  Reach out to us through any of the following channels and we'll get back to you as soon as possible.
                </p>

                {/* Contact Cards */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex gap-4 p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1">Phone</h3>
                      <a href={`tel:${settings?.phone || '+919876543210'}`} className="text-on-surface-variant font-medium hover:text-secondary transition-colors block">
                        {settings?.phone || '+91 98765 43210'}
                      </a>
                      <span className="block text-sm text-on-surface-variant/70 mt-1">Mon - Sat: 9:00 AM - 7:00 PM</span>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  {settings?.whatsappUrl && (
                    <div className="flex gap-4 p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors">
                      <img src="/icons/whatsapp.svg" alt="WhatsApp" className="h-12 w-12 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary mb-1">WhatsApp</h3>
                        <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant font-medium hover:text-secondary transition-colors block">
                          {settings?.phone || '+91 98765 43210'}
                        </a>
                        <span className="block text-sm text-on-surface-variant/70 mt-1">Quick responses on WhatsApp</span>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="flex gap-4 p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1">Email</h3>
                      <a href={`mailto:${settings?.adminEmail || 'info@promiselandeducation.com'}`} className="text-on-surface-variant font-medium hover:text-secondary transition-colors block">
                        {settings?.adminEmail || 'info@promiselandeducation.com'}
                      </a>
                      <span className="block text-sm text-on-surface-variant/70 mt-1">We reply within 24 hours</span>
                    </div>
                  </div>

                  {/* Office Address */}
                  <div className="flex gap-4 p-4 rounded-2xl bg-surface hover:bg-surface-container transition-colors">
                    <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1">Office Address</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed max-w-[250px]">
                        {settings?.address || '123, Education Hub, 2nd Floor, Anna Nagar, Chennai - 600040, Tamil Nadu, India'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Submission Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-[40px] p-8 md:p-12 border border-surface-variant shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
                <div className="border-b border-surface-variant pb-6 mb-8">
                  <span className="text-4xl mr-3 align-middle">{inquiry.icon}</span>
                  <div className="inline-block align-middle">
                     <h3 className="font-heading text-2xl font-bold text-primary mb-1">{inquiry.title}</h3>
                     <p className="text-on-surface-variant">{inquiry.description}</p>
                  </div>
                </div>

                {success && (
                  <div className="mb-8 p-6 bg-secondary-container/30 border border-secondary/30 rounded-2xl flex items-start gap-4">
                     <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" />
                    <p className="text-primary font-bold">
                      Thank you! Your message has been sent successfully. One of our counselors will contact you shortly.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                     <HelpCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 font-bold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Full Name *</label>
                       <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      />
                    </div>

                     <div>
                       <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Phone Number *</label>
                       <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address *</label>
                       <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      />
                    </div>

                    {inquiryType === 'apply' ? (
                      <div>
                        <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">State *</label>
                        <select
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                          required
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                    ) : (
                       <div>
                       <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">City/Town</label>
                       <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Your city"
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      />
                    </div>
                    )}
                  </div>

                  {inquiryType === 'apply' && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Branch/Stream *</label>
                        <select
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                           className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                          required
                        >
                          <option value="">Select Branch</option>
                          {BRANCHES.map((branch) => (
                            <option key={branch} value={branch}>{branch}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Preferred Course *</label>
                        <select
                          value={formData.preferredCourse}
                          onChange={(e) => setFormData({ ...formData, preferredCourse: e.target.value })}
                           className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                          required
                        >
                          <option value="">Select Preferred Course</option>
                          {NURSING_COURSES.map((course) => (
                            <option key={course} value={course}>{course}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                      Message / Query Details *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                      placeholder="Please type your inquiries about fees, eligibility, etc..."
                      required
                    />
                  </div>

                  {/* Disclaimer Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer p-4 bg-surface rounded-xl">
                    <input
                      type="checkbox"
                      required
                      className="h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary mt-0.5 accent-secondary"
                    />
                    <span className="text-sm text-on-surface-variant leading-relaxed">
                      I agree to receive updates and counselor call-backs from Promise Land India Education.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl transition-colors shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        {inquiry.buttonText} <Send className="h-5 w-5 ml-2 text-secondary" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Location Google Map Mock & Benefits */}
      <section className="py-20 bg-surface border-y border-surface-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Map Frame — Google Maps Embed */}
            <div className="lg:col-span-6">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="h-8 w-8 text-secondary" />
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">Our Location</h2>
              </div>
              <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-[30px] overflow-hidden border border-outline-variant shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.4965822523217!2d80.2099873!3d13.0878368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526614e9daaaab%3A0x7c558e6ccdc73a5!2sAnna%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: 'absolute', inset: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Promise Land India Education Office Location"
                />
              </div>
            </div>

            {/* Why Contact Us */}
            <div className="lg:col-span-6 space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <Star className="h-8 w-8 text-secondary fill-secondary" />
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-primary">Why Contact Us?</h2>
              </div>

              <div className="space-y-6">
                {[
                  { title: 'Free Expert Counseling', desc: 'Get fully personalized guidance on admissions without paying any consulting fee.', icon: UserCheck },
                  { title: 'Quick Response', desc: 'Our dedicated counselor network responds to all inquiries within 24 business hours.', icon: Clock },
                  { title: 'Complete Support', desc: 'Enjoy end-to-end guidance starting from applications up to hostel setup.', icon: Headset },
                  { title: 'No Hidden Charges', desc: 'We promise a 100% transparent process with direct payments to nursing colleges.', icon: FileText }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 items-start p-6 bg-white rounded-2xl border border-surface-variant shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-2xl bg-secondary-container flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-7 w-7 text-secondary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-primary font-heading mb-2">{item.title}</h4>
                      <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FAQs Grid Section */}
      {faqs.length > 0 && (
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-secondary font-bold tracking-[0.2em] uppercase text-sm block mb-2">FAQ</span>
              <h2 className="text-4xl font-bold font-heading text-primary">Frequently Asked Questions</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {faqs.slice(0, 4).map((faq, idx) => {
                const icons = [HelpCircle, UserCheck, ShieldCheck, Clock];
                const Icon = icons[idx % icons.length];
                return (
                  <div key={faq.id} className="flex flex-col bg-white border border-surface-variant rounded-[30px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform">
                    <div className="h-14 w-14 rounded-2xl bg-surface-container flex items-center justify-center mb-6 flex-shrink-0">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h4 className="text-lg font-bold text-primary font-heading mb-4 leading-snug">{faq.question}</h4>
                    <p className="text-on-surface-variant leading-relaxed flex-grow">{faq.answer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. CTA Banner */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[40px] p-12 md:p-20 relative overflow-hidden text-center text-on-primary">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-on-primary rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10 font-heading text-white">Ready to Start Your Journey?</h2>
            <p className="text-xl text-surface-variant mb-10 max-w-2xl mx-auto relative z-10">
              Book a free consultation with our expert counselors today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 relative z-10">
              <Link href="/contact?type=apply&source=contact_cta" className="bg-secondary-container text-on-secondary-container px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl">
                Book Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-on-surface-variant">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}