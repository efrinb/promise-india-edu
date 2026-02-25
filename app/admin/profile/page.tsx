'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Upload, X } from 'lucide-react';
import Image from 'next/image';

export default function AdminProfilePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            const data = await res.json();

            if (res.ok) {
                setFormData({
                    name: data.admin.name,
                    email: data.admin.email,
                    password: '',
                    profileImage: data.admin.profileImage || '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('File must be an image');
            return;
        }
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
                setFormData(prev => ({ ...prev, profileImage: data.urls[0] }));
            } else {
                setError(data.error || 'Failed to upload image');
            }
        } catch {
            setError('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };
    const removeProfileImage = () => {
        setFormData(prev => ({ ...prev, profileImage: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);
        setError('');

        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password || undefined,
                    profileImage: formData.profileImage || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setFormData((prev) => ({ ...prev, password: '' }));
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="p-6">Loading profile...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
                    Profile updated successfully
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
                    {error}
                </div>
            )}

            <Card>
                <CardBody>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Picture */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Profile Picture
                            </label>

                            {formData.profileImage ? (
                                <div className="flex items-center gap-4">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                                        <Image
                                            src={formData.profileImage}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={removeProfileImage}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Remove Photo
                                        </Button>
                                        <label className="cursor-pointer">
                                            <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <Upload className="mr-2 h-4 w-4" />
                                                {uploading ? 'Uploading...' : 'Change Photo'}
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-gray-400 dark:text-gray-500">
                                        {formData.name.charAt(0).toUpperCase()}
                                    </div>
                                    <label className="cursor-pointer">
                                        <div className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <Upload className="mr-2 h-4 w-4" />
                                            {uploading ? 'Uploading...' : 'Upload Photo'}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            )}
                            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                JPG, PNG or GIF • Max 5MB
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>

                        <Input
                            label="New Password (optional)"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            placeholder="Leave blank to keep current password"
                        />

                        <Button type="submit" disabled={saving}>
                            <Save className="mr-2 h-4 w-4" />
                            {saving ? 'Saving...' : 'Update Profile'}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
