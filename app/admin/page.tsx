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
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#001b4d] to-[#003399] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d9a441] rounded-full opacity-10 -translate-y-1/3 translate-x-1/3 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full opacity-5 translate-y-1/2 -translate-x-1/2 blur-xl"></div>
        <div className="relative z-10">
          <span className="bg-[#d9a441] text-[#001b4d] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Admin Console
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 font-heading tracking-tight">Promise India Education Consultancy</h1>
          <p className="text-gray-200 mt-2 max-w-xl text-sm md:text-base">
            Manage consultations, update college profiles, track applications and secure admissions.
          </p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="rounded-2xl hover:shadow-lg transition-all duration-300 border-t-4 border-[#d9a441] hover:-translate-y-1 group">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-text-light dark:text-gray-400 font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                    <p className="text-3xl font-extrabold text-[#001b4d] dark:text-white">{stat.value}</p>
                  </div>
                  <div className="bg-[#001b4d] p-3.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Link href={stat.link}>
                  <Button variant="ghost" size="sm" className="mt-4 w-full text-primary hover:bg-[#001b4d]/5 dark:text-primary-400 dark:hover:bg-primary-950/20 font-bold rounded-xl text-xs py-2">
                    View Details
                  </Button>
                </Link>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Analytics & Tracking */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Leads by Inquiry Type */}
        <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-[#001b4d] mb-5 flex items-center border-b pb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
              Leads by Inquiry Type
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Apply for Admission</span>
                <span className="px-3.5 py-1 bg-[#d9a441]/10 text-[#d9a441] rounded-full text-sm font-extrabold">{stats.inquiryTypes.apply}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Free Consultation</span>
                <span className="px-3.5 py-1 bg-[#001b4d]/10 text-[#001b4d] rounded-full text-sm font-extrabold">{stats.inquiryTypes.consultation}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Office Visit</span>
                <span className="px-3.5 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-extrabold">{stats.inquiryTypes.visit}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">General Inquiry</span>
                <span className="px-3.5 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-extrabold">{stats.inquiryTypes.general}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Lead Source Tracking */}
        <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-[#001b4d] mb-5 flex items-center border-b pb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#001b4d] mr-2"></span>
              Lead Source Tracking
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Homepage Banner</span>
                <span className="px-3.5 py-1 bg-[#001b4d]/10 text-[#001b4d] rounded-full text-sm font-extrabold">{stats.sources.homepage}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">College Details Page</span>
                <span className="px-3.5 py-1 bg-[#d9a441]/10 text-[#d9a441] rounded-full text-sm font-extrabold">{stats.sources.college_detail}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Direct Contact / WhatsApp</span>
                <span className="px-3.5 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-extrabold">{stats.sources.direct}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#001b4d]/5 dark:bg-gray-800 rounded-2xl transition-colors">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mobile Floating CTA</span>
                <span className="px-3.5 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-extrabold">{stats.sources.mobile_cta}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions & System Info */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-[#001b4d] mb-5 border-b pb-4">Quick Operations</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/admin/colleges/new" className="w-full">
                <Button className="w-full bg-[#001b4d] hover:bg-[#003399] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex justify-center items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add College
                </Button>
              </Link>
              <Link href="/admin/consultations" className="w-full">
                <Button className="w-full bg-[#d9a441] hover:bg-[#c4922e] text-[#001b4d] font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex justify-center items-center">
                  View Leads
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-[#001b4d] text-white px-2 py-0.5 rounded-full text-xs font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
              {currentAdmin?.role === 'super_admin' && (
                <Link href="/admin/settings/admins" className="w-full sm:col-span-2">
                  <Button className="w-full border-2 border-gray-200 hover:border-[#001b4d] text-gray-700 hover:text-[#001b4d] font-bold py-3.5 rounded-xl transition-all text-sm flex justify-center items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Manage Administrators
                  </Button>
                </Link>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-2xl border-none shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-[#001b4d] mb-5 border-b pb-4">Performance Insights</h3>
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Admissions Portal Version:</span>
                <span className="font-bold text-gray-800">2.1.0</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Featured Institutions:</span>
                <span className="font-bold text-[#d9a441]">{stats.featuredColleges}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-500">Lead Conversion Rate:</span>
                <span className="font-bold text-[#001b4d]">
                  {stats.totalConsultations > 0
                    ? Math.round(((stats.totalConsultations - stats.pendingConsultations) / stats.totalConsultations) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Core Application Rate:</span>
                <span className="font-bold text-[#001b4d]">
                  {stats.totalConsultations > 0
                    ? Math.round((stats.inquiryTypes.apply / stats.totalConsultations) * 100)
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