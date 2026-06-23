'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Star, Filter, ArrowRight, BookOpen, GraduationCap, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { College } from '@/types';
import { AnimatedHeading } from '@/components/ui/AnimatedHeading';

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Cities');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [collegeType, setCollegeType] = useState<'All' | 'Private' | 'Government'>('All');
  const [openOnly, setOpenOnly] = useState(false);
  const [sortBy, setSortBy] = useState('Popularity');

  // Load colleges
  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/colleges');
      const data = await response.json();
      setColleges(data.colleges || []);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Unique cities list for the dropdown
  const cities = ['All Cities', ...Array.from(new Set(colleges.map(c => c.location.split(',')[0].trim())))];

  // Filtering
  const filteredColleges = colleges.filter((college) => {
    // Search
    if (search && !college.name.toLowerCase().includes(search.toLowerCase()) && !college.shortDescription.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    // Location
    if (selectedLocation !== 'All Cities' && !college.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    // Course Type
    if (selectedCourses.length > 0) {
      const hasMatchingCourse = college.courses.some(c =>
        selectedCourses.some(selected => c.toLowerCase().includes(selected.toLowerCase()))
      );
      if (!hasMatchingCourse) return false;
    }
    // College Type
    if (collegeType !== 'All') {
      const isGov = college.name.toLowerCase().includes('government') || college.category.toLowerCase().includes('government');
      if (collegeType === 'Government' && !isGov) return false;
      if (collegeType === 'Private' && isGov) return false;
    }
    // Admission Status (Open Only)
    if (openOnly && college.admissionStatus !== 'open') {
      return false;
    }
    return true;
  });

  // Sorting
  const sortedColleges = [...filteredColleges].sort((a, b) => {
    if (sortBy === 'Popularity') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    }
    if (sortBy === 'Name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const toggleCourseFilter = (course: string) => {
    setSelectedCourses(prev =>
      prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* ── Hero Section ── */}
      <section className="relative bg-[#001b4d] text-white py-16 md:py-20 overflow-hidden">
        {/* Background Image Overlay with low opacity */}
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1586773860418-d3b3da96a362?auto=format&fit=crop&q=80&w=1200" 
            alt="Colleges Hero Bg" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-[#d9a441]">Colleges</span>
          </nav>
          <div className="max-w-3xl">
            <AnimatedHeading as="h1" direction="left" className="text-3xl sm:text-5xl font-bold mb-3 leading-tight text-white">
              Top Nursing <span className="text-[#d9a441]">Colleges</span>
            </AnimatedHeading>
            <p className="text-gray-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              Explore India's most prestigious nursing institutions recognized by INC, offering world-class infrastructure and clinical training.
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* ── Left Sidebar Filters ── */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              
              <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                <Filter className="h-4.5 w-4.5 text-[#001b4d]" />
                <h2 className="font-bold text-[#001b4d] text-base">Filters</h2>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Search College</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Typename..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fb] border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-[#d9a441] transition-all"
                  />
                </div>
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#f8f9fb] border border-gray-200 rounded-lg text-sm text-[#001b4d] font-semibold focus:outline-none focus:border-[#d9a441] transition-all"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Course Type Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Course Type</label>
                <div className="space-y-2">
                  {[
                    { key: 'BSc Nursing', label: 'B.Sc. Nursing' },
                    { key: 'MSc Nursing', label: 'M.Sc. Nursing' },
                    { key: 'GNM', label: 'General Nursing (GNM)' }
                  ].map((course) => (
                    <label key={course.key} className="flex items-center gap-2.5 text-xs font-bold text-[#001b4d] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.key)}
                        onChange={() => toggleCourseFilter(course.key)}
                        className="h-4 w-4 rounded border-gray-300 text-[#001b4d] focus:ring-[#d9a441] accent-[#001b4d]"
                      />
                      <span>{course.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* College Type (Switch Button) */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">College Type</label>
                <div className="grid grid-cols-2 gap-2 bg-[#f8f9fb] p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => setCollegeType(collegeType === 'Private' ? 'All' : 'Private')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      collegeType === 'Private' ? 'bg-[#001b4d] text-white' : 'text-gray-500 hover:text-[#001b4d]'
                    }`}
                  >
                    Private
                  </button>
                  <button
                    onClick={() => setCollegeType(collegeType === 'Government' ? 'All' : 'Government')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      collegeType === 'Government' ? 'bg-[#001b4d] text-white' : 'text-gray-500 hover:text-[#001b4d]'
                    }`}
                  >
                    Government
                  </button>
                </div>
              </div>

              {/* Admission Status Switch */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="block text-xs font-bold text-[#001b4d]">Admission Status</span>
                  <span className="text-[10px] text-gray-400">Open Only</span>
                </div>
                <button
                  onClick={() => setOpenOnly(!openOnly)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    openOnly ? 'bg-[#001b4d]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      openOnly ? 'translate-x-4.5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => {
                  setSearch('');
                  setSelectedLocation('All Cities');
                  setSelectedCourses([]);
                  setCollegeType('All');
                  setOpenOnly(false);
                }}
                className="w-full py-2.5 bg-[#001b4d] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#002870] transition-colors"
              >
                Apply Filters
              </button>

            </div>
          </div>

          {/* ── Right Content: Results List ── */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header / Sort */}
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#001b4d]">
                Showing <span className="text-[#d9a441]">{sortedColleges.length}</span> Nursing Colleges
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#001b4d] border-none focus:ring-0 cursor-pointer"
                >
                  <option value="Popularity">Popularity</option>
                  <option value="Name">Name</option>
                </select>
              </div>
            </div>

            {/* Colleges Horizontal Cards */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white border border-gray-200 rounded-xl p-5 h-44 animate-pulse flex gap-5">
                    <div className="w-1/3 bg-gray-100 rounded-lg h-full" />
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                      <div className="h-6 bg-gray-100 rounded w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedColleges.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-[#001b4d] text-lg mb-1">No colleges found</h3>
                <p className="text-gray-400 text-xs max-w-sm mx-auto mb-4">We couldn't find any institutions matching your selected filter options. Try adjusting them.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedLocation('All Cities');
                    setSelectedCourses([]);
                    setCollegeType('All');
                    setOpenOnly(false);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#001b4d] hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedColleges.map((college) => {
                  const fees = college.fees as any;
                  return (
                    <div key={college.id} className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
                      
                      {/* Image Thumbnail */}
                      <div className="w-full md:w-56 h-40 md:h-36 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {college.thumbnailUrl ? (
                          <img src={college.thumbnailUrl} alt={college.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#001b4d] flex items-center justify-center">
                            <BookOpen className="h-10 w-10 text-white/20" />
                          </div>
                        )}
                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {college.featured && (
                            <span className="bg-[#d9a441] text-[#001b4d] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              ★ Featured
                            </span>
                          )}
                          {college.admissionStatus === 'open' && (
                            <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                              Admission Open
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content details on right */}
                      <div className="flex-1 flex flex-col justify-between py-1">
                        
                        <div>
                          {/* Location & Rating */}
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold mb-1.5 uppercase tracking-wide">
                            <MapPin className="h-3.5 w-3.5 text-[#d9a441]" />
                            <span>{college.location}</span>
                            <span className="mx-1">•</span>
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-[#d9a441] text-[#d9a441]" />
                              <span className="text-[#001b4d]">4.8</span>
                            </div>
                          </div>

                          {/* College Name */}
                          <h3 className="text-lg font-bold text-[#001b4d] mb-3 hover:text-[#d9a441] transition-colors">
                            <Link href={`/colleges/${college.slug}`}>{college.name}</Link>
                          </h3>

                          {/* Info Rows */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs mb-4">
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Courses</span>
                              <span className="font-bold text-[#001b4d] line-clamp-1">{college.courses.slice(0, 3).join(', ') || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">Fee Range</span>
                              <span className="font-bold text-[#001b4d]">
                                {(() => {
                                  if (fees?.courseFees && typeof fees.courseFees === 'object') {
                                    const values = Object.values(fees.courseFees).map(Number).filter(v => v > 0);
                                    if (values.length > 0) {
                                      const minFee = Math.min(...values);
                                      const maxFee = Math.max(...values);
                                      return minFee === maxFee
                                        ? `${formatCurrency(minFee)} Total`
                                        : `${formatCurrency(minFee)} - ${formatCurrency(maxFee)} Total`;
                                    }
                                  }
                                  return fees?.total ? `${formatCurrency(fees.total / 4)}/Yr - ${formatCurrency(fees.total)} Total` : 'N/A';
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                          <Link href={`/colleges/${college.slug}`} className="flex-1">
                            <span className="block text-center py-2 border border-gray-200 rounded-lg text-xs font-bold text-[#001b4d] hover:bg-gray-50 transition-colors cursor-pointer">
                              View Details
                            </span>
                          </Link>
                          <Link href={`/contact?type=enquiry&college=${college.slug}`} className="flex-1">
                            <span className="block text-center py-2 bg-[#001b4d] text-white rounded-lg text-xs font-bold hover:bg-[#002870] transition-colors cursor-pointer">
                              Enquire Now
                            </span>
                          </Link>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Numbered Pagination Mock */}
            <div className="flex justify-center items-center gap-2 pt-6">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-400 hover:bg-white transition-all">‹</button>
              <button className="px-3.5 py-1.5 bg-[#001b4d] text-white rounded-lg text-xs font-bold">1</button>
              <button className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-400 hover:bg-white hover:text-[#001b4d] transition-all">2</button>
              <button className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-400 hover:bg-white hover:text-[#001b4d] transition-all">3</button>
              <span className="text-gray-400 text-xs">...</span>
              <button className="px-3.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-400 hover:bg-white hover:text-[#001b4d] transition-all">8</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-400 hover:bg-white transition-all">›</button>
            </div>

          </div>

        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#001b4d] rounded-xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="max-w-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">Confused about choosing the right college?</h2>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed">
              Get a free consultation from our expert education advisors and secure your admission today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0 w-full md:w-auto">
            <Link href="/contact?type=consultation&source=colleges_bottom" className="flex-1 md:flex-initial">
              <span className="block text-center px-6 py-3 bg-[#d9a441] text-[#001b4d] font-bold rounded-lg text-sm hover:bg-[#c4922e] transition-colors cursor-pointer">
                Book Free Session
              </span>
            </Link>
            <Link href="/contact?type=apply&source=colleges_bottom" className="flex-1 md:flex-initial">
              <span className="block text-center px-6 py-3 border border-white/20 text-white font-bold rounded-lg text-sm hover:bg-white/10 transition-colors cursor-pointer">
                Download Guide
              </span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}