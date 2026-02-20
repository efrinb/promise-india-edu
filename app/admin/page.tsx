'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, MessageSquare, CheckCircle, Clock, Shield, Plus, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/context/NotificationContext';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalColleges: 0,
    publishedColleges: 0,
    featuredColleges: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    inquiryTypes: {
      apply: 0,
      consultation: 0,
      visit: 0,
      general: 0,
    },
    sources: {
      homepage: 0,
      college_detail: 0,
      direct: 0,
      mobile_cta: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    fetchStats();
    fetchCurrentAdmin();
  }, []);

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
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

      // Calculate inquiry types
      const inquiryTypes = {
        apply: consultations.filter((c: any) => c.inquiryType === 'apply').length,
        consultation: consultations.filter((c: any) => c.inquiryType === 'consultation').length,
        visit: consultations.filter((c: any) => c.inquiryType === 'visit').length,
        general: consultations.filter((c: any) => c.inquiryType === 'general').length,
      };

      // Calculate sources
      const sources = {
        homepage: consultations.filter((c: any) => c.source === 'homepage').length,
        college_detail: consultations.filter((c: any) => c.source === 'college_detail').length,
        direct: consultations.filter((c: any) => c.source === 'direct').length,
        mobile_cta: consultations.filter((c: any) => c.source === 'mobile_cta').length,
      };

      setStats({
        totalColleges: colleges.length,
        publishedColleges: colleges.filter((c: any) => c.status === 'published').length,
        featuredColleges: colleges.filter((c: any) => c.featured).length,
        totalConsultations: consultations.length,
        pendingConsultations: consultations.filter((c: any) => c.status === 'pending').length,
        inquiryTypes,
        sources,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Colleges',
      value: stats.totalColleges,
      icon: GraduationCap,
      color: 'bg-primary',
      link: '/admin/colleges',
    },
    {
      title: 'Published',
      value: stats.publishedColleges,
      icon: CheckCircle,
      color: 'bg-secondary',
      link: '/admin/colleges',
    },
    {
      title: 'Total Leads',
      value: stats.totalConsultations,
      icon: MessageSquare,
      color: 'bg-accent',
      link: '/admin/consultations',
    },
    {
      title: 'Pending',
      value: stats.pendingConsultations,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/consultations',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-light dark:text-gray-400">Welcome to Promise India Education Admin Panel</p>
      </div>

      {/* Main Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-light dark:text-gray-400 mb-1">{stat.title}</p>
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

      {/* Lead Analytics */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Leads by Inquiry Type
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Apply for Admission</span>
                <span className="text-lg font-bold text-accent">{stats.inquiryTypes.apply}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Free Consultation</span>
                <span className="text-lg font-bold text-primary">{stats.inquiryTypes.consultation}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Office Visit</span>
                <span className="text-lg font-bold text-secondary">{stats.inquiryTypes.visit}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">General Inquiry</span>
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{stats.inquiryTypes.general}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-secondary" />
              Lead Source Tracking
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Homepage</span>
                <span className="text-lg font-bold text-primary">{stats.sources.homepage}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">College Detail Page</span>
                <span className="text-lg font-bold text-secondary">{stats.sources.college_detail}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Direct Contact</span>
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{stats.sources.direct}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background dark:bg-gray-700 rounded-lg">
                <span className="text-sm font-medium">Mobile CTA</span>
                <span className="text-lg font-bold text-accent">{stats.sources.mobile_cta}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
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
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-white text-secondary px-2 py-0.5 rounded-full text-xs font-bold">
                      {unreadCount}
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
                <span className="text-text-light dark:text-gray-400">Version:</span>
                <span className="font-semibold">2.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light dark:text-gray-400">Featured Colleges:</span>
                <span className="font-semibold">{stats.featuredColleges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light dark:text-gray-400">Application Rate:</span>
                <span className="font-semibold text-accent">
                  {stats.totalConsultations > 0
                    ? Math.round((stats.inquiryTypes.apply / stats.totalConsultations) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-light dark:text-gray-400">Conversion Rate:</span>
                <span className="font-semibold text-secondary">
                  {stats.totalConsultations > 0
                    ? Math.round(((stats.totalConsultations - stats.pendingConsultations) / stats.totalConsultations) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}