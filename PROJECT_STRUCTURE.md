# Promise India Education Consultancy - Project Structure

```
promise-india-edu/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── app/
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Landing page)
│   │   ├── colleges/
│   │   │   ├── page.tsx (Colleges list)
│   │   │   └── [slug]/
│   │   │       └── page.tsx (College detail)
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── abroad-education/
│   │       └── page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── colleges/
│   │   │   ├── page.tsx (List)
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── consultations/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts
│   │   │   ├── logout/
│   │   │   │   └── route.ts
│   │   │   └── me/
│   │   │       └── route.ts
│   │   ├── colleges/
│   │   │   ├── route.ts (GET list, POST create)
│   │   │   └── [id]/
│   │   │       └── route.ts (GET, PUT, DELETE)
│   │   ├── consultations/
│   │   │   ├── route.ts (GET list, POST create)
│   │   │   └── [id]/
│   │   │       └── route.ts (GET, PATCH)
│   │   └── settings/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── public/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── MissionVision.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── FeaturedColleges.tsx
│   │   ├── CTAStrip.tsx
│   │   └── ConsultationForm.tsx
│   ├── admin/
│   │   ├── Sidebar.tsx
│   │   ├── CollegeForm.tsx
│   │   └── ConsultationTable.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Toast.tsx
├── lib/
│   ├── db.ts
│   ├── email.ts
│   ├── auth.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── index.ts
├── public/
│   └── images/
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```
