import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, hashPassword } from '@/lib/auth';
import { z } from 'zod';
import { logActivityFromRequest } from '@/lib/activity-logger';

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
  name: z.string().min(2),
  role: z.enum(['admin', 'super_admin']).default('admin'),
  active: z.boolean().default(true),
});

// GET /api/admin - Get all admins (super_admin only)
export async function GET() {
  try {
    const currentAdmin = await requireAuth();
    
    if (currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admin can view all admins' },
        { status: 403 }
      );
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ admins });
  } catch (error: any) {
    console.error('Error fetching admins:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

// POST /api/admin - Create new admin (super_admin only)
export async function POST(request: NextRequest) {
  try {
    const currentAdmin = await requireAuth();
    
    if (currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Only super admin can create admins' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = adminSchema.parse(body);

    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password || 'changeme123');

    const newAdmin = await prisma.admin.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        role: validatedData.role,
        active: validatedData.active,
        createdBy: currentAdmin.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'create',
        'admin',
        newAdmin.id,
        { name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }

    return NextResponse.json({ admin: newAdmin }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating admin:', error);
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 });
  }
}
