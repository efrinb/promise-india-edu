import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken, verifyToken, removeAuthCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get token BEFORE removing cookie
    const token = await getAuthToken();

    if (token) {
      const decoded = verifyToken(token);

      if (decoded) {
        const ipAddress =
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown';

        const userAgent =
          request.headers.get('user-agent') || 'unknown';

        try {
          await prisma.adminActivity.create({
            data: {
              adminId: decoded.id,
              action: 'logout',
              ipAddress,
              userAgent,
            },
          });
        } catch (activityError) {
          console.error('Failed to log logout activity:', activityError);
        }
      }
    }
    
    await removeAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}