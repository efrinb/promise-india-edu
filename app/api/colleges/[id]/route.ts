import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { collegeSchema } from '@/lib/validations';
import { logActivityFromRequest } from '@/lib/activity-logger';

// GET /api/colleges/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const college = await prisma.college.findUnique({
      where: { id: params.id },
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ college });
  } catch (error) {
    console.error('Error fetching college:', error);
    return NextResponse.json(
      { error: 'Failed to fetch college' },
      { status: 500 }
    );
  }
}

// PUT /api/colleges/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await requireAuth();

    const body = await request.json();
    const validatedData = collegeSchema.parse(body);

    // Get original college data for logging
    const originalCollege = await prisma.college.findUnique({
      where: { id: params.id },
    });

    const college = await prisma.college.update({
      where: { id: params.id },
      data: validatedData,
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'update',
        'college',
        college.id,
        { 
          name: college.name,
          changedFields: Object.keys(validatedData)
        }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ college });
  } catch (error: any) {
    console.error('Error updating college:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update college' },
      { status: 500 }
    );
  }
}

// DELETE /api/colleges/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await requireAuth();

    // Get college info before deleting
    const college = await prisma.college.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, slug: true }
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    await prisma.college.delete({
      where: { id: params.id },
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'delete',
        'college',
        params.id,
        { name: college.name, slug: college.slug }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting college:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500 }
    );
  }
}