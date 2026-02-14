# Promise India Education Consultancy

A modern, professional education consultancy website built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

### Public Website
- **Landing Page**: Hero section, Mission & Vision, Why Choose Us, Featured Colleges, CTA sections
- **Colleges Listing**: Grid view with search and filters (category, location)
- **College Detail Pages**: Full information, gallery, fee structure, registration form
- **Consultation Form**: Free consultation request with email notifications
- **Responsive Design**: Mobile-first approach with modern UI

### Admin Panel
- **Dashboard**: Overview of colleges and consultation requests
- **College Management**: Full CRUD operations for colleges
- **Consultation Management**: View and manage consultation requests
- **Settings**: Configure site settings (email, contact info, social links)
- **Secure Authentication**: Email/password login with JWT tokens

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies, bcrypt password hashing
- **Email**: Nodemailer with SMTP
- **Validation**: Zod schemas
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- SMTP email service (Gmail, SendGrid, Mailgun, etc.)

## Installation

### 1. Clone and Install Dependencies

```bash
cd promise-india-edu
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/promise_india_db"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"

# Admin Email (for receiving consultation notifications)
ADMIN_EMAIL="admin@promiseindia.com"

# App URL (for production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**SMTP Setup Notes:**
- For Gmail: Enable 2FA and create an App Password
- For SendGrid/Mailgun: Use their API credentials
- For development: Use a service like Ethereal Email (https://ethereal.email)

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed database with demo data
npm run db:seed
```

This will create:
- Admin user: `admin@promiseindia.com` / `admin123`
- 3 demo nursing colleges
- 3 demo consultation requests
- Default settings

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Access Admin Panel

Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Default Admin Credentials:**
- Email: `admin@promiseindia.com`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the admin password immediately after first login!

## Project Structure

```
promise-india-edu/
├── app/
│   ├── (public)/              # Public pages
│   │   ├── layout.tsx         # Public layout with Header/Footer
│   │   ├── page.tsx           # Landing page
│   │   ├── colleges/          # Colleges pages
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   └── abroad-education/  # Abroad education page
│   ├── admin/                 # Admin panel
│   │   ├── layout.tsx         # Admin layout
│   │   ├── login/             # Login page
│   │   ├── page.tsx           # Dashboard
│   │   ├── colleges/          # College management
│   │   ├── consultations/     # Consultation management
│   │   └── settings/          # Settings
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── colleges/          # College CRUD endpoints
│   │   ├── consultations/     # Consultation endpoints
│   │   └── settings/          # Settings endpoint
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── public/                # Public components
│   ├── admin/                 # Admin components
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── auth.ts                # Authentication utilities
│   ├── email.ts               # Email service
│   ├── validations.ts         # Zod schemas
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── types/
│   └── index.ts               # TypeScript types
└── public/
    └── images/                # Static images
```

## API Endpoints

### Public Endpoints

- `GET /api/colleges` - Get published colleges (with filters)
- `GET /api/colleges/[id]` - Get single college by ID or slug
- `POST /api/consultations` - Create consultation request
- `GET /api/settings` - Get site settings

### Admin Endpoints (Requires Authentication)

- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current admin user
- `POST /api/colleges` - Create college
- `PUT /api/colleges/[id]` - Update college
- `DELETE /api/colleges/[id]` - Delete college
- `GET /api/consultations` - Get all consultations
- `PATCH /api/consultations/[id]` - Update consultation status
- `DELETE /api/consultations/[id]` - Delete consultation
- `PUT /api/settings` - Update settings

## Database Schema

### Admin
- id, email, password (hashed), name, timestamps

### College
- id, name, slug, category, location, shortDescription, about
- fees (JSON: tuition, hostel, other, total)
- featured (boolean), thumbnailUrl, galleryUrls, googleFormUrl
- status (draft/published), timestamps

### Consultation
- id, name, phone, email, city, message
- status (pending/contacted), timestamps

### Settings
- id, adminEmail, phone, address
- social media URLs (Facebook, Instagram, Twitter, LinkedIn)
- timestamps

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## Deployment

### Environment Variables

Ensure all environment variables are set in your deployment platform:
- DATABASE_URL
- JWT_SECRET
- SMTP_* variables
- NEXT_PUBLIC_APP_URL

### Build and Deploy

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Platform-Specific Instructions

**Vercel:**
1. Connect your repository
2. Add environment variables
3. Deploy automatically

**Railway:**
1. Create new project
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

**DigitalOcean App Platform:**
1. Create app from repository
2. Add managed PostgreSQL database
3. Configure environment variables
4. Deploy

## Customization

### Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: { DEFAULT: '#0B3C5D', ... },
  secondary: { DEFAULT: '#1CA7A6', ... },
  accent: { DEFAULT: '#D9A441', ... },
}
```

### Content

- Landing page content: `app/(public)/page.tsx`
- About page: `app/(public)/about/page.tsx`
- Footer links: `components/public/Footer.tsx`

### Images

Place college images in `public/images/colleges/` and reference them in the admin panel.

## Security Considerations

1. **Change Default Credentials**: Update admin password after first login
2. **JWT Secret**: Use a strong, random secret in production
3. **HTTPS**: Always use HTTPS in production
4. **SMTP Credentials**: Keep email credentials secure
5. **Database**: Use connection pooling and secure credentials
6. **Rate Limiting**: Consider adding rate limiting to API endpoints

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check firewall settings

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure apps" for Gmail (or use App Password)
- Test with Ethereal Email for development

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Regenerate Prisma Client: `npm run db:generate`

## Support

For issues or questions, please create an issue in the repository or contact support.

## License

Private - All Rights Reserved

---

Built with ❤️ by Promise India Education Consultancy
