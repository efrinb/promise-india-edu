'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    adminEmail: '',
    phone: '',
    address: '',
    whatsappUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (response.ok && data.settings) {
        setFormData({
          adminEmail: data.settings.adminEmail || '',
          phone: data.settings.phone || '',
          address: data.settings.address || '',
          whatsappUrl: data.settings.whatsappUrl || '',
          facebookUrl: data.settings.facebookUrl || '',
          instagramUrl: data.settings.instagramUrl || '',
          twitterUrl: data.settings.twitterUrl || '',
          linkedinUrl: data.settings.linkedinUrl || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600">Manage your site settings and contact information</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ Settings saved successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardBody>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <SettingsIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Contact Information</h2>
                  <p className="text-sm text-gray-600">Update your contact details</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Admin Email (for notifications)"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  required
                  placeholder="info@promiseindia.com"
                />

                <Input
                  label="Contact Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Office Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="textarea"
                  placeholder="Enter your office address"
                />
              </div>
            </CardBody>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardBody>
              <h2 className="text-xl font-bold mb-6">Social Media & Messaging Links</h2>

              <div className="space-y-4">
                <Input
                  label="WhatsApp URL"
                  type="url"
                  value={formData.whatsappUrl}
                  onChange={(e) => setFormData({ ...formData, whatsappUrl: e.target.value })}
                  placeholder="https://wa.me/919876543210"
                />
                <p className="text-xs text-gray-500 -mt-2">
                  Format: https://wa.me/[country_code][phone_number] (e.g., https://wa.me/919876543210)
                </p>

                <Input
                  label="Facebook URL"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/promiseindia"
                />

                <Input
                  label="Instagram URL"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/promiseindia"
                />

                <Input
                  label="Twitter URL"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/promiseindia"
                />

                <Input
                  label="LinkedIn URL"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/promiseindia"
                />
              </div>
            </CardBody>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Info Card */}
      <Card className="mt-6">
        <CardBody className="bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Important Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Admin email will receive notifications for new consultation requests</li>
            <li>• Contact information will be displayed on the public website footer</li>
            <li>• Social media links will appear in the footer with clickable icons</li>
            <li>• WhatsApp link format: https://wa.me/[country_code][phone] (no + or spaces)</li>
            <li>• Leave URL fields empty to hide those social media links</li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}