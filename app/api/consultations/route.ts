import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { consultationSchema } from '@/lib/validations';
import { sendConsultationNotification, sendWelcomeEmail } from '@/lib/email';

// GET /api/consultations - Admin only: get all consultations
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status) where.status = status;

    const consultations = await prisma.consultation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ consultations });
  } catch (error: any) {
    console.error('Error fetching consultations:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

// POST /api/consultations - Public: create consultation request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = consultationSchema.parse(body);

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: validatedData,
    });

    // Get settings for admin email
    const settings = await prisma.settings.findFirst();
    const adminEmail = settings?.adminEmail || process.env.ADMIN_EMAIL || 'admin@promiseindia.com';

    // Send email notification to admin (don't block the response)
    sendConsultationNotification(validatedData, adminEmail).catch((error) => {
      console.error('Failed to send admin notification:', error);
    });

    // Send welcome email to user (optional, don't block)
    sendWelcomeEmail(validatedData.email, validatedData.name).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });

    return NextResponse.json({ 
      consultation,
      message: 'Consultation request submitted successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating consultation:', error);
    return NextResponse.json(
      { error: 'Failed to submit consultation request' },
      { status: 400 }
    );
  }
}
