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
      <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] bg-white p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search colleges by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 w-full bg-gray-50 border border-gray-100 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all"
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
            <Card key={college.id} className="overflow-hidden rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {college.thumbnailUrl ? (
                  <Image
                    src={college.thumbnailUrl}
                    alt={college.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#001b4d] to-[#003399] flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-white/40" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {college.featured && (
                    <span className="bg-[#d9a441] text-[#001b4d] px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm uppercase tracking-wider">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </span>
                  )}
                  <AdmissionBadge status={college.admissionStatus as any} />
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm ${college.status === 'published'
                    ? 'bg-[#0059ff] text-white'
                    : 'bg-gray-500 text-white'
                    }`}>
                    {college.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <CardBody className="p-5">
                <h3 className="font-extrabold text-lg text-[#001b4d] dark:text-white mb-1.5 line-clamp-1 leading-snug">{college.name}</h3>
                <p className="text-xs font-semibold text-gray-400 mb-2 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d9a441] mr-1.5"></span>
                  {college.location}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed h-10">
                  {college.shortDescription}
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                  {/* <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fee (4 Years)</span>
                  <span className="font-extrabold text-[#001b4d] dark:text-primary-400 text-lg">
                    {formatCurrency((college.fees as any).total)}
                  </span> */}
                </div>

                <div className="flex gap-2">
                  <Link href={`/admin/colleges/${college.id}/edit`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full bg-[#001b4d] hover:bg-[#003399] text-white font-bold py-2.5 rounded-xl transition-all text-xs flex justify-center items-center shadow-sm">
                      <Pencil className="mr-2 h-3.5 w-3.5" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border border-gray-200 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl px-3 transition-colors"
                    onClick={() => setDeleteModal({ show: true, college })}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
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