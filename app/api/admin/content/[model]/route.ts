import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

type ModelName =
  | 'siteStatistic'
  | 'courseProgram'
  | 'admissionStep'
  | 'teamMember'
  | 'faq';

const VALID_MODELS: ModelName[] = [
  'siteStatistic',
  'courseProgram',
  'admissionStep',
  'teamMember',
  'faq',
];

function getModel(model: string): ModelName | null {
  // Accept both kebab-case (URL) and camelCase
  const map: Record<string, ModelName> = {
    'site-statistic': 'siteStatistic',
    'siteStatistic': 'siteStatistic',
    'course-program': 'courseProgram',
    'courseProgram': 'courseProgram',
    'admission-step': 'admissionStep',
    'admissionStep': 'admissionStep',
    'team-member': 'teamMember',
    'teamMember': 'teamMember',
    'faq': 'faq',
  };
  return map[model] ?? null;
}

function getOrderField(model: ModelName): string | null {
  const orderFields: Record<ModelName, string | null> = {
    siteStatistic: 'order',
    courseProgram: 'order',
    admissionStep: 'stepNumber',
    teamMember: 'order',
    faq: 'order',
  };
  return orderFields[model];
}

// GET /api/admin/content/[model]
export async function GET(_req: NextRequest, { params }: { params: { model: string } }) {
  try {
    const modelKey = getModel(params.model);
    if (!modelKey) {
      return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
    }

    const orderField = getOrderField(modelKey);
    const orderBy = orderField ? [{ [orderField]: 'asc' as const }] : [{ createdAt: 'asc' as const }];

    // @ts-ignore — dynamic model access
    const records = await (prisma[modelKey] as any).findMany({ orderBy });
    return NextResponse.json({ records });
  } catch (error) {
    console.error('[Content GET]', error);
    return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
  }
}

// POST /api/admin/content/[model]
export async function POST(req: NextRequest, { params }: { params: { model: string } }) {
  try {
    await requireAuth();
    const modelKey = getModel(params.model);
    if (!modelKey) return NextResponse.json({ error: 'Invalid model' }, { status: 400 });

    const body = await req.json();
    // @ts-ignore
    const record = await (prisma[modelKey] as any).create({ data: body });
    return NextResponse.json({ record }, { status: 201 });
  } catch (error: any) {
    console.error('[Content POST]', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
  }
}

// PUT /api/admin/content/[model]?id=xxx
export async function PUT(req: NextRequest, { params }: { params: { model: string } }) {
  try {
    await requireAuth();
    const modelKey = getModel(params.model);
    if (!modelKey) return NextResponse.json({ error: 'Invalid model' }, { status: 400 });

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const body = await req.json();
    // @ts-ignore
    const record = await (prisma[modelKey] as any).update({ where: { id }, data: body });
    return NextResponse.json({ record });
  } catch (error: any) {
    console.error('[Content PUT]', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 });
  }
}

// DELETE /api/admin/content/[model]?id=xxx
export async function DELETE(req: NextRequest, { params }: { params: { model: string } }) {
  try {
    await requireAuth();
    const modelKey = getModel(params.model);
    if (!modelKey) return NextResponse.json({ error: 'Invalid model' }, { status: 400 });

    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // @ts-ignore
    await (prisma[modelKey] as any).delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Content DELETE]', error);
    if (error.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
