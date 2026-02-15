# Promise India Education Consultancy

A modern, full-stack education consultancy platform built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL. The platform specializes in nursing college admissions with features for college listings, consultation management, and comprehensive admin controls.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Admin Setup](#admin-setup)
- [Customization](#customization)
- [Deployment](#deployment)
- [Security](#security)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Public Website

- **Landing Page**: Hero section, Mission & Vision, Why Choose Us, Featured Colleges, Call-to-Action sections
- **College Listings**: Browse colleges with search and filters (category, location, courses)
- **College Details**: Comprehensive college information with image galleries, fee structure, courses offered, and application forms
- **Image Management**: Upload and display college thumbnails and gallery images
- **Consultation Form**: Free consultation request with email notifications
- **Responsive Design**: Mobile-first approach optimized for all devices
- **Dynamic Content**: Real-time data from database

### Admin Panel

- **Dashboard**: Overview statistics for colleges and consultations
- **College Management**:
  - Create, read, update, delete colleges
  - Image uploads (thumbnail + gallery)
  - Course selection for nursing programs
  - Fee structure management
  - Draft/Published status control
  - Featured college designation
- **Consultation Management**:
  - View all consultation requests
  - Update status (pending/contacted)
  - Real-time notification badges
  - Filter by status
- **Admin Management** (Super Admin only):
  - Create new admins
  - Activate/deactivate admin accounts
  - Role management (Admin vs Super Admin)
  - Delete confirmation modals
- **Settings Management**:
  - Contact information
  - Social media links
  - WhatsApp integration
- **Secure Authentication**: Email/password login with JWT tokens
- **Notification System**: Real-time updates for new consultations

### Technical Features

- Server-side rendering (SSR)
- Static site generation (SSG) where applicable
- API routes with Next.js
- Form validation with client and server-side checks
- Image optimization with Next.js Image
- Responsive navigation with mobile menu
- Loading states and error handling
- Toast notifications

---

## 🛠 Tech Stack

| Category             | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js 14 (App Router), React 18, TypeScript |
| **Styling**          | Tailwind CSS, Custom CSS                      |
| **Backend**          | Next.js API Routes                            |
| **Database**         | PostgreSQL with Prisma ORM                    |
| **Authentication**   | JWT with httpOnly cookies, bcrypt             |
| **Email**            | Nodemailer with SMTP                          |
| **Validation**       | Zod schemas                                   |
| **Icons**            | Lucide React                                  |
| **File Upload**      | Native Node.js (fs module)                    |
| **State Management** | React Context API                             |

---

## 📦 Prerequisites

Before installation, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **PostgreSQL** 12.x or higher
- **SMTP Email Service** (Gmail, SendGrid, Mailgun, etc.)
- **Git** (optional, for cloning)

---

## 🚀 Installation

### 1. Clone or Download Project

```bash
# If using Git
git clone <repository-url>
cd promise-india-edu

# Or extract from ZIP file
cd promise-india-edu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Secret (Generate a strong random string)
JWT_SECRET="your-secure-random-string-min-32-characters"

# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**SMTP Setup Tips:**

- **Gmail**: Enable 2-Factor Authentication and create an App Password
- **SendGrid/Mailgun**: Use their API credentials and SMTP settings
- **Development**: Use [Ethereal Email](https://ethereal.email) for testing

### 4. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:push
```

### 5. Create Initial Super Admin

Run the setup script to create your first super admin:

```bash
npm run setup
```

Follow the interactive prompts to enter:

- Full Name
- Email Address
- Password (min 8 characters)
- Company information (optional)

**Example:**

```
=== Promise India - Initial Setup ===

--- Create Super Admin ---

Full Name: John Doe
Email: admin@yourdomain.com
Password: ********
Confirm Password: ********

✅ Super Admin created successfully!
   Email: admin@yourdomain.com
   Name: John Doe

📋 Next steps:
1. Start the server: npm run dev
2. Login at: /admin/login
3. Update settings via Settings page
4. Add colleges via Colleges → Add New
5. IMPORTANT: Change your password in admin panel
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Access Admin Panel

Navigate to: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Login with the credentials you created in step 5.

---

## 📁 Project Structure

```
promise-india-edu/
├── app/
│   ├── (public)/                 # Public-facing pages
│   │   ├── layout.tsx            # Public layout (Header + Footer)
│   │   ├── page.tsx              # Landing page
│   │   ├── colleges/
│   │   │   ├── page.tsx          # Colleges listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # College detail
│   │   ├── about/page.tsx        # About page
│   │   ├── contact/page.tsx      # Contact page
│   │   └── abroad-education/page.tsx
│   ├── admin/                    # Admin panel
│   │   ├── layout.tsx            # Admin layout (Sidebar + Auth)
│   │   ├── login/page.tsx        # Login page
│   │   ├── page.tsx              # Dashboard
│   │   ├── colleges/
│   │   │   ├── page.tsx          # Colleges list
│   │   │   ├── new/page.tsx      # Create college
│   │   │   └── [id]/edit/page.tsx # Edit college
│   │   ├── consultations/
│   │   │   └── page.tsx          # Consultations management
│   │   └── settings/
│   │       ├── page.tsx          # Settings
│   │       └── admins/page.tsx   # Admin management
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Login endpoint
│   │   │   ├── logout/route.ts   # Logout endpoint
│   │   │   └── me/route.ts       # Current user
│   │   ├── admin/
│   │   │   ├── route.ts          # Admin CRUD
│   │   │   └── [id]/route.ts
│   │   ├── colleges/
│   │   │   ├── route.ts          # College list/create
│   │   │   └── [id]/route.ts     # College get/update/delete
│   │   ├── consultations/
│   │   │   ├── route.ts          # Consultation list/create
│   │   │   └── [id]/route.ts     # Update status
│   │   ├── notifications/route.ts # Notification count
│   │   ├── settings/route.ts     # Settings management
│   │   └── upload/route.ts       # File upload
│   ├── icon.tsx                  # Favicon (32x32)
│   ├── apple-icon.tsx            # Apple touch icon (180x180)
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── public/
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Site footer
│   ├── admin/
│   │   └── CollegeForm.tsx       # College create/edit form
│   └── ui/
│       ├── Button.tsx            # Reusable button
│       ├── Input.tsx             # Reusable input
│       └── Card.tsx              # Card components
├── context/
│   └── NotificationContext.tsx   # Global notification state
├── lib/
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # JWT utilities
│   ├── email.ts                  # Email service
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Helper functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed script (dev only)
├── scripts/
│   ├── setup-production.ts       # Initial setup script
│   ├── create-superadmin.ts      # Create admin script
│   └── change-password.ts        # Password reset script
├── types/
│   └── index.ts                  # TypeScript interfaces
├── public/
│   ├── favicon.svg               # Site favicon
│   └── uploads/
│       └── colleges/             # Uploaded college images
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.js                # Next.js config
└── README.md                     # This file
```

---

## 🗄 Database Schema

### Admin

```prisma
model Admin {
  id         String   @id @default(cuid())
  email      String   @unique
  password   String   // bcrypt hashed
  name       String
  role       String   @default("admin") // "admin" | "super_admin"
  active     Boolean  @default(true)
  createdBy  String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### College

```prisma
model College {
  id               String   @id @default(cuid())
  name             String
  slug             String   @unique
  category         String   // "Nursing" | "Abroad" | "Other"
  location         String
  shortDescription String
  about            String   @db.Text
  courses          String[] @default([])
  fees             Json     // { tuition, hostel, other, total }
  featured         Boolean  @default(false)
  thumbnailUrl     String?
  galleryUrls      String[] @default([])
  googleFormUrl    String?
  status           String   @default("draft") // "draft" | "published"
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### Consultation

```prisma
model Consultation {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String
  city      String?
  message   String?  @db.Text
  status    String   @default("pending") // "pending" | "contacted"
  notified  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Settings

```prisma
model Settings {
  id           String   @id @default(cuid())
  adminEmail   String
  phone        String?
  address      String?
  whatsappUrl  String?
  facebookUrl  String?
  instagramUrl String?
  twitterUrl   String?
  linkedinUrl  String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 🔌 API Documentation

### Public Endpoints

#### Get Colleges

```http
GET /api/colleges?search=term&category=Nursing&location=Kerala
```

**Response:**

```json
{
  "colleges": [
    {
      "id": "...",
      "name": "College Name",
      "slug": "college-name",
      "category": "Nursing",
      "location": "City, State",
      "shortDescription": "...",
      "courses": ["BSc Nursing", "GNM"],
      "fees": {
        "tuition": 85000,
        "hostel": 45000,
        "other": 15000,
        "total": 145000
      },
      "featured": true,
      "thumbnailUrl": "/uploads/colleges/image.jpg",
      "status": "published"
    }
  ]
}
```

#### Get College by Slug

```http
GET /api/colleges/college-slug
```

#### Create Consultation

```http
POST /api/consultations
Content-Type: application/json

{
  "name": "Student Name",
  "phone": "+91 9876543210",
  "email": "student@example.com",
  "city": "Kochi",
  "message": "Optional message"
}
```

#### Get Settings

```http
GET /api/settings
```

### Admin Endpoints (Requires Authentication)

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

#### Get Current Admin

```http
GET /api/auth/me
Cookie: token=<jwt-token>
```

#### Create College

```http
POST /api/colleges
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "name": "College Name",
  "category": "Nursing",
  "location": "City, State",
  "shortDescription": "Brief description",
  "about": "Detailed information",
  "courses": ["BSc Nursing", "MSc Nursing"],
  "fees": {
    "tuition": 85000,
    "hostel": 45000,
    "other": 15000,
    "total": 145000
  },
  "featured": false,
  "thumbnailUrl": "/uploads/colleges/image.jpg",
  "galleryUrls": ["/uploads/colleges/1.jpg"],
  "googleFormUrl": "https://forms.gle/...",
  "status": "published"
}
```

#### Update College

```http
PUT /api/colleges/:id
Cookie: token=<jwt-token>
Content-Type: application/json

{
  // Same structure as create
}
```

#### Delete College

```http
DELETE /api/colleges/:id
Cookie: token=<jwt-token>
```

#### Get All Consultations

```http
GET /api/consultations
Cookie: token=<jwt-token>
```

#### Update Consultation Status

```http
PATCH /api/consultations/:id
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "status": "contacted"
}
```

#### Upload Images

```http
POST /api/upload
Cookie: token=<jwt-token>
Content-Type: multipart/form-data

files: <File>[]
```

#### Create Admin (Super Admin Only)

```http
POST /api/admin
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "password": "password123",
  "name": "Admin Name",
  "role": "admin"
}
```

#### Update Settings

```http
PUT /api/settings
Cookie: token=<jwt-token>
Content-Type: application/json

{
  "adminEmail": "info@example.com",
  "phone": "+91 1234567890",
  "address": "Office Address",
  "whatsappUrl": "https://wa.me/911234567890",
  "facebookUrl": "https://facebook.com/page",
  "instagramUrl": "https://instagram.com/page"
}
```

---

## 👤 Admin Setup

### Creating Your First Super Admin

After installation, create your super admin account:

```bash
npm run setup
```

Or manually:

```bash
npm run create:admin
```

### Admin Roles

**Super Admin:**

- All admin permissions
- Can create/manage other admins
- Can activate/deactivate admin accounts
- Cannot be deleted by other admins
- Full system access

**Regular Admin:**

- Manage colleges
- Manage consultations
- Update settings
- Cannot manage other admins

### Managing Additional Admins

1. Login as Super Admin
2. Navigate to **Settings → Admin Management**
3. Click **Add Admin**
4. Fill in details and assign role
5. New admin receives credentials via email (if configured)

### Changing Passwords

**Via Admin Panel:**

1. Login to admin panel
2. Go to Settings
3. Use "Change Password" form

**Via Command Line:**

```bash
npm run change:password
```

### Emergency Password Reset

If you're locked out:

1. Access your database directly
2. Run this SQL to reset password to "newpassword123":

```sql
UPDATE "Admin"
SET password = '$2a$10$...'
WHERE email = 'admin@example.com';
```

Then login and change it immediately.

---

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    DEFAULT: '#0B3C5D',  // Deep Blue
    50: '#E6EEF3',
    // ... other shades
  },
  secondary: {
    DEFAULT: '#1CA7A6',  // Soft Teal
    // ... other shades
  },
  accent: {
    DEFAULT: '#D9A441',  // Warm Gold
    // ... other shades
  },
}
```

### Content Updates

**Landing Page:**

- File: `app/(public)/page.tsx`
- Sections: Hero, Mission/Vision, Why Choose Us, Featured Colleges, CTA

**About Page:**

- File: `app/(public)/about/page.tsx`

**Contact Information:**

- Via Admin Panel: Settings page
- File: `components/public/Footer.tsx`

**Navigation Links:**

- File: `components/public/Header.tsx`

### Adding New Pages

1. Create page file in `app/(public)/your-page/page.tsx`
2. Add route to navigation in `components/public/Header.tsx`
3. Add link to footer if needed

### Nursing Courses List

Edit available courses in `components/admin/CollegeForm.tsx`:

```typescript
const NURSING_COURSES = [
  "GNM (General Nursing and Midwifery)",
  "BSc Nursing",
  "MSc Nursing",
  "Post Basic BSc Nursing",
  "ANM (Auxiliary Nurse Midwifery)",
  "Diploma in Nursing",
  "Certificate in Nursing",
  // Add your courses here
];
```

---

## 🚢 Deployment

### Environment Setup

1. **Database**: Use managed PostgreSQL (Railway, Supabase, AWS RDS)
2. **Email**: Configure production SMTP service
3. **Storage**: For images, consider cloud storage (Cloudinary, AWS S3)
4. **Domain**: Set up custom domain and SSL

### Platform-Specific Guides

#### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Import project in Vercel
3. Add environment variables:

```
   DATABASE_URL
   JWT_SECRET
   SMTP_HOST
   SMTP_PORT
   SMTP_USER
   SMTP_PASS
   SMTP_FROM
   NEXT_PUBLIC_APP_URL
```

4. Deploy

#### Railway

1. Create new project
2. Add PostgreSQL plugin (DATABASE_URL auto-configured)
3. Add environment variables
4. Connect GitHub repository
5. Deploy

#### DigitalOcean App Platform

1. Create app from repository
2. Add managed PostgreSQL database
3. Configure environment variables
4. Set build command: `npm run build`
5. Set run command: `npm run start`
6. Deploy

### Production Build

```bash
# Build application
npm run build

# Start production server
npm run start
```

### Post-Deployment Steps

1. Run setup script on production: `npm run setup`
2. Login and verify all features
3. Update settings via admin panel
4. Add real college data
5. Test email notifications
6. Configure backups for database
7. Set up monitoring (Sentry, LogRocket)
8. Add analytics (Google Analytics)

---

## 🔒 Security

### Best Practices

1. **Strong JWT Secret**: Use minimum 32 random characters
2. **Secure Passwords**: Enforce strong password policy (min 8 chars, mixed case, numbers)
3. **HTTPS Only**: Always use SSL in production
4. **Environment Variables**: Never commit `.env` file
5. **Database Security**: Use strong credentials and connection pooling
6. **Rate Limiting**: Implement on API routes (optional, recommended)
7. **Input Validation**: All user inputs validated with Zod
8. **File Upload**: Validate file types and sizes (5MB limit)
9. **XSS Protection**: React automatically escapes content
10. **SQL Injection**: Prisma uses parameterized queries

### Security Features Included

✅ Password hashing with bcrypt (10 rounds)
✅ JWT authentication with httpOnly cookies
✅ Protected admin routes
✅ Input validation (client + server)
✅ CSRF protection via httpOnly cookies
✅ Role-based access control
✅ SQL injection protection (Prisma ORM)
✅ XSS protection (React)

### Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT_SECRET (32+ chars)
- [ ] Enable HTTPS
- [ ] Use managed database with backups
- [ ] Secure SMTP credentials
- [ ] Enable 2FA on hosting platform
- [ ] Regular security updates (`npm audit`)
- [ ] Monitor access logs
- [ ] Set up error tracking

---

## 🛠 Available Scripts

```bash
# Development
npm run dev              # Start dev server (localhost:3000)

# Production
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema to database
npm run db:migrate       # Create migration file
npm run db:studio        # Open Prisma Studio GUI

# Admin Management
npm run setup            # Initial setup (create super admin)
npm run create:admin     # Create additional admin
npm run change:password  # Change admin password

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Problem:** Cannot connect to database

**Solutions:**

- Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/dbname`
- Check PostgreSQL is running: `pg_isready`
- Test connection: `psql $DATABASE_URL`
- Check firewall rules
- Ensure database exists

### Email Not Sending

**Problem:** Emails not being delivered

**Solutions:**

- Verify SMTP credentials
- For Gmail: Enable 2FA and create App Password
- Check spam folder
- Test with Ethereal Email: https://ethereal.email
- Verify SMTP port (usually 587 for TLS)
- Check firewall blocking SMTP ports

### Build Errors

**Problem:** Build fails with errors

**Solutions:**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run db:generate
npm run build
```

### Image Upload Not Working

**Problem:** Images not uploading

**Solutions:**

- Check directory exists: `mkdir -p public/uploads/colleges`
- Verify permissions: `chmod 755 public/uploads`
- Check file size limit (5MB max)
- Verify `next.config.js` has correct image domains

### Authentication Issues

**Problem:** Cannot login or session expires immediately

**Solutions:**

- Clear browser cookies
- Verify JWT_SECRET is set and consistent
- Check cookie settings in browser (must allow third-party cookies in dev)
- Ensure system time is correct (JWT expiry depends on time)

### TypeScript Errors

**Problem:** Type errors in development

**Solutions:**

```bash
# Regenerate Prisma types
npm run db:generate

# Restart TypeScript server in VS Code
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

---

## 📚 Additional Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### Useful Tools

- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Postman](https://www.postman.com/) - API testing
- [Ethereal Email](https://ethereal.email/) - Email testing
- [Favicon Generator](https://favicon.io/) - Create favicons

### Learning Resources

- [Next.js Learn](https://nextjs.org/learn)
- [Prisma Tutorial](https://www.prisma.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## 🎯 Future Enhancements

Potential features to implement:

- [ ] Advanced search with Algolia or ElasticSearch
- [ ] Email templates with React Email
- [ ] SMS notifications via Twilio
- [ ] Payment gateway integration
- [ ] Document uploads for applications
- [ ] Student dashboard/portal
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Export data to CSV/Excel
- [ ] Bulk operations for colleges
- [ ] Scheduled backups
- [ ] Two-factor authentication
- [ ] Social media login
- [ ] Blog/News section
- [ ] Testimonials management
- [ ] Career counseling booking system

---

## 📄 License

This project is proprietary software. All rights reserved.

Unauthorized copying, modification, distribution, or use of this software,
via any medium, is strictly prohibited without explicit written permission.

---

## 🤝 Support

For technical support or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [API Documentation](#api-documentation)
3. Consult the code comments and inline documentation
4. Contact your development team

---

## 📝 Changelog

### Version 1.0.0 (Initial Release)

**Features:**

- Complete public website with responsive design
- Admin panel with authentication
- College management with image uploads
- Consultation request system
- Multi-admin support with roles
- Email notifications
- Settings management
- Real-time notification system

**Technical:**

- Next.js 14 with App Router
- TypeScript for type safety
- Prisma ORM with PostgreSQL
- Tailwind CSS for styling
- JWT authentication
- Context API for state management

---

**Built with ❤️ for Promise India Education Consultancy**

Last Updated: 2026-02-15
