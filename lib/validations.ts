import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
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
  featured: z.boolean().default(false),
  thumbnailUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).default([]),
  googleFormUrl: z.string().nullable().optional().transform(val => {
    if (val === '' || val === undefined) return null;
    return val;
  }),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const settingsSchema = z.object({
  adminEmail: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  whatsappUrl: z.string().optional().transform(val => val === '' ? null : val),
  facebookUrl: z.string().optional().transform(val => val === '' ? null : val),
  instagramUrl: z.string().optional().transform(val => val === '' ? null : val),
  twitterUrl: z.string().optional().transform(val => val === '' ? null : val),
  linkedinUrl: z.string().optional().transform(val => val === '' ? null : val),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ConsultationInput = z.infer<typeof consultationSchema>;
export type CollegeInput = z.infer<typeof collegeSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
