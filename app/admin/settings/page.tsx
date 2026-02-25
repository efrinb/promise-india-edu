'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Save,
  Megaphone,
  Share2,
  Contact,
  ChevronDown,
  ChevronRight,
  Image,
  Activity,
  Info,
} from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [contactOpen, setContactOpen] = useState(true);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);

  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  const [formData, setFormData] = useState({
    adminEmail: '',
    phone: '',
    address: '',
    whatsappUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    announcementEnabled: false,
    announcementText: '',
  });

  useEffect(() => {
    fetchSettings();
    fetchCurrentAdmin();
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
          announcementEnabled: data.settings.announcementEnabled || false,
          announcementText: data.settings.announcementText || '',
        });
      }
    } catch {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentAdmin = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setCurrentAdmin(data.admin);
      }
    } catch { }
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
    } catch {
      setError('An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div>

      {/* HEADER */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your site settings and contact information
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={saving}
          form="settings-form"
        >
          {saving ? (
            <>
              <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-5 w-5" />
              Save
            </>
          )}
        </Button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          ✓ Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      <form id="settings-form" onSubmit={handleSubmit}>
        <div className="space-y-6">

          {/* ACCORDION SECTIONS */}
          <AccordionCard
            title="Contact Information"
            description="Update your contact details"
            icon={<Contact className="h-5 w-5 text-primary" />}
            open={contactOpen}
            setOpen={setContactOpen}
          >
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Admin Email"
                type="email"
                value={formData.adminEmail}
                onChange={(e) =>
                  setFormData({ ...formData, adminEmail: e.target.value })
                }
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <textarea
              rows={3}
              className="textarea mt-4"
              placeholder="Office address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </AccordionCard>

          <AccordionCard
            title="Announcement Bar"
            description="Display announcement on website"
            icon={<Megaphone className="h-5 w-5 text-primary" />}
            open={announcementOpen}
            setOpen={setAnnouncementOpen}
          >
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.announcementEnabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementEnabled: e.target.checked,
                    })
                  }
                />
                <span>Enable Announcement</span>
              </label>

              <textarea
                rows={3}
                className="textarea"
                placeholder="Announcement message..."
                value={formData.announcementText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementText: e.target.value,
                  })
                }
              />
            </div>
          </AccordionCard>

          <AccordionCard
            title="Social Media & Messaging Links"
            description="Add social profiles & WhatsApp"
            icon={<Share2 className="h-5 w-5 text-primary" />}
            open={socialOpen}
            setOpen={setSocialOpen}
          >
            <Input
              label="WhatsApp URL"
              value={formData.whatsappUrl}
              onChange={(e) =>
                setFormData({ ...formData, whatsappUrl: e.target.value })
              }
            />
          </AccordionCard>

          {/* NAV CARDS */}
          <div className="mt-4">
            <Link href="/admin/settings/banners">
              <NavCard
                title="Homepage Banners"
                description="Manage carousel banners"
                icon={<Image className="h-5 w-5 text-accent" />}
              />
            </Link>
          </div>

          {/* GAP ADDED HERE */}
          {currentAdmin?.role === 'super_admin' && (
            <div className="mt-4">
              <Link href="/admin/settings/activity-logs">
                <NavCard
                  title="Activity Logs"
                  description="Monitor admin activities"
                  icon={<Activity className="h-5 w-5 text-purple-600" />}
                />
              </Link>
            </div>
          )}

          {/* INFO CARD */}
          <Card className="mt-8 border border-blue-200 bg-blue-50/60 rounded-2xl">
            <CardBody>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Info className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Important Information
                  </h3>

                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Admin email will receive notifications for new consultation requests</li>
                    <li>• Contact information will be displayed on the public website footer</li>
                    <li>• Social media links will appear in the footer with clickable icons</li>
                    <li>• WhatsApp link format: https://wa.me/[country_code][phone] (no + or spaces)</li>
                    <li>• Leave URL fields empty to hide those social media links</li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

        </div>
      </form>
    </div>
  );
}

/* ===============================
   REUSABLE COMPONENTS
================================ */

function AccordionCard({
  title,
  description,
  icon,
  open,
  setOpen,
  children,
}: any) {
  return (
    <Card className="group border border-gray-200/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden">
      <CardBody className="p-0">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between px-6 py-5 cursor-pointer bg-white hover:bg-gray-50 transition"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 group-hover:bg-primary/20 transition p-3 rounded-xl">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>

          <ChevronDown
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''
              }`}
          />
        </div>

        <div
          className={`transition-all duration-300 ${open
            ? 'max-h-[1000px] opacity-100'
            : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50/40">
            {children}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function NavCard({ title, description, icon }: any) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-primary/40 rounded-2xl">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 group-hover:bg-primary/20 transition p-3 rounded-xl">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition">
                {title}
              </h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </CardBody>
    </Card>
  );
}