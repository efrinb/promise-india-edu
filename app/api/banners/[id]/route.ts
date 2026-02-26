import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { bannerSchema } from '@/lib/validations';
import { logActivityFromRequest } from '@/lib/activity-logger';

// GET /api/banners/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id },
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ banner });
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

// PUT /api/banners/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await requireAuth();

    const body = await request.json();
    const validatedData = bannerSchema.parse(body);

    // Check if uniqueId is being changed and if it already exists
    const existingBanner = await prisma.banner.findUnique({
      where: { uniqueId: validatedData.uniqueId },
    });

    if (existingBanner && existingBanner.id !== params.id) {
      return NextResponse.json(
        { error: 'A banner with this Unique ID already exists' },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        link: validatedData.link || null,
      },
    });

        // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'update',
        'banner',
        banner.id,
        { name: banner.name, uniqueId: banner.uniqueId }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ banner });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE /api/banners/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await requireAuth();

    const banner = await prisma.banner.delete({
      where: { id: params.id },
      select: { id: true, name: true, uniqueId: true }
    });

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    await prisma.banner.delete({
      where: { id: params.id },
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'delete',
        'banner',
        params.id,
        { name: banner.name, uniqueId: banner.uniqueId }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}