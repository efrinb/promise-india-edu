'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, X, AlertTriangle } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import React Quill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function BannersManagementPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; banner: any | null }>({
        show: false,
        banner: null,
    });

    const [formData, setFormData] = useState({
        uniqueId: '',
        name: '',
        link: '',
        imageUrl: '',
        width: 'full',
        message: '',
        startDate: '',
        endDate: '',
        active: true,
        order: 0,
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await fetch('/api/banners?admin=true');
            const data = await response.json();
            if (response.ok) {
                setBanners(data.banners || []);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formDataToUpload = new FormData();
            formDataToUpload.append('files', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataToUpload,
            });

            const data = await response.json();

            if (response.ok) {
                setFormData(prev => ({ ...prev, imageUrl: data.urls[0] }));
            } else {
                setError(data.error || 'Failed to upload image');
            }
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const method = editingBanner ? 'PUT' : 'POST';
            const url = editingBanner
                ? `/api/banners/${editingBanner.id}`
                : '/api/banners';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setShowForm(false);
                setEditingBanner(null);
                resetForm();
                fetchBanners();
            } else {
                console.error('Error saving banner:', data.error);
                setError(data.error || 'Failed to save banner');
            }
        } catch (error) {
            setError('Error saving banner');
        }
    };

    const resetForm = () => {
        setFormData({
            uniqueId: '',
            name: '',
            link: '',
            imageUrl: '',
            width: 'full',
            message: '',
            startDate: '',
            endDate: '',
            active: true,
            order: 0,
        });
    };

    const handleEdit = (banner: any) => {
        setEditingBanner(banner);
        setFormData({
            uniqueId: banner.uniqueId,
            name: banner.name,
            link: banner.link || '',
            imageUrl: banner.imageUrl,
            width: banner.width,
            message: banner.message || '',
            startDate: new Date(banner.startDate).toISOString().split('T')[0],
            endDate: new Date(banner.endDate).toISOString().split('T')[0],
            active: banner.active,
            order: banner.order,
        });
        setShowForm(true);
    };

    const confirmDelete = async () => {
        if (!deleteModal.banner) return;

        try {
            const response = await fetch(`/api/banners/${deleteModal.banner.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchBanners();
                setDeleteModal({ show: false, banner: null });
            } else {
                alert('Failed to delete banner');
            }
        } catch (error) {
            alert('Error deleting banner');
        }
    };

    const toggleActive = async (id: string, active: boolean) => {
        try {
            const banner = banners.find(b => b.id === id);
            const response = await fetch(`/api/banners/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...banner,
                    startDate: new Date(banner.startDate).toISOString().split('T')[0],
                    endDate: new Date(banner.endDate).toISOString().split('T')[0],
                    active: !active,
                }),
            });

            if (response.ok) {
                fetchBanners();
            }
        } catch (error) {
            alert('Error updating banner');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading banners...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Banner Management</h1>
                    <p className="text-text-light dark:text-gray-400">Manage homepage carousel banners</p>
                </div>
                <Button
                    variant="danger"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingBanner(null);
                        resetForm();
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Banner
                </Button>
            </div>

            {/* Form */}
            {showForm && (
                <Card className="mb-6">
                    <CardBody>
                        <h3 className="text-lg font-bold mb-4">
                            {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                        </h3>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-800 dark:text-red-300">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Unique ID"
                                    value={formData.uniqueId}
                                    onChange={(e) => setFormData({ ...formData, uniqueId: e.target.value })}
                                    required
                                    placeholder="summer-sale-2026"
                                    disabled={!!editingBanner}
                                />
                                <Input
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Summer Sale Banner"
                                />
                            </div>

                            <Input
                                label="Link (Optional)"
                                type="url"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="https://example.com/promotion"
                            />

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Banner Image <span className="text-red-500">*</span>
                                </label>
                                {formData.imageUrl ? (
                                    <div className="relative w-full h-48">
                                        <Image
                                            src={formData.imageUrl}
                                            alt="Banner preview"
                                            fill
                                            className="rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                                        <label className="cursor-pointer">
                                            <span className="text-primary hover:text-primary-600">
                                                Click to upload banner image
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-1">Recommended: 1920x600px • PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Banner Width <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.width}
                                        onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                        className="input"
                                        required
                                    >
                                        <option value="full">Full Width (100%)</option>
                                        <option value="container">Container Width (Contained)</option>
                                        <option value="large">Large (90%)</option>
                                        <option value="medium">Medium (85%)</option>
                                    </select>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        Controls the width of the banner image section
                                    </p>
                                </div>

                                <Input
                                    label="Display Order"
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                                <Input
                                    label="End Date"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>

                            {/* WYSIWYG Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message (Optional)
                                </label>
                                <div className="bg-white dark:bg-gray-800 rounded-lg">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.message}
                                        onChange={(value) => setFormData({ ...formData, message: value })}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                [{ 'color': [] }, { 'background': [] }],
                                                ['link'],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Active (Display on website)
                                </label>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button type="submit" variant="primary" disabled={uploading || !formData.imageUrl}>
                                    {uploading ? 'Uploading...' : editingBanner ? 'Update Banner' : 'Create Banner'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingBanner(null);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            )}

            {/* Banners List */}
            <div className="space-y-4">
                {banners.length === 0 ? (
                    <Card>
                        <CardBody className="text-center py-12">
                            <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-text-light dark:text-gray-400">No banners created yet.</p>
                        </CardBody>
                    </Card>
                ) : (
                    banners.map((banner) => (
                        <Card key={banner.id}>
                            <CardBody>
                                <div className="flex items-start gap-4">
                                    {/* Banner Preview */}
                                    <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Banner Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold">{banner.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">ID: {banner.uniqueId}</p>
                                                {banner.link && (
                                                    <a
                                                        href={banner.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline"
                                                    >
                                                        {banner.link}
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleActive(banner.id, banner.active)}
                                                >
                                                    {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(banner)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteModal({ show: true, banner })}
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${banner.active
                                                ? 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                }`}>
                                                {banner.active ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Width: {banner.width}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Order: {banner.order}
                                            </span>
                                        </div>

                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDateTime(banner.startDate)} → {formatDateTime(banner.endDate)}
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.show && deleteModal.banner && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full animate-fade-in">
                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold">Delete Banner</h3>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete <strong>{deleteModal.banner.name}</strong>?
                                This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteModal({ show: false, banner: null })}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={confirmDelete}
                                    className="flex-1"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Banner
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}