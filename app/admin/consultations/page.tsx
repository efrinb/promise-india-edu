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
      <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] bg-white p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Status</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
                className={`rounded-xl font-bold py-2.5 px-4 transition-all text-xs ${
                  filter === 'all' 
                    ? 'bg-[#001b4d] hover:bg-[#003399] text-white' 
                    : 'border-2 border-gray-100 hover:border-[#001b4d] text-gray-600'
                }`}
              >
                All ({consultations.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('pending')}
                className={`rounded-xl font-bold py-2.5 px-4 transition-all text-xs ${
                  filter === 'pending' 
                    ? 'bg-[#001b4d] hover:bg-[#003399] text-white' 
                    : 'border-2 border-gray-100 hover:border-[#001b4d] text-gray-600'
                }`}
              >
                Pending ({consultations.filter((c) => c.status === 'pending').length})
              </Button>
              <Button
                variant={filter === 'contacted' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilter('contacted')}
                className={`rounded-xl font-bold py-2.5 px-4 transition-all text-xs ${
                  filter === 'contacted' 
                    ? 'bg-[#001b4d] hover:bg-[#003399] text-white' 
                    : 'border-2 border-gray-100 hover:border-[#001b4d] text-gray-600'
                }`}
              >
                Contacted ({consultations.filter((c) => c.status === 'contacted').length})
              </Button>
            </div>
          </div>

          {/* Inquiry Type Filter */}
          <div className="w-full md:w-64">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Inquiry Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all"
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
        <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] bg-white">
          <CardBody className="text-center py-16">
            <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium mb-4">No consultation requests found.</p>
            {(filter !== 'all' || typeFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 border-2 border-gray-200 hover:border-[#001b4d] hover:text-[#001b4d] font-bold rounded-xl py-2 px-5"
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
        <div className="space-y-6">
          {filtered.map((consultation) => (
            <Card key={consultation.id} className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 bg-white overflow-hidden">
              <CardBody className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-extrabold text-[#001b4d]">{consultation.name}</h3>

                      {/* Inquiry Type Badge */}
                      <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        consultation.inquiryType === 'apply' ? 'bg-[#001b4d]/10 text-[#001b4d]' :
                        consultation.inquiryType === 'consultation' ? 'bg-[#d9a441]/10 text-[#a37628]' :
                        consultation.inquiryType === 'visit' ? 'bg-[#0059ff]/10 text-[#0059ff]' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {consultation.inquiryType === 'apply' ? 'Application' :
                          consultation.inquiryType === 'consultation' ? 'Consultation' :
                          consultation.inquiryType === 'visit' ? 'Visit' : 'General'}
                      </span>

                      {/* Source Badge */}
                      <span className="px-3 py-1 text-xs font-bold bg-gray-50 border border-gray-100 text-gray-500 rounded-full">
                        {consultation.source === 'homepage' ? '🏠 Homepage' :
                          consultation.source === 'college_detail' ? '🎓 College Page' :
                          consultation.source === 'mobile_cta' ? '📱 Mobile CTA' : '📧 Direct'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                      <Calendar className="h-4 w-4 text-[#d9a441]" />
                      <span>
                        {formatDateTime(consultation.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`
                    px-3.5 py-1.5 text-xs font-bold rounded-full whitespace-nowrap uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm
                    ${consultation.status === 'pending'
                      ? 'bg-amber-50 text-amber-800 border border-amber-100'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}
                  `}>
                    {consultation.status === 'pending' ? (
                      <>
                        <Clock className="h-3 w-3 animate-pulse" />
                        Pending
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Contacted
                      </>
                    )}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex items-center gap-2.5 text-sm bg-gray-50 p-3 rounded-xl border border-gray-50">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${consultation.phone}`} className="text-[#001b4d] font-bold hover:underline">
                      {consultation.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm bg-gray-50 p-3 rounded-xl border border-gray-50">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${consultation.email}`} className="text-[#001b4d] font-bold hover:underline truncate">
                      {consultation.email}
                    </a>
                  </div>
                  {consultation.city && (
                    <div className="flex items-center gap-2.5 text-sm bg-gray-50 p-3 rounded-xl border border-gray-50">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 font-bold">{consultation.city}</span>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                {(consultation.gender || consultation.dateOfBirth || consultation.fatherOccupation || consultation.branch || consultation.preferredCourse) && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                    {consultation.gender && (
                      <div className="text-xs">
                        <span className="text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Gender</span>
                        <span className="font-bold text-gray-700">{consultation.gender}</span>
                      </div>
                    )}
                    {consultation.dateOfBirth && (
                      <div className="text-xs">
                        <span className="text-gray-400 font-bold block uppercase tracking-wider mb-0.5">DOB</span>
                        <span className="font-bold text-gray-700">
                          {new Date(consultation.dateOfBirth).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    )}
                    {consultation.fatherOccupation && (
                      <div className="text-xs">
                        <span className="text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Father's Occupation</span>
                        <span className="font-bold text-gray-700">{consultation.fatherOccupation}</span>
                      </div>
                    )}
                    {consultation.branch && (
                      <div className="text-xs">
                        <span className="text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Branch</span>
                        <span className="font-bold text-gray-700">{consultation.branch}</span>
                      </div>
                    )}
                    {consultation.preferredCourse && (
                      <div className="text-xs">
                        <span className="text-gray-400 font-bold block uppercase tracking-wider mb-0.5">Preferred Course</span>
                        <span className="font-bold text-[#001b4d]">{consultation.preferredCourse}</span>
                      </div>
                    )}
                  </div>
                )}

                {consultation.message && (
                  <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-xl mb-5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a37628] block mb-1">Message / Inquiry Details</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{consultation.message}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  {consultation.status === 'pending' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => updateStatus(consultation.id, 'contacted')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mark as Contacted
                    </Button>
                  )}
                  {consultation.status === 'contacted' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus(consultation.id, 'pending')}
                      className="border-2 border-gray-100 hover:border-amber-500 hover:text-amber-600 font-bold py-2 px-5 rounded-xl text-xs transition-colors"
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