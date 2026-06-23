'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  BarChart3, BookOpen, ListOrdered, Users, HelpCircle,
  Plus, Pencil, Trash2, Save, X, ChevronUp, ChevronDown, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';

// ─── Types ────────────────────────────────────────────────────────────────────
type TabId = 'statistics' | 'programs' | 'steps' | 'team' | 'faqs';

interface Tab {
  id: TabId;
  label: string;
  model: string;
  icon: React.ElementType;
  color: string;
}

const TABS: Tab[] = [
  { id: 'statistics', label: 'Site Statistics', model: 'siteStatistic', icon: BarChart3, color: 'text-navy' },
  { id: 'programs',   label: 'Course Programs', model: 'courseProgram',  icon: BookOpen,  color: 'text-gold' },
  { id: 'steps',     label: 'Admission Steps',  model: 'admissionStep',  icon: ListOrdered, color: 'text-navy' },
  { id: 'team',      label: 'Team Members',     model: 'teamMember',     icon: Users,     color: 'text-gold' },
  { id: 'faqs',      label: 'FAQs',             model: 'faq',            icon: HelpCircle, color: 'text-navy' },
];

// ─── Field Configs ─────────────────────────────────────────────────────────────
const FIELD_CONFIG: Record<TabId, { key: string; label: string; type: string; required?: boolean; rows?: number }[]> = {
  statistics: [
    { key: 'value',       label: 'Value (e.g. 2500+)',  type: 'text',     required: true },
    { key: 'label',       label: 'Label',               type: 'text',     required: true },
    { key: 'description', label: 'Description',         type: 'text' },
    { key: 'icon',        label: 'Icon Name',           type: 'text',     required: true },
    { key: 'order',       label: 'Display Order',       type: 'number' },
  ],
  programs: [
    { key: 'title',       label: 'Program Title',       type: 'text',     required: true },
    { key: 'duration',    label: 'Duration',            type: 'text',     required: true },
    { key: 'slug',        label: 'Slug (URL key)',      type: 'text',     required: true },
    { key: 'icon',        label: 'Icon Name',           type: 'text',     required: true },
    { key: 'description', label: 'Description',         type: 'textarea', required: true, rows: 3 },
    { key: 'bullets',     label: 'Highlights (one per line)', type: 'textarea', required: true, rows: 4 },
    { key: 'order',       label: 'Display Order',       type: 'number' },
  ],
  steps: [
    { key: 'stepNumber',  label: 'Step Number',         type: 'number',   required: true },
    { key: 'title',       label: 'Step Title',          type: 'text',     required: true },
    { key: 'description', label: 'Description',         type: 'textarea', required: true, rows: 3 },
    { key: 'icon',        label: 'Icon Name',           type: 'text',     required: true },
  ],
  team: [
    { key: 'name',        label: 'Full Name',           type: 'text',     required: true },
    { key: 'role',        label: 'Role / Title',        type: 'text',     required: true },
    { key: 'description', label: 'Bio',                 type: 'textarea', required: true, rows: 3 },
    { key: 'image',       label: 'Image URL',           type: 'text',     required: true },
    { key: 'linkedin',    label: 'LinkedIn URL',        type: 'text' },
    { key: 'facebook',    label: 'Facebook URL',        type: 'text' },
    { key: 'instagram',   label: 'Instagram URL',       type: 'text' },
    { key: 'order',       label: 'Display Order',       type: 'number' },
  ],
  faqs: [
    { key: 'question',    label: 'Question',            type: 'textarea', required: true, rows: 2 },
    { key: 'answer',      label: 'Answer',              type: 'textarea', required: true, rows: 4 },
    { key: 'order',       label: 'Display Order',       type: 'number' },
  ],
};

// ─── Helper: display label for a record ───────────────────────────────────────
function getRecordLabel(tab: TabId, rec: any): string {
  if (tab === 'statistics') return `${rec.value} — ${rec.label}`;
  if (tab === 'programs')   return rec.title;
  if (tab === 'steps')      return `Step ${rec.stepNumber}: ${rec.title}`;
  if (tab === 'team')       return `${rec.name} — ${rec.role}`;
  if (tab === 'faqs')       return rec.question?.slice(0, 60) + (rec.question?.length > 60 ? '…' : '');
  return rec.id;
}

// ─── Helpers: bullets JSON <-> textarea string ────────────────────────────────
function bulletsToText(bullets: any): string {
  if (!bullets) return '';
  if (Array.isArray(bullets)) return bullets.join('\n');
  if (typeof bullets === 'string') {
    try { const parsed = JSON.parse(bullets); return Array.isArray(parsed) ? parsed.join('\n') : bullets; }
    catch { return bullets; }
  }
  return '';
}

function textToBullets(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean);
}

