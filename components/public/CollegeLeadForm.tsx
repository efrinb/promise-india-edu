'use client';

import { useState } from 'react';

interface Props {
  collegeName: string;
  googleFormUrl?: string | null;
}

const NURSING_COURSES = [
  'BSc Nursing',
  'GNM',
  'MSc Nursing',
  'Post Basic BSc Nursing',
  'ANM',
  'Other',
];

export function CollegeLeadForm({ collegeName, googleFormUrl }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredCourse: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: `Interested in ${collegeName} - Course: ${formData.preferredCourse}`,
          inquiryType: 'apply',
          source: 'college_detail_sidebar',
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', preferredCourse: '' });
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-[#d9a441] rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-[#001b4d] text-xl font-bold">✓</span>
        </div>
        <p className="text-white font-bold mb-1">Request Submitted!</p>
        <p className="text-white/60 text-sm">Our counselor will call you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
          <p className="text-red-200 text-xs">{error}</p>
        </div>
      )}

      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        required
        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] transition-colors"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={e => setFormData({ ...formData, phone: e.target.value })}
        required
        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] transition-colors"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={e => setFormData({ ...formData, email: e.target.value })}
        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] transition-colors"
      />
      <select
        value={formData.preferredCourse}
        onChange={e => setFormData({ ...formData, preferredCourse: e.target.value })}
        required
        className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:border-[#d9a441] focus:ring-1 focus:ring-[#d9a441] transition-colors text-white"
      >
        <option value="" className="bg-[#001b4d]">Select Course</option>
        {NURSING_COURSES.map(c => (
          <option key={c} value={c} className="bg-[#001b4d]">{c}</option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#d9a441] text-[#001b4d] font-bold rounded-lg text-sm hover:bg-[#c4922e] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Request a Call Back'}
      </button>
      <p className="text-white/40 text-xs text-center">By submitting, you agree to our privacy policy.</p>
    </form>
  );
}
