import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth';
import { logActivityFromRequest } from '@/lib/activity-logger';
import { z } from 'zod';

const profileSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional(),
  profileImage: z.string().optional(),
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
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ admin });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch profile: ' + error.message }, { status: 500 });
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
    if (validatedData.profileImage !== undefined) updateData.profileImage = validatedData.profileImage;

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
        profileImage: true,
        updatedAt: true,
      },
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'update',
        'profile',
        currentAdmin.id,
        { updatedFields: Object.keys(updateData) }
      );
    }
    catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ admin: updated });
  } catch (error: any) {
    console.error('Profile update error:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}