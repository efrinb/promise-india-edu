import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

// GET /api/notifications - Get unread consultation count
export async function GET() {
  try {
    await requireAuth();

    const unreadCount = await prisma.consultation.count({
      where: {
        status: 'pending',
        notified: false,
      },
    });

    const recentUnread = await prisma.consultation.findMany({
      where: {
        status: 'pending',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        createdAt: true,
        notified: true,
      },
    });

    return NextResponse.json({
      unreadCount,
      recent: recentUnread,
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// POST /api/notifications - Mark notifications as read
export async function POST() {
  try {
    await requireAuth();

    await prisma.consultation.updateMany({
      where: { notified: false },
      data: { notified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}