// ─── Inline Form ──────────────────────────────────────────────────────────────
function ContentForm({
  tab, initial, onSave, onCancel, saving,
}: {
  tab: TabId;
  initial: Record<string, any>;
  onSave: (data: Record<string, any>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const fields = FIELD_CONFIG[tab];

  // Normalise bullets from JSON/array → plain text for editing
  const normalised = { ...initial };
  if (tab === 'programs' && initial.bullets !== undefined) {
    normalised.bullets = bulletsToText(initial.bullets);
  }

  const [form, setForm] = useState<Record<string, any>>(normalised);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // Convert bullets textarea back to JSON array before saving
        const payload = { ...form };
        if (tab === 'programs' && typeof payload.bullets === 'string') {
          payload.bullets = textToBullets(payload.bullets);
        }
        onSave(payload);
      }}
      className="border border-navy/20 rounded-xl p-6 bg-navy/5 space-y-4 mt-2"
    >
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map((f) =>
          f.type === 'textarea' ? (
            <div key={f.key} className={f.rows && f.rows >= 3 ? 'md:col-span-2' : ''}>
              <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-1">{f.label}</label>
              <textarea
                rows={f.rows ?? 3}
                required={f.required}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 resize-y"
              />
            </div>
          ) : (
            <div key={f.key}>
              <Input
                label={f.label}
                type={f.type}
                required={f.required}
                value={form[f.key] ?? ''}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value })
                }
              />
            </div>
          )
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} variant="primary" size="sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Record Row ───────────────────────────────────────────────────────────────
function RecordRow({
  tab, record, onEdit, onDelete, deleting,
}: {
  tab: TabId;
  record: any;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 group transition-colors">
      <span className="text-sm text-gray-700 flex-1 pr-4">{getRecordLabel(tab, record)}</span>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-navy/10 text-navy transition-colors"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
          title="Delete"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ─── Section Panel ────────────────────────────────────────────────────────────
function SectionPanel({ tab }: { tab: Tab }) {
  const [records, setRecords]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [saving, setSaving]     = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError]       = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content/${tab.model}`);
      const data = await res.json();
      setRecords(data.records ?? []);
    } catch {
      setError('Failed to load records.');
    } finally {
      setLoading(false);
    }
  }, [tab.model]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (formData: Record<string, any>) => {
    setSaving(true);
    setError('');
    try {
      const isNew = editingId === 'new';
      const url   = isNew
        ? `/api/admin/content/${tab.model}`
        : `/api/admin/content/${tab.model}?id=${editingId}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Save failed');
      setEditingId(null);
      await load();
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/content/${tab.model}?id=${id}`, { method: 'DELETE' });
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch {
      setError('Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  const getEmptyForm = () =>
    Object.fromEntries(FIELD_CONFIG[tab.id].map((f) => [f.key, f.type === 'number' ? 0 : '']));

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Add New */}
      {editingId === 'new' ? (
        <ContentForm
          tab={tab.id}
          initial={getEmptyForm()}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
          saving={saving}
        />
      ) : (
        <Button
          variant="primary"
          size="sm"
          onClick={() => setEditingId('new')}
          className="mb-4"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New
        </Button>
      )}

      {/* Records List */}
      <Card className="border border-gray-100">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No records yet. Click <strong>"Add New"</strong> to create one.
            </div>
          ) : (
            <div>
              {records.map((rec) => (
                <div key={rec.id}>
                  <RecordRow
                    tab={tab.id}
                    record={rec}
                    onEdit={() => setEditingId(editingId === rec.id ? null : rec.id)}
                    onDelete={() => handleDelete(rec.id)}
                    deleting={deletingId === rec.id}
                  />
                  {editingId === rec.id && (
                    <div className="px-4 pb-4">
                      <ContentForm
                        tab={tab.id}
                        initial={rec}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                        saving={saving}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContentManagerPage() {
  const [activeTab, setActiveTab] = useState<TabId>('statistics');
  const currentTab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-1">Site Content</h1>
        <p className="text-gray-500 text-sm">
          Manage all website content — statistics, programs, steps, team members, and FAQs.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-0">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-t-lg border-b-2 transition-all
                ${isActive
                  ? 'border-navy text-navy bg-navy/5'
                  : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'}
              `}
            >
              <Icon className={`h-4 w-4 ${isActive ? tab.color : ''}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className={`p-2 rounded-lg bg-navy/5`}>
            <currentTab.icon className={`h-5 w-5 ${currentTab.color}`} />
          </div>
          <div>
            <h2 className="font-bold text-navy">{currentTab.label}</h2>
            <p className="text-xs text-gray-500">Create, update or delete {currentTab.label.toLowerCase()}</p>
          </div>
        </div>
        <SectionPanel key={activeTab} tab={currentTab} />
      </div>
    </div>
  );
}
