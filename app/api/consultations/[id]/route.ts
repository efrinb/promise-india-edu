import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { logActivityFromRequest } from '@/lib/activity-logger';

// GET /api/consultations/[id] - Admin only: get single consultation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const { id } = params;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ consultation });
  } catch (error: any) {
    console.error('Error fetching consultation:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    );
  }
}

// PATCH /api/consultations/[id] - Admin only: update consultation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentAdmin = await requireAuth();

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['pending', 'contacted'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        status,
        notified: status === 'contacted' ? true : false,
      },
    });

    // Log activity
    try {
      await logActivityFromRequest(
        currentAdmin.id,
        request,
        'update',
        'consultation',
        consultation.id,
        { 
          name: consultation.name,
          status: status,
          inquiryType: consultation.inquiryType
        }
      );
    } catch (activityError) {
      console.error('Failed to log activity:', activityError);
    }


    return NextResponse.json({ consultation });
  } catch (error: any) {
    console.error('Error updating consultation:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}

// DELETE /api/consultations/[id] - Admin only: delete consultation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const { id } = params;

    await prisma.consultation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting consultation:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete consultation' },
      { status: 500 }
    );
  }
}
