'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NotificationProvider, useNotifications } from '@/context/NotificationContext';

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { unreadCount } = useNotifications();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/colleges', icon: GraduationCap, label: 'Colleges' },
    {
      href: '/admin/consultations',
      icon: MessageSquare,
      label: 'Consultations',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary dark:bg-gray-800 text-white transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 dark:border-gray-700">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>

        {/* Profile Section */}
        <Link href="/admin/profile">
          <div className="flex items-center space-x-3 p-4 mx-4 my-4 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700 transition-colors cursor-pointer">
            {admin?.profileImage ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/20">
                <Image
                  src={admin.profileImage}
                  alt={admin.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ring-2 ring-white/20">
                {admin.role === 'super_admin' ? (
                  <Shield className="h-6 w-6 text-white" />
                ) : (
                  <User className="h-6 w-6 text-white" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{admin?.name}</p>
              <p className="text-xs text-white/60 truncate">{admin?.email}</p>
              {admin?.role === 'super_admin' && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                  Super Admin
                </span>
              )}
            </div>
          </div>
        </Link>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                  ${isActive ? 'bg-white/20 dark:bg-gray-700' : 'hover:bg-white/10 dark:hover:bg-gray-700'}
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="bg-accent text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/10 dark:hover:bg-gray-700 w-full transition-colors text-white"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Promise India Education</h1>
            <div className="flex items-center gap-4">
              {unreadCount > 0 && (
                <Link href="/admin/consultations">
                  <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <MessageSquare className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </button>
                </Link>
              )}
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">View Site</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </NotificationProvider>
  );
}