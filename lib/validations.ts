import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const collegeSchema = z.object({
  name: z.string().min(3, 'College name must be at least 3 characters'),
  category: z.enum(['Nursing', 'Physiotherapy', 'Abroad', 'Other']),
  location: z.string().min(3, 'Location is required'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  about: z.string().min(50, 'About section must be at least 50 characters'),
  courses: z.array(z.string()).default([]),
  fees: z.object({
    year1: z.number().min(0),
    year2: z.number().min(0),
    year3: z.number().min(0),
    year4: z.number().min(0),
    hostel: z.number().min(0).optional(),
    other: z.number().min(0).optional(),
    total: z.number().min(0),
  }),
  admissionStatus: z.enum(['open', 'closing_soon', 'closed']).default('open'),
  featured: z.boolean().default(false),
  thumbnailUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).default([]),
  videoUrls: z.array(z.string()).default([]),  // NEW
  googleFormUrl: z.string().nullable().optional().transform(val => {
    if (val === '' || val === undefined) return null;
    return val;
  }),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Invalid email address'),
  fatherOccupation: z.string().optional(),
  dateOfBirth: z.string().optional().transform(val => {
    if (!val) return null;
    return new Date(val);
  }),
  gender: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  branch: z.string().optional(),
  preferredCourse: z.string().optional(),
  message: z.string().optional(),
  inquiryType: z.enum(['apply', 'consultation', 'visit', 'general']).default('general'),
  source: z.enum(['homepage', 'college_detail', 'direct', 'mobile_cta']).default('direct'),
});

export const settingsSchema = z.object({
  adminEmail: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsappUrl: z.string().optional().transform(val => {
    if (val === '') return null;
    return val;
  }),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  announcementEnabled: z.boolean().default(false),
  announcementText: z.string().optional(),
});

export const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['admin', 'super_admin']).default('admin'),
});

export const bannerSchema = z.object({
  uniqueId: z.string().min(3, 'Unique ID must be at least 3 characters').regex(/^[a-zA-Z0-9-_]+$/, 'Only alphanumeric characters, hyphens, and underscores allowed'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageUrl: z.string().min(1, 'Image is required'),
  width: z.enum(['full', 'container', 'large', 'medium']).default('full'),
  message: z.string().optional(),
  startDate: z.string().transform(val => new Date(val)),
  endDate: z.string().transform(val => new Date(val)),
  active: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});