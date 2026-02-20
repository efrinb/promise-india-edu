'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle, Clock, Filter } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';
import type { Consultation } from '@/types';

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/consultations');
      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchConsultations();
        await fetchNotifications();
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filtered = consultations.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (typeFilter !== 'all' && c.inquiryType !== typeFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-light dark:text-gray-400">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Consultation Requests</h1>
        <p className="text-text-light dark:text-gray-400">Manage and respond to student inquiries</p>
      </div>

      {/* Filter Controls */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({consultations.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
              >
                Pending ({consultations.filter((c) => c.status === 'pending').length})
              </Button>
              <Button
                variant={filter === 'contacted' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('contacted')}
              >
                Contacted ({consultations.filter((c) => c.status === 'contacted').length})
              </Button>
            </div>
          </div>

          {/* Inquiry Type Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Inquiry Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Types</option>
              <option value="apply">Application</option>
              <option value="consultation">Consultation</option>
              <option value="visit">Visit</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-text-light dark:text-gray-400">No consultation requests found.</p>
            {(filter !== 'all' || typeFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setFilter('all');
                  setTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((consultation) => (
            <Card key={consultation.id}>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold">{consultation.name}</h3>

                      {/* Inquiry Type Badge */}
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${consultation.inquiryType === 'apply' ? 'bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-300' :
                        consultation.inquiryType === 'consultation' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300' :
                          consultation.inquiryType === 'visit' ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {consultation.inquiryType === 'apply' ? 'Application' :
                          consultation.inquiryType === 'consultation' ? 'Consultation' :
                            consultation.inquiryType === 'visit' ? 'Visit' : 'General'}
                      </span>

                      {/* Source Badge */}
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                        {consultation.source === 'homepage' ? '🏠 Homepage' :
                          consultation.source === 'college_detail' ? '🎓 College Page' :
                            consultation.source === 'mobile_cta' ? '📱 Mobile CTA' : '📧 Direct'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-text-lighter dark:text-gray-500" />
                      <span className="text-sm text-text-light dark:text-gray-400">
                        {formatDateTime(consultation.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`
                    px-3 py-1 text-sm font-semibold rounded whitespace-nowrap
                    ${consultation.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300'}
                  `}>
                    {consultation.status === 'pending' ? (
                      <>
                        <Clock className="inline h-3 w-3 mr-1" />
                        Pending
                      </>
                    ) : (
                      <>
                        <CheckCircle className="inline h-3 w-3 mr-1" />
                        Contacted
                      </>
                    )}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-text-lighter dark:text-gray-500" />
                    <a href={`tel:${consultation.phone}`} className="text-primary dark:text-primary-400 hover:underline">
                      {consultation.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-text-lighter dark:text-gray-500" />
                    <a href={`mailto:${consultation.email}`} className="text-primary dark:text-primary-400 hover:underline">
                      {consultation.email}
                    </a>
                  </div>
                  {consultation.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-text-lighter dark:text-gray-500" />
                      <span className="text-text-light dark:text-gray-400">{consultation.city}</span>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {(consultation.gender || consultation.dateOfBirth || consultation.fatherOccupation || consultation.branch || consultation.preferredCourse) && (
                  <div className="grid md:grid-cols-3 gap-4 mb-4 p-3 bg-background dark:bg-gray-700 rounded-lg">
                    {consultation.gender && (
                      <div className="text-sm">
                        <span className="text-text-lighter dark:text-gray-500">Gender:</span>
                        <span className="ml-2 font-medium">{consultation.gender}</span>
                      </div>
                    )}
                    {consultation.dateOfBirth && (
                      <div className="text-sm">
                        <span className="text-text-lighter dark:text-gray-500">DOB:</span>
                        <span className="ml-2 font-medium">
                          {new Date(consultation.dateOfBirth).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                    {consultation.fatherOccupation && (
                      <div className="text-sm">
                        <span className="text-text-lighter dark:text-gray-500">Father's Occupation:</span>
                        <span className="ml-2 font-medium">{consultation.fatherOccupation}</span>
                      </div>
                    )}
                    {consultation.branch && (
                      <div className="text-sm">
                        <span className="text-text-lighter dark:text-gray-500">Branch:</span>
                        <span className="ml-2 font-medium">{consultation.branch}</span>
                      </div>
                    )}
                    {consultation.preferredCourse && (
                      <div className="text-sm">
                        <span className="text-text-lighter dark:text-gray-500">Preferred Course:</span>
                        <span className="ml-2 font-medium">{consultation.preferredCourse}</span>
                      </div>
                    )}
                  </div>
                )}

                {consultation.message && (
                  <div className="p-3 bg-background dark:bg-gray-700 rounded-lg mb-4">
                    <p className="text-sm text-text-light dark:text-gray-400">{consultation.message}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {consultation.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateStatus(consultation.id, 'contacted')}
                    >
                      Mark as Contacted
                    </Button>
                  )}
                  {consultation.status === 'contacted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(consultation.id, 'pending')}
                    >
                      Mark as Pending
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}