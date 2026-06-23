import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed operations...');

  // 1. Seed Site Statistics
  console.log('Seeding Site Statistics...');
  await prisma.siteStatistic.deleteMany();
  const statistics = [
    { value: '2500+', label: 'Students Guided', icon: 'GraduationCap', order: 1 },
    { value: '100+', label: 'Partner Colleges', icon: 'Landmark', order: 2 },
    { value: '12+', label: 'Years of Experience', icon: 'Award', order: 3 },
    { value: '98%', label: 'Success Rate', icon: 'Users', order: 4 },
  ];
  for (const stat of statistics) {
    await prisma.siteStatistic.create({ data: stat });
  }

  // 2. Seed Course Programs
  console.log('Seeding Course Programs...');
  await prisma.courseProgram.deleteMany();
  const programs = [
    {
      title: 'BSc Nursing',
      duration: '4 Years',
      description: 'Comprehensive undergraduate program that prepares you for a professional nursing career.',
      bullets: ['Theory & Practical Training', 'Clinical Experience', 'Career Opportunities'],
      slug: 'bsc-nursing',
      icon: 'Stethoscope',
      order: 1,
    },
    {
      title: 'GNM',
      duration: '3 Years',
      description: 'General Nursing and Midwifery diploma program with focused training in nursing fundamentals.',
      bullets: ['Hands-on Training', 'Hospital Internships', 'Government Approved'],
      slug: 'gnm',
      icon: 'BriefcaseMedical',
      order: 2,
    },
    {
      title: 'Post Basic BSc Nursing',
      duration: '2 Years',
      description: 'Advanced program for diploma holders to upgrade their qualification to graduate level.',
      bullets: ['Advanced Nursing Concepts', 'Leadership Training', 'Better Career Growth'],
      slug: 'post-basic-bsc-nursing',
      icon: 'BookOpen',
      order: 3,
    },
    {
      title: 'MSc Nursing',
      duration: '2 Years',
      description: 'Postgraduate program for specialized knowledge and advanced nursing practice.',
      bullets: ['Specialization Options', 'Research & Development', 'Higher Career Prospects'],
      slug: 'msc-nursing',
      icon: 'GraduationCap',
      order: 4,
    },
    {
      title: 'International Programs',
      duration: 'Varies',
      description: 'Study & work opportunities in top countries like Germany, UK, Canada and more.',
      bullets: ['Global Exposure', 'Work Opportunities', 'Career Settlement Support'],
      slug: 'international-programs',
      icon: 'Globe2',
      order: 5,
    },
  ];
  for (const prog of programs) {
    await prisma.courseProgram.create({ data: prog });
  }

  // 3. Seed Admission Steps
  console.log('Seeding Admission Steps...');
  await prisma.admissionStep.deleteMany();
  const steps = [
    {
      stepNumber: 1,
      title: 'Counseling',
      description: 'Free expert counseling session to understand your interest, academic background, and career goals.',
      icon: 'Users',
    },
    {
      stepNumber: 2,
      title: 'Course & College Selection',
      description: 'We help you choose the right nursing program and college based on your preferences and eligibility.',
      icon: 'FileText',
    },
    {
      stepNumber: 3,
      title: 'Documentation',
      description: 'We assist you in collecting and verifying all the required documents for a smooth admission process.',
      icon: 'FileCheck',
    },
    {
      stepNumber: 4,
      title: 'Admission Confirmation',
      description: 'Secure your admission and start your journey towards a successful nursing career.',
      icon: 'CheckSquare',
    },
  ];
  for (const step of steps) {
    await prisma.admissionStep.create({ data: step });
  }

  // 4. Seed Team Members
  console.log('Seeding Team Members...');
  await prisma.teamMember.deleteMany();
  const team = [
    {
      name: 'Anjali Sharma',
      role: 'Founder & Director',
      description: 'Education expert with 15+ years of experience in nursing admissions and student counseling.',
      image: '/uploads/team/anjali-sharma.jpg',
      facebook: '#',
      instagram: '#',
      linkedin: '#',
      order: 1,
    },
    {
      name: 'Rahul Verma',
      role: 'Chief Admission Counselor',
      description: 'Specialized in career counseling and guiding students to the best nursing opportunities.',
      image: '/uploads/team/rahul-verma.jpg',
      facebook: '#',
      instagram: '#',
      linkedin: '#',
      order: 2,
    },
    {
      name: 'Neha Iyer',
      role: 'Senior Counselor',
      description: 'Expert in college shortlisting, documentation, and admission process support.',
      image: '/uploads/team/neha-iyer.jpg',
      facebook: '#',
      instagram: '#',
      linkedin: '#',
      order: 3,
    },
    {
      name: 'Vikram Singh',
      role: 'Student Support Manager',
      description: 'Ensures a smooth experience for students and parents at every step of the journey.',
      image: '/uploads/team/vikram-singh.jpg',
      facebook: '#',
      instagram: '#',
      linkedin: '#',
      order: 4,
    },
  ];
  for (const member of team) {
    await prisma.teamMember.create({ data: member });
  }

  // 5. Seed FAQs
  console.log('Seeding FAQs...');
  await prisma.faq.deleteMany();
  const faqs = [
    {
      question: 'Is the counseling service free?',
      answer: 'Yes, our counseling service is completely free with no hidden charges.',
      order: 1,
    },
    {
      question: 'How can I apply for admission?',
      answer: 'You can apply through phone, WhatsApp, or email. Our counselors will guide you through the college and course selection process.',
      order: 2,
    },
    {
      question: 'Which documents are required?',
      answer: 'Basic documents include 10th and 12th mark sheets, ID proof, and passport size photos.',
      order: 3,
    },
    {
      question: 'Do you assist with hostel?',
      answer: 'Yes, we help with hostel arrangements and provide complete support.',
      order: 4,
    },
  ];
  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }

  // 6. Update general settings with standard contact info matching the mockups
  console.log('Updating settings...');
  const settings = await prisma.settings.findFirst();
  if (settings) {
    await prisma.settings.update({
      where: { id: settings.id },
      data: {
        phone: '+91 98765 43210',
        adminEmail: 'info@promiselandeducation.com',
        address: '123, Education Hub, 2nd Floor, Anna Nagar, Chennai - 600040, Tamil Nadu, India',
        whatsappUrl: 'https://wa.me/919876543210',
      },
    });
  } else {
    await prisma.settings.create({
      data: {
        phone: '+91 98765 43210',
        adminEmail: 'info@promiselandeducation.com',
        address: '123, Education Hub, 2nd Floor, Anna Nagar, Chennai - 600040, Tamil Nadu, India',
        whatsappUrl: 'https://wa.me/919876543210',
        announcementEnabled: false,
      },
    });
  }

  console.log('Seed operations completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
