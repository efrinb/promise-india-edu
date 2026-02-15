'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDateTime } from '@/lib/utils';
import { useNotifications } from '@/context/NotificationContext';
import type { Consultation } from '@/types';

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
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
        await fetchNotifications(); // Refresh notification count
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filtered = consultations.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Consultation Requests</h1>
        <p className="text-gray-600">Manage and respond to student inquiries</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
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

      {filtered.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-gray-600">No consultation requests found.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((consultation) => (
            <Card key={consultation.id}>
              <CardBody>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{consultation.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {formatDateTime(consultation.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span className={`
                    px-3 py-1 text-sm font-semibold rounded
                    ${consultation.status === 'pending' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}
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

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${consultation.phone}`} className="text-primary hover:underline">
                      {consultation.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${consultation.email}`} className="text-primary hover:underline">
                      {consultation.email}
                    </a>
                  </div>
                  {consultation.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{consultation.city}</span>
                    </div>
                  )}
                </div>

                {consultation.message && (
                  <div className="p-3 bg-gray-50 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">{consultation.message}</p>
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