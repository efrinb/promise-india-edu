export interface College {
  id: string;
  name: string;
  slug: string;
  category: string;
  location: string;
  shortDescription: string;
  about: string;
  courses: string[];  // Add this line
  fees: {
    tuition: number;
    hostel: number;
    other: number;
    total: number;
  };
  featured: boolean;
  thumbnailUrl: string | null;
  galleryUrls: string[];
  googleFormUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {  // Fixed: Changed from lowercase 'consultation' to 'Consultation'
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string | null;
  message: string | null;
  status: string;
  notified: boolean;  // Add this line (for notification tracking)
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;  // Add this line
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;  // Add this line
}

export interface Settings {
  id: string;
  adminEmail: string;
  phone: string | null;
  address: string | null;
  whatsappUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}