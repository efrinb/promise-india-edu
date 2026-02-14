import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CollegeForm } from '@/components/admin/CollegeForm';

async function getCollege(id: string) {
  const college = await prisma.college.findUnique({
    where: { id },
  });
  return college;
}

export default async function EditCollegePage({
  params,
}: {
  params: { id: string };
}) {
  const college = await getCollege(params.id);

  if (!college) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit College</h1>
      <CollegeForm collegeId={college.id} initialData={college} />
    </div>
  );
}
