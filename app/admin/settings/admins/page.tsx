'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Shield, User, X } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateTime } from '@/lib/utils';

/* ----------------------------- */
/* Modal Component */
/* ----------------------------- */

function Modal({
    isOpen,
    onClose,
    title,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </button>

                <h3 className="text-lg font-bold mb-4">{title}</h3>

                <div>{children}</div>
            </div>
        </div>
    );
}

/* ----------------------------- */
/* Main Page */
/* ----------------------------- */

export default function AdminsManagementPage() {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState<any>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'admin',
        active: true,
    });

    /* Modal States */
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'error' | 'confirm' | 'success' | null>(null);
    const [modalMessage, setModalMessage] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    useEffect(() => {
        fetchAdmins();
        checkCurrentAdmin();
    }, []);

    const openModal = (
        type: 'error' | 'confirm' | 'success',
        message: string
    ) => {
        setModalType(type);
        setModalMessage(message);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalType(null);
        setDeleteTarget(null);
    };

    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/admin');
            const data = await response.json();
            if (response.ok) {
                setAdmins(data.admins || []);
            }
        } catch (error) {
            openModal('error', 'Failed to fetch admins.');
        } finally {
            setLoading(false);
        }
    };

    const checkCurrentAdmin = async () => {
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();
            setCurrentAdmin(data.admin);
        } catch {
            openModal('error', 'Failed to fetch current admin.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowForm(false);
                setFormData({
                    email: '',
                    password: '',
                    name: '',
                    role: 'admin',
                    active: true,
                });
                fetchAdmins();
                openModal('success', 'Admin created successfully.');
            } else {
                const data = await response.json();
                openModal('error', data.error || 'Failed to create admin.');
            }
        } catch {
            openModal('error', 'Error creating admin.');
        }
    };

    const confirmDelete = (id: string, name: string) => {
        setDeleteTarget({ id, name });
        openModal('confirm', `Delete admin "${name}"?`);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            const response = await fetch(`/api/admin/${deleteTarget.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchAdmins();
                openModal('success', 'Admin deleted successfully.');
            } else {
                openModal('error', 'Failed to delete admin.');
            }
        } catch {
            openModal('error', 'Error deleting admin.');
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
            } else {
                openModal('error', 'Failed to update admin.');
            }
        } catch {
            openModal('error', 'Error updating admin.');
        }
    };

    if (loading) return <div>Loading...</div>;

    if (currentAdmin?.role !== 'super_admin') {
        return (
            <Card>
                <CardBody className="text-center py-12">
                    <p className="text-gray-600">
                        Only super admins can manage other administrators.
                    </p>
                </CardBody>
            </Card>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Admin Management</h1>
                    <p className="text-gray-600">
                        Manage administrator accounts and permissions
                    </p>
                </div>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                </Button>
            </div>

            {/* Admin List */}
            <div className="space-y-4">
                {admins.map((admin) => (
                    <Card key={admin.id}>
                        <CardBody>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
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

                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {admin.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {admin.email}
                                        </p>
                                        <span className="text-gray-500 text-sm">
                                            Created {formatDateTime(admin.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                {currentAdmin?.id !== admin.id && (
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                toggleActive(admin.id, admin.active)
                                            }
                                        >
                                            {admin.active
                                                ? 'Deactivate'
                                                : 'Activate'}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:bg-red-50"
                                            onClick={() =>
                                                confirmDelete(admin.id, admin.name)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                title={
                    modalType === 'confirm'
                        ? 'Confirm Action'
                        : modalType === 'error'
                            ? 'Error'
                            : 'Success'
                }
            >
                <p className="mb-6">{modalMessage}</p>

                <div className="flex justify-end gap-3">
                    {modalType === 'confirm' ? (
                        <>
                            <Button variant="outline" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    handleDelete();
                                    closeModal();
                                }}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </Button>
                        </>
                    ) : (
                        <Button variant="primary" onClick={closeModal}>
                            OK
                        </Button>
                    )}
                </div>
            </Modal>
        </div>
    );
}
