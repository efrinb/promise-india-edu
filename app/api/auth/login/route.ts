import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find admin with profileImage
    const admin = await prisma.admin.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        active: true,
        profileImage: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!admin.active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(validatedData.password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Log login activity
    try {
      const ipAddress = request.headers.get('x-forwarded-for') || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';

      await prisma.adminActivity.create({
        data: {
          adminId: admin.id,
          action: 'login',
          ipAddress,
          userAgent,
        },
      });
    } catch (activityError) {
      // Don't fail login if activity logging fails
      console.error('Failed to log login activity:', activityError);
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        profileImage: admin.profileImage,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Invalid input or server error' },
      { status: 400 }
    );
  }
}