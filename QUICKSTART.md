# Promise India Education Consultancy - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- SMTP email service credentials

## Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
cd promise-india-edu
npm install
```

### 2. Configure Environment
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/promise_india_db"
JWT_SECRET="change-this-to-a-long-random-string-in-production"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="your-email@gmail.com"
ADMIN_EMAIL="admin@promiseindia.com"
```

### 3. Setup Database
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Create database tables
npm run db:seed      # Add demo data
```

### 4. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Access Admin Panel
URL: http://localhost:3000/admin/login

Credentials:
- Email: `admin@promiseindia.com`
- Password: `admin123`

## What's Included

### Demo Data
- 3 nursing colleges (St. Mary's, Amrita, Believers Church)
- 3 consultation requests
- Admin user account
- Default settings

### Pages
**Public:**
- Landing page with all sections
- Colleges listing with search/filters
- College detail pages
- Contact/Consultation form
- About page
- Abroad education placeholder

**Admin:**
- Dashboard with statistics
- Colleges management
- Consultations management
- Settings (placeholder)

### Features
✅ Full CRUD for colleges
✅ Consultation request handling
✅ Email notifications (admin + welcome)
✅ Secure authentication (JWT + httpOnly cookies)
✅ Responsive design
✅ Database with Prisma ORM
✅ TypeScript throughout
✅ Form validation with Zod

## Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { DEFAULT: '#0B3C5D', ... },
  secondary: { DEFAULT: '#1CA7A6', ... },
  accent: { DEFAULT: '#D9A441', ... },
}
```

### Update Content
- Landing page: `app/(public)/page.tsx`
- About page: `app/(public)/about/page.tsx`
- Footer: `components/public/Footer.tsx`

## Production Deployment

1. **Set environment variables** on your hosting platform
2. **Update JWT_SECRET** to a strong random value
3. **Configure database** (use managed PostgreSQL)
4. **Build and deploy:**
```bash
npm run build
npm run start
```

## Common Issues

**Can't connect to database?**
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify firewall settings

**Emails not sending?**
- For Gmail: Enable 2FA, create App Password
- Test with Ethereal Email for dev
- Check SMTP credentials

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run db:generate
npm run build
```

## Next Steps

1. Change admin password in database
2. Update site settings via admin panel
3. Add real college information
4. Configure proper email service
5. Add analytics and SEO
6. Implement file uploads for images
7. Add remaining admin forms

## Support

For detailed information, see README.md

Built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.
