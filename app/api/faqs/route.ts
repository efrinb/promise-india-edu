import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ faqs });
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
