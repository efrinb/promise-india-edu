'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save } from 'lucide-react';

export default function AdminProfilePage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

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
                });
            }
        } catch {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
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
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setFormData((prev) => ({ ...prev, password: '' }));
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
