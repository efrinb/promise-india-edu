import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const currentAdmin = await requireAuth();

    // Only super admins can view activity logs
    if (currentAdmin.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden - Super admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const where: any = {};
    if (adminId) where.adminId = adminId;
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const [activities, total] = await Promise.all([
      prisma.adminActivity.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              profileImage: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.adminActivity.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}