'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Shield, User, AlertTriangle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';

export default function AdminsManagementPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<{ id: string; name: string } | null>(null);
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);
    const [editingAdmin, setEditingAdmin] = useState<any>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'admin',
        active: true,
    });

    useEffect(() => {
        fetchAdmins();
        checkCurrentAdmin();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/admin');
            const data = await response.json();
            if (response.ok) {
                setAdmins(data.admins || []);
            }
        } catch (error) {
            console.error('Failed to fetch admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkCurrentAdmin = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            setCurrentAdmin(data.admin);
        } catch (error) {
            console.error('Failed to fetch current admin');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingAdmin ? 'PUT' : 'POST';
            const url = editingAdmin
                ? `/api/admin/${editingAdmin.id}`
                : '/api/admin';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    password: formData.password || undefined,
                }),
            });

            if (response.ok) {
                setShowForm(false);
                setEditingAdmin(null);
                setFormData({
                    email: '',
                    password: '',
                    name: '',
                    role: 'admin',
                    active: true,
                });
                fetchAdmins();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save admin');
            }
        } catch (error) {
            alert('Error saving admin');
        }
    };

    const openDeleteModal = (id: string, name: string) => {
        setAdminToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAdminToDelete(null);
    };

    const confirmDelete = async () => {
        if (!adminToDelete) return;

        try {
            const response = await fetch(`/api/admin/${adminToDelete.id}`, { method: 'DELETE' });
            if (response.ok) {
                fetchAdmins();
                closeDeleteModal();
            } else {
                alert('Failed to delete admin');
            }
        } catch (error) {
            alert('Error deleting admin');
        }
    };

    const toggleActive = async (id: string, active: boolean) => {
        try {
            const response = await fetch(`/api/admin/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !active }),
            });

            if (response.ok) {
                fetchAdmins();
            }
        } catch (error) {
            alert('Error updating admin');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admins...</p>
                </div>
            </div>
        );
    }

    if (currentAdmin?.role !== 'super_admin') {
        return (
            <Card>
                <CardBody className="text-center py-12">
                    <p className="text-gray-600">Only super admins can manage other administrators.</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Admin Management</h1>
                    <p className="text-gray-600">Manage administrator accounts and permissions</p>
                </div>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                </Button>
            </div>

            {showForm && (
                <Card className="mb-6">
                    <CardBody>
                        <h3 className="text-lg font-bold mb-4">
                            {editingAdmin ? 'Edit Admin' : 'Create New Admin'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Min 6 characters"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="input"
                                        disabled={
                                            editingAdmin?.role === 'super_admin' ||
                                            editingAdmin?.id === currentAdmin?.id
                                        }
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" variant="primary">{editingAdmin ? 'Update Admin' : 'Create Admin'}</Button>
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            )}

            <div className="space-y-4">
                {admins.map((admin) => (
                    <Card key={admin.id}>
                        <CardBody>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    {admin?.profileImage ? (
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                                src={admin.profileImage}
                                                alt={admin.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={`p-3 rounded-full ${admin.role === 'super_admin'
                                                ? 'bg-purple-100'
                                                : 'bg-blue-100'
                                                }`}
                                        >
                                            {admin.role === 'super_admin' ? (
                                                <Shield className="h-5 w-5 text-purple-600" />
                                            ) : (
                                                <User className="h-5 w-5 text-blue-600" />
                                            )}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-lg font-bold">{admin.name}</h3>
                                        <p className="text-sm text-gray-600">{admin.email}</p>
                                        <div className="flex items-center gap-3 mt-2 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${admin.role === 'super_admin'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${admin.active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {admin.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-gray-500">
                                                Created {formatDateTime(admin.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">

                                    {/* Edit button – allow self edit */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setEditingAdmin(admin);
                                            setFormData({
                                                email: admin.email,
                                                password: '',
                                                name: admin.name,
                                                role: admin.role,
                                                active: admin.active,
                                            });
                                            setShowForm(true);
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    {currentAdmin?.id !== admin.id && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => toggleActive(admin.id, admin.active)}
                                            >
                                                {admin.active ? 'Deactivate' : 'Activate'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openDeleteModal(admin.id, admin.name)}
                                                className="text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold">Delete Admin</h3>
                            </div>

                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{adminToDelete?.name}</strong>?
                                This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={closeDeleteModal}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Admin
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}