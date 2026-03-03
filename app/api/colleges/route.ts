import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, getCurrentAdmin } from '@/lib/auth';
import { collegeSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';
import { logActivityFromRequest } from '@/lib/activity-logger';

// GET /api/colleges - Public: get published colleges. Admins can also see drafts.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');

    const where: any = {};

    // Check if the request comes from an authenticated admin.
    // Admins can filter by status (e.g. see drafts).
    // Public visitors ALWAYS only see published colleges — no ?admin=true bypass.
    const currentAdmin = await getCurrentAdmin();

    if (currentAdmin) {
      // Authenticated admins can filter by status
      if (status) where.status = status;
    } else {
      // Public visitors only see published colleges
      where.status = 'published';
    }

    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const colleges = await prisma.college.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch colleges' },
      { status: 500 }
    );
  }
}

// POST /api/colleges - Admin only: create college
export async function POST(request: NextRequest) {
  try {
    const currentAdmin = await requireAuth();

    const body = await request.json();
    const validatedData = collegeSchema.parse(body);

    const slug = generateSlug(validatedData.name);

    // Check if slug already exists
    const existingCollege = await prisma.college.findUnique({
      where: { slug },
    });

    if (existingCollege) {
      return NextResponse.json(
        { error: 'A college with this name already exists' },
        { status: 400 }
      );
    }

    const college = await prisma.college.create({
      data: {
        ...validatedData,
        slug,
      },
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'create',
        'college',
        college.id,
        { name: college.name, slug: college.slug }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ college }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating college:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (error.errors) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create college' },
      { status: 500 }
    );
  }
}
