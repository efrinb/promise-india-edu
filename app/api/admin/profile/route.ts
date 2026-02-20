import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth';
import { z } from 'zod';

const profileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
});

export async function GET() {
  try {
    const currentAdmin = await requireAuth();

    const admin = await prisma.admin.findUnique({
      where: { id: currentAdmin.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ admin });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentAdmin = await requireAuth();

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const updateData: any = {};

    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.name) updateData.name = validatedData.name;

    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password);
    }

    const updated = await prisma.admin.update({
      where: { id: currentAdmin.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ admin: updated });
  } catch (error: any) {
    console.error('Profile update error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
