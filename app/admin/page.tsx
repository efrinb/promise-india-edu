'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, MessageSquare, CheckCircle, Clock, Shield, Plus } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalColleges: 0,
    publishedColleges: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    fetchCurrentAdmin();
  }, []);

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      console.log('Dashboard - Current Admin:', data.admin); // Debug log
      if (response.ok) {
        setCurrentAdmin(data.admin);
      }
    } catch (error) {
      console.error('Failed to fetch current admin:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const [collegesRes, consultationsRes] = await Promise.all([
        fetch('/api/colleges?admin=true'),
        fetch('/api/consultations'),
      ]);

      const collegesData = await collegesRes.json();
      const consultationsData = await consultationsRes.json();

      const colleges = collegesData.colleges || [];
      const consultations = consultationsData.consultations || [];

      setStats({
        totalColleges: colleges.length,
        publishedColleges: colleges.filter((c: any) => c.status === 'published').length,
        totalConsultations: consultations.length,
        pendingConsultations: consultations.filter((c: any) => c.status === 'pending').length,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Colleges',
      value: stats.totalColleges,
      icon: GraduationCap,
      color: 'bg-blue-500',
      link: '/admin/colleges',
    },
    {
      title: 'Published Colleges',
      value: stats.publishedColleges,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/admin/colleges',
    },
    {
      title: 'Total Consultations',
      value: stats.totalConsultations,
      icon: MessageSquare,
      color: 'bg-purple-500',
      link: '/admin/consultations',
    },
    {
      title: 'Pending Consultations',
      value: stats.pendingConsultations,
      icon: Clock,
      color: 'bg-orange-500',
      link: '/admin/consultations',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Promise India Education Admin Panel</p>
        {/* Debug info - remove in production */}
        {currentAdmin && (
          <p className="text-xs text-gray-500 mt-2">
            Logged in as: {currentAdmin.email} | Role: {currentAdmin.role || 'Not set'}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <Link href={stat.link}>
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    View Details
                  </Button>
                </Link>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/admin/colleges/new">
                <Button variant="primary" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New College
                </Button>
              </Link>
              <Link href="/admin/consultations">
                <Button variant="secondary" className="w-full">
                  View Consultation Requests
                  {stats.pendingConsultations > 0 && (
                    <span className="ml-2 bg-white text-secondary px-2 py-0.5 rounded-full text-xs">
                      {stats.pendingConsultations}
                    </span>
                  )}
                </Button>
              </Link>
              {currentAdmin?.role === 'super_admin' && (
                <Link href="/admin/settings/admins">
                  <Button variant="outline" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Admins
                  </Button>
                </Link>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-4">System Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-semibold">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Database:</span>
                <span className="font-semibold">PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Framework:</span>
                <span className="font-semibold">Next.js 14</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}