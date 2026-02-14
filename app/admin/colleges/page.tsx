'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatCurrency } from '@/lib/utils';
import type { College } from '@/types';

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges?admin=true');
      const data = await response.json();
      setColleges(data.colleges || []);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/colleges/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchColleges();
      } else {
        alert('Failed to delete college');
      }
    } catch (error) {
      alert('Error deleting college');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Colleges</h1>
          <p className="text-gray-600">Manage nursing colleges and institutions</p>
        </div>
        <Link href="/admin/colleges/new">
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            Add College
          </Button>
        </Link>
      </div>

      {colleges.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600">No colleges found. Add your first college to get started.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {colleges.map((college) => (
            <Card key={college.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{college.name}</h3>
                      <span className={`
                        px-2 py-1 text-xs font-semibold rounded
                        ${college.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      `}>
                        {college.status}
                      </span>
                      {college.featured && (
                        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{college.location}</p>
                    <p className="text-sm text-gray-500 mb-3">{college.shortDescription}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Category: <span className="font-semibold">{college.category}</span>
                      </span>
                      <span className="text-gray-600">
                        Fee: <span className="font-semibold">{formatCurrency((college.fees as any).total)}</span>
                      </span>
                      <span className="text-gray-600">
                        Added: <span className="font-semibold">{formatDate(college.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link href={`/colleges/${college.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/colleges/${college.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(college.id, college.name)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
