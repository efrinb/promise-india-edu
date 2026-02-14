import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { collegeSchema } from '@/lib/validations';
import { generateSlug } from '@/lib/utils';

// GET /api/colleges/[id] - Get single college by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Try to find by ID first, then by slug
    const college = await prisma.college.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
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

// PUT /api/colleges/[id] - Update college (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const { id } = params;
    const body = await request.json();
    const validatedData = collegeSchema.parse(body);

    // Check if college exists
    const existingCollege = await prisma.college.findUnique({
      where: { id },
    });

    if (!existingCollege) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    // Generate new slug if name changed
    let slug = existingCollege.slug;
    if (validatedData.name !== existingCollege.name) {
      slug = generateSlug(validatedData.name);
      
      // Check if new slug already exists
      const slugExists = await prisma.college.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'A college with this name already exists' },
          { status: 400 }
        );
      }
    }

    const college = await prisma.college.update({
      where: { id },
      data: {
        ...validatedData,
        slug,
      },
    });

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

// DELETE /api/colleges/[id] - Delete college (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const { id } = params;

    const college = await prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      return NextResponse.json(
        { error: 'College not found' },
        { status: 404 }
      );
    }

    await prisma.college.delete({
      where: { id },
    });

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
