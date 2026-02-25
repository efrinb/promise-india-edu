import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const currentAdmin = await requireAuth();

    const admin = await prisma.admin.findUnique({
      where: { id: currentAdmin.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error('Auth me error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch admin details' },
      { status: 500 }
    );
  }
}