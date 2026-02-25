'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
    Activity,
    LogIn,
    LogOut,
    Plus,
    Edit,
    Trash2,
    Eye,
    Filter,
    ChevronLeft,
    ChevronRight,
    User,
    Shield
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';

interface ActivityLog {
    id: string;
    action: string;
    entity: string | null;
    entityId: string | null;
    details: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    admin: {
        id: string;
        name: string;
        email: string;
        role: string;
        profileImage: string | null;
    };
}

export default function ActivityLogsPage() {
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);
    const [filters, setFilters] = useState({
        adminId: '',
        action: '',
        entity: '',
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
    });

    useEffect(() => {
        checkAccess();
    }, []);

    useEffect(() => {
        if (currentAdmin?.role === 'super_admin') {
            fetchActivities();
        }
    }, [pagination.page, filters, currentAdmin]);

    const checkAccess = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            setCurrentAdmin(data.admin);
        } catch (error) {
            console.error('Failed to check access');
        }
    };

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                ...(filters.adminId && { adminId: filters.adminId }),
                ...(filters.action && { action: filters.action }),
                ...(filters.entity && { entity: filters.entity }),
            });

            const response = await fetch(`/api/admin/activity-logs?${params}`);
            const data = await response.json();

            if (response.ok) {
                setActivities(data.activities);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        const icons: Record<string, any> = {
            login: LogIn,
            logout: LogOut,
            create: Plus,
            update: Edit,
            delete: Trash2,
            view: Eye,
        };
        const Icon = icons[action] || Activity;
        return <Icon className="h-4 w-4" />;
    };

    const getActionColor = (action: string) => {
        const colors: Record<string, string> = {
            login: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300',
            logout: 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300',
            create: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
            update: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300',
            delete: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300',
            view: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
        };
        return colors[action] || 'text-gray-600 bg-gray-100';
    };

    const clearFilters = () => {
        setFilters({ adminId: '', action: '', entity: '' });
    };

    if (!currentAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (currentAdmin.role !== 'super_admin') {
        return (
            <Card>
                <CardBody className="text-center py-12">
                    <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        Only super admins can view activity logs.
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Activity Logs</h1>
                <p className="text-text-light dark:text-gray-400">
                    Monitor all admin activities across the system
                </p>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Action</label>
                        <select
                            value={filters.action}
                            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                            className="input"
                        >
                            <option value="">All Actions</option>
                            <option value="login">Login</option>
                            <option value="logout">Logout</option>
                            <option value="create">Create</option>
                            <option value="update">Update</option>
                            <option value="delete">Delete</option>
                            <option value="view">View</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Entity</label>
                        <select
                            value={filters.entity}
                            onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                            className="input"
                        >
                            <option value="">All Entities</option>
                            <option value="college">College</option>
                            <option value="banner">Banner</option>
                            <option value="consultation">Consultation</option>
                            <option value="admin">Admin</option>
                            <option value="settings">Settings</option>
                            <option value="profile">Profile</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button variant="outline" onClick={clearFilters}>
                            <Filter className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Activity List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : activities.length === 0 ? (
                <Card>
                    <CardBody className="text-center py-12">
                        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No activities found</p>
                    </CardBody>
                </Card>
            ) : (
                <>
                    <div className="space-y-3">
                        {activities.map((activity) => (
                            <Card key={activity.id}>
                                <CardBody className="p-4">
                                    <div className="flex items-start gap-4">
                                        {/* Admin Avatar */}
                                        <div className="flex-shrink-0">
                                            {activity.admin.profileImage ? (
                                                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                                    <Image
                                                        src={activity.admin.profileImage}
                                                        alt={activity.admin.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    {activity.admin.role === 'super_admin' ? (
                                                        <Shield className="h-5 w-5 text-primary" />
                                                    ) : (
                                                        <User className="h-5 w-5 text-primary" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Activity Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {activity.admin.name}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${getActionColor(
                                                        activity.action
                                                    )}`}
                                                >
                                                    {getActionIcon(activity.action)}
                                                    {activity.action}
                                                </span>
                                                {activity.entity && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                        {activity.entity}
                                                    </span>
                                                )}
                                                {activity.admin.role === 'super_admin' && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                                        Super Admin
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {activity.admin.email}
                                            </p>

                                            {activity.details && (
                                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                                    {activity.details}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                <span>{formatDateTime(activity.createdAt)}</span>
                                                {activity.ipAddress && (
                                                    <span className="flex items-center gap-1">
                                                        IP: {activity.ipAddress}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Showing {activities.length} of {pagination.total} activities
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 text-sm">
                                    Page {pagination.page} of {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}