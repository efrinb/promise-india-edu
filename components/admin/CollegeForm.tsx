'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CollegeFormProps {
  collegeId?: string;
  initialData?: any;
}

const AVAILABLE_FACILITIES = [
  'Modern Labs',
  'Digital Library',
  'Hostel Available',
  'Lecture Halls',
  'Student Canteen',
  'Transport',
  'Wi-Fi Campus',
  'Auditorium',
  'Sports Complex',
];

interface ValidationError {
  field: string;
  message: string;
}

export function CollegeForm({ collegeId, initialData }: CollegeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [uploadingVideos, setUploadingVideos] = useState(false);

  // Dynamic Course State
  const [dbCourses, setDbCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Modal State for Inline Course Creation
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    duration: '',
    description: '',
    bullets: '',
    slug: '',
    icon: 'GraduationCap',
  });
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [courseError, setCourseError] = useState('');

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Nursing',
    location: initialData?.location || '',
    shortDescription: initialData?.shortDescription || '',
    about: initialData?.about || '',
    courses: (initialData?.courses || []) as string[],
    
    // Dynamic course fees mapping
    courseFees: (initialData?.fees?.courseFees || {}) as Record<string, number>,
    hostel: initialData?.fees?.hostel || 0,
    other: initialData?.fees?.other || 0,

    admissionStatus: initialData?.admissionStatus || 'open',
    featured: initialData?.featured || false,
    thumbnailUrl: initialData?.thumbnailUrl || '',
    galleryUrls: (initialData?.galleryUrls || []) as string[],
    videoUrls: (initialData?.videoUrls || []) as string[],
    googleFormUrl: initialData?.googleFormUrl || '',
    status: initialData?.status || 'draft',

    // New Metadata Fields
    affiliation: initialData?.affiliation || '',
    approval: initialData?.approval || '',
    established: initialData?.established || '',
    campusSize: initialData?.campusSize || '',
    facilities: (initialData?.facilities || []) as string[],
  });

  // Fetch courses from dynamic course program model
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const response = await fetch('/api/admin/content/courseProgram');
      if (response.ok) {
        const data = await response.json();
        setDbCourses(data.records || []);
      }
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Gracefully migrate legacy fee structure (if editing a college that has total fee but not courseFees)
  useEffect(() => {
    if (initialData?.fees && !initialData.fees.courseFees && initialData.fees.total && initialData.courses) {
      const legacyFees: Record<string, number> = {};
      initialData.courses.forEach((c: string) => {
        legacyFees[c] = initialData.fees.total;
      });
      setFormData(prev => ({
        ...prev,
        courseFees: legacyFees
      }));
    }
  }, [initialData]);

  const toggleCourse = (course: string) => {
    setFormData(prev => {
      const exists = prev.courses.includes(course);
      const nextCourses = exists
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course];
      
      // If course is removed, clean up its fee entry
      const nextCourseFees = { ...prev.courseFees };
      if (exists) {
        delete nextCourseFees[course];
      }

      return {
        ...prev,
        courses: nextCourses,
        courseFees: nextCourseFees
      };
    });
  };

  const handleCourseFeeChange = (course: string, value: string) => {
    const numericVal = value === '' ? 0 : Number(value);
    setFormData(prev => ({
      ...prev,
      courseFees: {
        ...prev.courseFees,
        [course]: numericVal
      }
    }));
  };

  const toggleFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleCreateCourseInline = async (e: React.FormEvent) => {
    e.preventDefault();
    setCourseError('');
    if (!newCourseData.title || !newCourseData.slug || !newCourseData.duration) {
      setCourseError('Title, Slug and Duration are required fields.');
      return;
    }

    setCreatingCourse(true);
    try {
      const payload = {
        title: newCourseData.title.trim(),
        duration: newCourseData.duration.trim(),
        description: newCourseData.description.trim() || 'Custom course program.',
        bullets: newCourseData.bullets
          ? newCourseData.bullets.split(',').map(b => b.trim()).filter(Boolean)
          : ['Interactive sessions', 'Experienced faculty'],
        slug: newCourseData.slug.trim().toLowerCase(),
        icon: newCourseData.icon,
      };

      const response = await fetch('/api/admin/content/course-program', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      // Reload courses
      await fetchCourses();

      // Automatically select the new course
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, payload.title]
      }));

      // Reset modal state
      setNewCourseData({
        title: '',
        duration: '',
        description: '',
        bullets: '',
        slug: '',
        icon: 'GraduationCap',
      });
      setShowCourseModal(false);
    } catch (err: any) {
      setCourseError(err.message || 'Failed to create course');
    } finally {
      setCreatingCourse(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    // Required field validations
    if (!formData.name || formData.name.trim().length < 3) {
      errors.push({ field: 'name', message: 'College name must be at least 3 characters' });
    }

    if (!formData.location || formData.location.trim().length < 3) {
      errors.push({ field: 'location', message: 'Location is required' });
    }

    if (!formData.shortDescription || formData.shortDescription.trim().length < 10) {
      errors.push({ field: 'shortDescription', message: 'Short description must be at least 10 characters' });
    }

    if (!formData.about || formData.about.trim().length < 50) {
      errors.push({ field: 'about', message: 'About section must be at least 50 characters' });
    }

    // Courses validation
    if (formData.courses.length === 0) {
      errors.push({ field: 'courses', message: 'Please select at least one course' });
    }

    // Course Fees Validation
    formData.courses.forEach(c => {
      const fee = formData.courseFees[c];
      if (fee === undefined || fee <= 0) {
        errors.push({ field: `fee-${c}`, message: `Please enter a valid total fee for ${c}` });
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData(prev => ({ ...prev, thumbnailUrl: data.urls[0] }));
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formDataToUpload = new FormData();
      files.forEach(file => {
        formDataToUpload.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToUpload,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          galleryUrls: [...prev.galleryUrls, ...data.urls]
        }));
      } else {
        setError(data.error || 'Failed to upload images');
      }
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryUrls: prev.galleryUrls.filter((_: string, i: number) => i !== index)
    }));
  };

  const removeThumbnail = () => {
    setFormData(prev => ({ ...prev, thumbnailUrl: '' }));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check total videos limit
    if (formData.videoUrls.length + files.length > 5) {
      setError('Maximum 5 videos allowed. You can upload ' + (5 - formData.videoUrls.length) + ' more.');
      return;
    }

    // Validate file sizes and types
    for (const file of files) {
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        setError(`Video ${file.name} is too large. Maximum size is 100MB`);
        return;
      }

      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!allowedTypes.includes(file.type)) {
        setError(`Video ${file.name} is not a supported format. Use MP4, WebM, OGG, or MOV`);
        return;
      }
    }

    setUploadingVideos(true);
    setError('');

    try {
      const formDataToUpload = new FormData();
      files.forEach(file => {
        formDataToUpload.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToUpload,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          videoUrls: [...prev.videoUrls, ...data.urls]
        }));
      } else {
        setError(data.error || 'Failed to upload videos');
      }
    } catch (err) {
      setError('Failed to upload videos');
    } finally {
      setUploadingVideos(false);
    }
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videoUrls: prev.videoUrls.filter((_: string, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setValidationErrors([]);

    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the errors below before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      // Build courseFees map with numeric values
      const parsedCourseFees: Record<string, number> = {};
      formData.courses.forEach(c => {
        parsedCourseFees[c] = Number(formData.courseFees[c]) || 0;
      });

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location.trim(),
        shortDescription: formData.shortDescription.trim(),
        about: formData.about.trim(),
        courses: formData.courses,
        fees: {
          courseFees: parsedCourseFees,
          hostel: Number(formData.hostel) || 0,
          other: Number(formData.other) || 0,
        },
        admissionStatus: formData.admissionStatus,
        featured: formData.featured,
        thumbnailUrl: formData.thumbnailUrl || null,
        galleryUrls: formData.galleryUrls,
        videoUrls: formData.videoUrls,
        googleFormUrl: formData.googleFormUrl.trim() || null,
        status: formData.status,
        
        // Dynamic Metadata
        affiliation: formData.affiliation.trim() || null,
        approval: formData.approval.trim() || null,
        established: formData.established.trim() || null,
        campusSize: formData.campusSize.trim() || null,
        facilities: formData.facilities,
      };

      const url = collegeId ? `/api/colleges/${collegeId}` : '/api/colleges';
      const method = collegeId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to save college';

        try {
          const data = await response.json();

          // Handle validation errors from server
          if (data.details && Array.isArray(data.details)) {
            const serverErrors: ValidationError[] = data.details.map((err: any) => ({
              field: err.path?.[0] || 'unknown',
              message: err.message || 'Validation error'
            }));
            setValidationErrors(serverErrors);
          }

          errorMessage = data.message || data.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }

        setError(errorMessage);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      router.push('/admin/colleges');
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const getFieldError = (fieldName: string) => {
    return validationErrors.find(err => err.field === fieldName);
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/colleges">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Colleges
          </Button>
        </Link>
      </div>

      <Card>
        <CardBody>
          <h2 className="text-2xl font-bold mb-6">
            {collegeId ? 'Edit College' : 'Add New College'}
          </h2>

          {/* General Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">{error}</p>
                  {validationErrors.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                      {validationErrors.map((err, idx) => (
                        <li key={idx}>• {err.message}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                Basic Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Input
                    label="College Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="St. Mary's College of Nursing"
                    error={getFieldError('name')?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, courses: [] })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all shadow-sm"
                    required
                  >
                    <option value="Nursing">Nursing</option>
                    <option value="Physiotherapy">Physiotherapy</option>
                    <option value="Abroad">Abroad Education</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="Kochi, Kerala"
                    error={getFieldError('location')?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Admission Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all shadow-sm"
                    required
                  >
                    <option value="open">Admissions Open</option>
                    <option value="closing_soon">Closing Soon</option>
                    <option value="closed">Admissions Closed</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This badge will be displayed on the college card
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all shadow-sm"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <Input
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                  placeholder="Brief description for listing page"
                  error={getFieldError('shortDescription')?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  About (Full Description) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={8}
                  className={`w-full bg-white dark:bg-gray-800 border ${getFieldError('about') ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all shadow-sm resize-y`}
                  required
                  placeholder="Detailed information about the college..."
                />
                {getFieldError('about') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('about')?.message}</p>
                )}
              </div>
            </div>

            {/* Courses Offered */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                    Courses Offered
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-4">
                    Select all courses offered by this college <span className="text-red-500">*</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCourseModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-[#001b4d] text-xs font-bold rounded-xl text-[#001b4d] hover:bg-[#001b4d] hover:text-white transition-all shadow-sm"
                >
                  + Add New Course Program
                </button>
              </div>

              {getFieldError('courses') && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-sm text-red-800 block">{getFieldError('courses')?.message}</span>
                </div>
              )}

              {loadingCourses ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#001b4d]"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading courses...</span>
                </div>
              ) : dbCourses.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl bg-white dark:bg-gray-800">
                  <p className="text-sm text-gray-500">No courses programs found in database.</p>
                  <p className="text-xs text-gray-400 mt-1">Click the button above to add the first course program!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {dbCourses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => toggleCourse(course.title)}
                      className={`
                        p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                        ${formData.courses.includes(course.title)
                          ? 'border-[#001b4d] bg-[#001b4d]/5 font-semibold text-[#001b4d]'
                          : 'border-gray-200 dark:border-gray-700 hover:border-[#001b4d]/50 bg-white dark:bg-gray-800'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(course.title)}
                          onChange={() => toggleCourse(course.title)}
                          className="h-4 w-4 text-[#001b4d] focus:ring-[#001b4d] border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer block">
                            {course.title}
                          </label>
                          <span className="text-xs text-gray-400 font-medium">Duration: {course.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Courses Display */}
              {formData.courses.length > 0 && (
                <div className="mt-5 p-4 bg-[#001b4d]/5 dark:bg-[#001b4d]/20 border border-[#001b4d]/10 rounded-xl">
                  <p className="text-xs text-[#001b4d] dark:text-blue-300 font-bold uppercase tracking-wider mb-2">
                    Selected Courses ({formData.courses.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.courses.map((course) => (
                      <span
                        key={course}
                        className="inline-flex items-center px-3.5 py-1.5 bg-[#001b4d] text-white rounded-full text-xs font-bold shadow-sm"
                      >
                        {course}
                        <button
                          type="button"
                          onClick={() => toggleCourse(course)}
                          className="ml-2 hover:text-[#d9a441] transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Images */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                Images
              </h3>

              {/* Thumbnail */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image (Main Image)
                </label>

                {formData.thumbnailUrl ? (
                  <div className="relative w-full max-w-md h-64 rounded-2xl overflow-hidden shadow-md border border-gray-200">
                    <Image
                      src={formData.thumbnailUrl}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#001b4d]/50 rounded-2xl p-6 text-center transition-all bg-white dark:bg-gray-800 shadow-sm group">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#001b4d] mb-2 transition-colors" />
                    <label className="cursor-pointer">
                      <span className="text-[#001b4d] hover:underline font-bold text-sm">
                        Click to upload thumbnail
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1 font-medium">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gallery Images (Max 5)
                </label>

                {formData.galleryUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {formData.galleryUrls.map((url: string, index: number) => (
                      <div key={index} className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm border border-gray-200">
                        <Image
                          src={url}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 z-10 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.galleryUrls.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#001b4d]/50 rounded-2xl p-6 text-center transition-all bg-white dark:bg-gray-800 shadow-sm group">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#001b4d] mb-2 transition-colors" />
                    <label className="cursor-pointer">
                      <span className="text-[#001b4d] hover:underline font-bold text-sm">
                        Click to upload gallery images
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1 font-medium">
                      {formData.galleryUrls.length}/5 images • PNG, JPG up to 5MB each
                    </p>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-4 p-4 bg-[#001b4d]/5 border border-[#001b4d]/20 rounded-xl">
                  <p className="text-[#001b4d] text-sm font-semibold flex items-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#001b4d] mr-2"></span>
                    Uploading images...
                  </p>
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                Campus Videos (Optional)
              </h3>

              {/* Video Preview Grid */}
              {formData.videoUrls.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-[#001b4d] dark:text-blue-300 font-bold uppercase tracking-wider mb-3">
                    Uploaded Videos ({formData.videoUrls.length}/5):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.videoUrls.map((url: string, index: number) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 bg-gray-900">
                        <div className="relative aspect-video">
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            preload="metadata"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <svg className="h-12 w-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate p-2 bg-white dark:bg-gray-800 font-semibold border-t">
                          Video {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Videos */}
              {formData.videoUrls.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[#001b4d]/50 rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-sm group">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 group-hover:text-[#001b4d] mb-3 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <label className="cursor-pointer">
                      <span className="text-[#001b4d] hover:underline font-bold text-sm">
                        {uploadingVideos ? 'Uploading...' : 'Click to upload videos'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        multiple
                        onChange={handleVideoUpload}
                        disabled={uploadingVideos || formData.videoUrls.length >= 5}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                      MP4, WebM, OGG, MOV up to 100MB per video
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.videoUrls.length}/5 videos • {5 - formData.videoUrls.length} remaining
                    </p>
                  </div>

                  {uploadingVideos && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#001b4d] h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2 font-semibold">
                        Uploading videos... Please wait
                      </p>
                    </div>
                  )}
                </div>
              )}

              {formData.videoUrls.length >= 5 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-semibold">
                  Maximum 5 videos reached. Remove a video to upload more.
                </p>
              )}
            </div>

            {/* College Metadata Details */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
              <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                College Specifications & Metadata
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-4 -mt-4 mb-4">
                Provide academic metadata, key affiliations, approvals, and physical campus specifications.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Affiliation"
                  value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  placeholder="e.g. Rajiv Gandhi University of Health Sciences (RGUHS)"
                />

                <Input
                  label="Approval / Recognition"
                  value={formData.approval}
                  onChange={(e) => setFormData({ ...formData, approval: e.target.value })}
                  placeholder="e.g. INC, KNC, Government of Karnataka"
                />

                <Input
                  label="Established Year"
                  value={formData.established}
                  onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                  placeholder="e.g. 2003"
                />

                <Input
                  label="Campus Size"
                  value={formData.campusSize}
                  onChange={(e) => setFormData({ ...formData, campusSize: e.target.value })}
                  placeholder="e.g. 10 Acres"
                />
              </div>

              {/* Campus Facilities Selectors */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
                <h4 className="text-sm font-bold mb-3 text-[#001b4d] dark:text-gray-300">Campus Facilities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AVAILABLE_FACILITIES.map((facility) => {
                    const isSelected = formData.facilities.includes(facility);
                    return (
                      <div
                        key={facility}
                        onClick={() => toggleFacility(facility)}
                        className={`
                          p-3 border rounded-xl cursor-pointer text-xs font-semibold flex items-center space-x-2 transition-all
                          ${isSelected
                            ? 'border-[#001b4d] bg-[#001b4d]/5 text-[#001b4d]'
                            : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-800'
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFacility(facility)}
                          className="h-3.5 w-3.5 text-[#001b4d] focus:ring-[#001b4d] border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span>{facility}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Fee Structure */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                Fee Specifications
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 pl-4 -mt-2 mb-4">
                Define the total program fees individually for each selected course.
              </p>

              {formData.courses.length === 0 ? (
                <div className="p-4 text-center border rounded-xl text-xs text-gray-500 bg-white dark:bg-gray-800">
                  Select one or more courses above to configure their total fee structures.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.courses.map((course) => (
                    <div key={course} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                      <Input
                        label={`Total Course Fee: ${course} (₹)`}
                        type="number"
                        value={formData.courseFees[course] || ''}
                        onChange={(e) => handleCourseFeeChange(course, e.target.value)}
                        required
                        placeholder="e.g. 350000"
                        error={getFieldError(`fee-${course}`)?.message}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="text-sm font-bold mb-4 text-[#001b4d] dark:text-gray-300">General Annual Fees (Optional)</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Hostel Fee (Annual)"
                    type="number"
                    value={formData.hostel}
                    onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                    placeholder="45000"
                  />

                  <Input
                    label="Other Fees (Annual)"
                    type="number"
                    value={formData.other}
                    onChange={(e) => setFormData({ ...formData, other: e.target.value })}
                    placeholder="15000"
                  />
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-gray-50/50 dark:bg-gray-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              <h3 className="text-lg font-bold text-[#001b4d] dark:text-white flex items-center mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
                Additional Settings
              </h3>
              <div className="space-y-4">
                <Input
                  label="Google Form URL (Optional)"
                  type="url"
                  value={formData.googleFormUrl}
                  onChange={(e) => setFormData({ ...formData, googleFormUrl: e.target.value })}
                  placeholder="https://forms.gle/..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-2">
                  Leave empty if you don't have an application form yet
                </p>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="h-4 w-4 text-[#001b4d] focus:ring-[#001b4d] border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Mark as Featured College
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" disabled={loading || uploading} className="flex-1 bg-[#001b4d] hover:bg-[#003399] text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-sm flex justify-center items-center">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {collegeId ? 'Update College' : 'Create College'}
                  </>
                )}
              </Button>
              <Link href="/admin/colleges" className="flex-1">
                <Button type="button" className="w-full border-2 border-gray-200 hover:border-[#001b4d] text-gray-700 hover:text-[#001b4d] font-bold py-3.5 rounded-xl transition-all text-sm flex justify-center items-center bg-white">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Inline Course Creation Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200 my-8">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-bold text-[#001b4d] dark:text-white mb-2 flex items-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d9a441] mr-2"></span>
              Add New Course Program
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Create a new course program structure. It will instantly become selectable for all colleges.
            </p>

            {courseError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center text-xs text-red-800">
                <AlertCircle className="h-4 w-4 mr-2 text-red-600 flex-shrink-0" />
                <span>{courseError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCourseInline} className="space-y-4">
              <Input
                label="Course Title *"
                value={newCourseData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  const slugVal = val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                  setNewCourseData({ ...newCourseData, title: val, slug: slugVal });
                }}
                required
                placeholder="e.g. BSc Nursing"
              />

              <Input
                label="Slug *"
                value={newCourseData.slug}
                onChange={(e) => setNewCourseData({ ...newCourseData, slug: e.target.value.toLowerCase().trim() })}
                required
                placeholder="e.g. bsc-nursing"
              />

              <Input
                label="Duration *"
                value={newCourseData.duration}
                onChange={(e) => setNewCourseData({ ...newCourseData, duration: e.target.value })}
                required
                placeholder="e.g. 4 Years"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newCourseData.description}
                  onChange={(e) => setNewCourseData({ ...newCourseData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all shadow-sm resize-y"
                  placeholder="Provide a brief description of the course..."
                />
              </div>

              <Input
                label="Key Highlights (Comma-separated)"
                value={newCourseData.bullets}
                onChange={(e) => setNewCourseData({ ...newCourseData, bullets: e.target.value })}
                placeholder="e.g. Clinical Training, Theory & Practicals, Hospital Internships"
              />

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Program Icon
                </label>
                <select
                  value={newCourseData.icon}
                  onChange={(e) => setNewCourseData({ ...newCourseData, icon: e.target.value })}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#001b4d] focus:border-transparent transition-all shadow-sm"
                >
                  <option value="GraduationCap">Graduation Cap</option>
                  <option value="Stethoscope">Stethoscope</option>
                  <option value="BriefcaseMedical">Briefcase Medical</option>
                  <option value="BookOpen">Book Open</option>
                  <option value="Globe2">Globe</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button
                  type="submit"
                  disabled={creatingCourse}
                  className="flex-1 bg-[#001b4d] hover:bg-[#003399] text-white font-bold py-2.5 rounded-xl shadow-md transition-all text-xs flex justify-center items-center"
                >
                  {creatingCourse ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Course'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl transition-all text-xs flex justify-center items-center bg-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}