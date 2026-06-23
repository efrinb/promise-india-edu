// Static placeholder data for the v2 homepage redesign.
// Phase 2/3 (per redesign plan) will move these into Prisma-backed
// models (SiteStatistic, Program, Testimonial) and admin CRUD screens.

export const heroContent = {
  eyebrow: 'Excellence in Nursing Education',
  title: 'Start Your Nursing Career with Expert Admission Guidance',
  description:
    'We help students secure admissions in top nursing colleges across India with complete support from counseling to enrollment.',
  primaryButton: { label: 'Apply Now', href: '/contact?type=consultation&source=hero' },
  secondaryButton: { label: 'Free Consultation', href: '/contact?type=consultation&source=hero' },
  image: '/uploads/hero/nurse-hero.jpg',
  badge: {
    value: '12+',
    label: 'Years of Excellence in Nursing Admissions',
  },
  trustedAvatars: [
    '/uploads/avatars/avatar-1.jpg',
    '/uploads/avatars/avatar-2.jpg',
    '/uploads/avatars/avatar-3.jpg',
    '/uploads/avatars/avatar-4.jpg',
  ],
  trustedText: 'Trusted by 2500+ Students & Parents',
};

export const statistics = [
  { value: '2500+', label: 'Students Admitted', description: 'Successfully placed', icon: 'GraduationCap' },
  { value: '100+', label: 'Partner Colleges', description: 'Across India', icon: 'Landmark' },
  { value: '12+', label: 'Years Experience', description: 'In education industry', icon: 'Award' },
  { value: '98%', label: 'Success Rate', description: 'Student satisfaction', icon: 'Users' },
];

export const programs = [
  {
    title: 'BSc Nursing',
    description: '4 Year undergraduate program with excellent career opportunities.',
    slug: 'bsc-nursing',
    icon: 'Stethoscope',
  },
  {
    title: 'GNM',
    description: '3 Year diploma program approved by INC & State Nursing Council.',
    slug: 'gnm',
    icon: 'BriefcaseMedical',
  },
  {
    title: 'Post Basic BSc Nursing',
    description: '2 Year program for diploma holders to upgrade their career.',
    slug: 'post-basic-bsc-nursing',
    icon: 'BookOpen',
  },
  {
    title: 'MSc Nursing',
    description: '2 Year postgraduate program with specialized nursing education.',
    slug: 'msc-nursing',
    icon: 'GraduationCap',
  },
  {
    title: 'International Nursing Programs',
    description: 'Study & work opportunities in top countries like Germany, UK, Canada.',
    slug: 'international-nursing-programs',
    icon: 'Globe2',
  },
];

export const admissionSteps = [
  {
    step: 1,
    title: 'Counseling',
    description: 'Free career counseling session to understand your interest and goals.',
    icon: 'Users',
  },
  {
    step: 2,
    title: 'Course Selection',
    description: 'Choose the right nursing program and college as per your preference.',
    icon: 'FileText',
  },
  {
    step: 3,
    title: 'Documentation',
    description: 'We assist you in collecting and verifying all required documents.',
    icon: 'FileCheck',
  },
  {
    step: 4,
    title: 'Admission Confirmation',
    description: 'Secure your admission and start your journey towards success.',
    icon: 'Landmark',
  },
];

export const testimonials = [
  {
    name: 'Anjali Sharma',
    role: 'BSc Nursing Student',
    avatar: '/uploads/avatars/anjali.jpg',
    initials: "AS",
    content:
      'Promise India Education guided me throughout the admission process. Today I am pursuing BSc Nursing in my dream college.',
  },
  {
    name: 'Neha Verma',
    role: 'GNM Student',
    avatar: '/uploads/avatars/neha.jpg',
    initials: "NV",
    content:
      'The team is very supportive and professional. They made my admission process smooth and stress-free.',
  },
  {
    name: 'Priya Singh',
    role: 'International Student',
    avatar: '/uploads/avatars/priya.jpg',
    initials: "PS",
    content:
      'Thanks to Promise India, I got the opportunity to study Nursing in Germany. Highly recommended!',
  },
];

export const ctaContent = {
  title: 'Ready to Begin Your Nursing Career?',
  description: 'Get expert guidance and secure admission in top nursing colleges.',
  buttonLabel: 'Apply Now',
  buttonHref: '/contact?type=consultation&source=cta',
};
