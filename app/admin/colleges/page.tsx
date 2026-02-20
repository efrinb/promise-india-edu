'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, GraduationCap, Star } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdmissionBadge } from '@/components/public/AdmissionBadge';
import { formatCurrency } from '@/lib/utils';
import type { College } from '@/types';

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; college: College | null }>({
    show: false,
    college: null,
  });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch('/api/colleges?admin=true');
      const data = await response.json();

      // Sort: Featured first, then by creation date
      const sorted = (data.colleges || []).sort((a: College, b: College) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setColleges(sorted);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/colleges/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchColleges();
        setDeleteModal({ show: false, college: null });
      } else {
        alert('Failed to delete college');
      }
    } catch (error) {
      alert('Failed to delete college');
    }
  };

  const filtered = colleges.filter((college) =>
    college.name.toLowerCase().includes(search.toLowerCase()) ||
    college.location.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light dark:text-gray-400">Loading colleges...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Colleges</h1>
          <p className="text-text-light dark:text-gray-400">Manage all colleges and institutions</p>
        </div>
        <Link href="/admin/colleges/new">
          <Button variant="danger">
            <Plus className="mr-2 h-4 w-4" />
            Add College
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-lighter dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search colleges by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Colleges Grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-light dark:text-gray-400 mb-4">
              {search ? 'No colleges found matching your search.' : 'No colleges added yet.'}
            </p>
            {!search && (
              <Link href="/admin/colleges/new">
                <Button variant="primary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First College
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((college) => (
            <Card key={college.id} className="overflow-hidden">
              {/* Image */}
              <div className="relative aspect-video">
                {college.thumbnailUrl ? (
                  <Image
                    src={college.thumbnailUrl}
                    alt={college.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <GraduationCap className="h-20 w-20 text-white/50" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {college.featured && (
                    <span className="bg-accent text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </span>
                  )}
                  <AdmissionBadge status={college.admissionStatus as any} />
                </div>

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${college.status === 'published'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-500 text-white'
                    }`}>
                    {college.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <CardBody>
                <h3 className="font-bold text-lg mb-2 line-clamp-1">{college.name}</h3>
                <p className="text-sm text-text-light dark:text-gray-400 mb-1">{college.location}</p>
                <p className="text-sm text-text-light dark:text-gray-400 mb-3 line-clamp-2">
                  {college.shortDescription}
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b dark:border-gray-700">
                  <span className="text-xs text-text-light dark:text-gray-400">Total Fee:</span>
                  <span className="font-bold text-primary dark:text-primary-400">
                    {formatCurrency((college.fees as any).total)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/colleges/${college.id}/edit`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteModal({ show: true, college })}
                  >
                    <Trash2 className="h-4 w-4 text-accent" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.college && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop">
          <Card className="max-w-md w-full animate-fade-in">
            <CardBody>
              <h3 className="text-xl font-bold mb-4">Delete College</h3>
              <p className="text-text-light dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{deleteModal.college.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteModal({ show: false, college: null })}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={() => handleDelete(deleteModal.college!.id)}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}