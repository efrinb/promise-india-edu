import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { bannerSchema } from '@/lib/validations';

// GET /api/banners - Public: get active banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const admin = searchParams.get('admin');

    const where: any = {};

    // Public users only see active banners within date range
    if (!admin) {
      const now = new Date();
      where.active = true;
      where.startDate = { lte: now };
      where.endDate = { gte: now };
    }

    const banners = await prisma.banner.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST /api/banners - Admin only: create banner
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = bannerSchema.parse(body);

    // Check if uniqueId already exists
    const existingBanner = await prisma.banner.findUnique({
      where: { uniqueId: validatedData.uniqueId },
    });

    if (existingBanner) {
      return NextResponse.json(
        { error: 'A banner with this Unique ID already exists' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        ...validatedData,
        link: validatedData.link || null,
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    
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
        { error: 'Failed to create banner', details: error.message },
        { status: 500 }
      );
  }
}