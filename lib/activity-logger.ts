import { prisma } from './db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface ActivityLog {
  adminId: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';
  entity?: 'college' | 'banner' | 'consultation' | 'admin' | 'settings' | 'profile';
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(activityData: ActivityLog) {
  try {
    // Get current admin from token
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };

    await prisma.adminActivity.create({
      data: {
        adminId: activityData.adminId,
        action: activityData.action,
        entity: activityData.entity || null,
        entityId: activityData.entityId || null,
        details: activityData.details ? JSON.stringify(activityData.details) : null,
        ipAddress: activityData.ipAddress || null,
        userAgent: activityData.userAgent || null,
      },
    });

  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw error - logging should not break the application
  }
}

export async function logActivityFromRequest(
  adminId: string,
  request: Request,
  action: ActivityLog['action'],
  entity?: ActivityLog['entity'],
  entityId?: string,
  details?: any
) {
  const ipAddress = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';

  await logActivity({
    adminId,
    action,
    entity,
    entityId,
    details,
    ipAddress,
    userAgent,
  });
}