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

const NURSING_COURSES = [
  'GNM (General Nursing and Midwifery)',
  'BSc Nursing',
  'MSc Nursing',
  'Post Basic BSc Nursing',
  'ANM (Auxiliary Nurse Midwifery)',
  'Diploma in Nursing',
  'Certificate in Nursing',
];

const PHYSIOTHERAPY_COURSES = [
  'BPT (Bachelor of Physiotherapy)',
  'MPT (Master of Physiotherapy)',
  'Diploma in Physiotherapy',
  'Certificate in Physiotherapy',
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

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Nursing',
    location: initialData?.location || '',
    shortDescription: initialData?.shortDescription || '',
    about: initialData?.about || '',
    courses: (initialData?.courses || []) as string[],
    year1: initialData?.fees?.year1 || 0,
    year2: initialData?.fees?.year2 || 0,
    year3: initialData?.fees?.year3 || 0,
    year4: initialData?.fees?.year4 || 0,
    hostel: initialData?.fees?.hostel || 0,
    other: initialData?.fees?.other || 0,
    total: initialData?.fees?.total || 0,
    admissionStatus: initialData?.admissionStatus || 'open',
    featured: initialData?.featured || false,
    thumbnailUrl: initialData?.thumbnailUrl || '',
    galleryUrls: (initialData?.galleryUrls || []) as string[],
    videoUrls: (initialData?.videoUrls || []) as string[],  // NEW
    googleFormUrl: initialData?.googleFormUrl || '',
    status: initialData?.status || 'draft',
  });

  // Auto-calculate total fees
  useEffect(() => {
    const total =
      Number(formData.year1) +
      Number(formData.year2) +
      Number(formData.year3) +
      Number(formData.year4) +
      (Number(formData.hostel) || 0) +
      (Number(formData.other) || 0);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.year1, formData.year2, formData.year3, formData.year4, formData.hostel, formData.other]);

  const toggleCourse = (course: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(course)
        ? prev.courses.filter(c => c !== course)
        : [...prev.courses, course]
    }));
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
    if ((formData.category === 'Nursing' || formData.category === 'Physiotherapy') && formData.courses.length === 0) {
      errors.push({ field: 'courses', message: `Please select at least one ${formData.category.toLowerCase()} course` });
    }

    // Fee validation
    if (Number(formData.year1) <= 0) {
      errors.push({ field: 'year1', message: '1st year fee must be greater than 0' });
    }
    if (Number(formData.year2) <= 0) {
      errors.push({ field: 'year2', message: '2nd year fee must be greater than 0' });
    }
    if (Number(formData.year3) <= 0) {
      errors.push({ field: 'year3', message: '3rd year fee must be greater than 0' });
    }
    if (Number(formData.year4) <= 0) {
      errors.push({ field: 'year4', message: '4th year fee must be greater than 0' });
    }

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
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        location: formData.location.trim(),
        shortDescription: formData.shortDescription.trim(),
        about: formData.about.trim(),
        courses: formData.courses,
        fees: {
          year1: Number(formData.year1),
          year2: Number(formData.year2),
          year3: Number(formData.year3),
          year4: Number(formData.year4),
          hostel: Number(formData.hostel) || 0,
          other: Number(formData.other) || 0,
          total: Number(formData.total),
        },
        admissionStatus: formData.admissionStatus,
        featured: formData.featured,
        thumbnailUrl: formData.thumbnailUrl || null,
        galleryUrls: formData.galleryUrls,
        videoUrls: formData.videoUrls,  // NEW
        googleFormUrl: formData.googleFormUrl.trim() || null,
        status: formData.status,
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
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, courses: [] })}
                    className="input"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Admission Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                    className="input"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <Input
                  label="Short Description"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                  placeholder="Brief description for listing page"
                  error={getFieldError('shortDescription')?.message}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About (Full Description) <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={8}
                  className={`textarea ${getFieldError('about') ? 'border-red-500' : ''}`}
                  required
                  placeholder="Detailed information about the college..."
                />
                {getFieldError('about') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('about')?.message}</p>
                )}
              </div>
            </div>

            {/* Courses Offered - Show for Nursing or Physiotherapy */}
            {(formData.category === 'Nursing' || formData.category === 'Physiotherapy') && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Courses Offered</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select all {formData.category.toLowerCase()} courses offered by this college <span className="text-red-500">*</span>
                </p>

                {getFieldError('courses') && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm text-red-800 block">{getFieldError('courses')?.message}</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-3">
                  {(formData.category === 'Nursing' ? NURSING_COURSES : PHYSIOTHERAPY_COURSES).map((course) => (
                    <div
                      key={course}
                      onClick={() => toggleCourse(course)}
                      className={`
                        p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${formData.courses.includes(course)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.courses.includes(course)}
                          onChange={() => toggleCourse(course)}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                          {course}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Courses Display */}
                {formData.courses.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2">
                      Selected Courses ({formData.courses.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.courses.map((course) => (
                        <span
                          key={course}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium"
                        >
                          {course}
                          <button
                            type="button"
                            onClick={() => toggleCourse(course)}
                            className="ml-2 hover:text-blue-900 dark:hover:text-blue-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Images</h3>

              {/* Thumbnail */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thumbnail Image (Main Image)
                </label>

                {formData.thumbnailUrl ? (
                  <div className="relative w-full max-w-md h-64">
                    <Image
                      src={formData.thumbnailUrl}
                      alt="Thumbnail"
                      fill
                      className="rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-primary hover:text-primary-600">
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
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gallery Images (Max 5)
                </label>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {formData.galleryUrls.map((url: string, index: number) => (
                    <div key={index} className="relative w-full h-32">
                      <Image
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        fill
                        className="rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 z-10"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {formData.galleryUrls.length < 5 && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-primary hover:text-primary-600">
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
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.galleryUrls.length}/5 images • PNG, JPG up to 5MB each
                    </p>
                  </div>
                )}
              </div>

              {uploading && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800 mr-2"></div>
                    Uploading images...
                  </p>
                </div>
              )}
            </div>

            {/* Videos Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Campus Videos (Optional)</h3>

              {/* Video Preview Grid */}
              {formData.videoUrls.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Uploaded Videos ({formData.videoUrls.length}/5):
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.videoUrls.map((url: string, index: number) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
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
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                          Video {index + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Videos */}
              {formData.videoUrls.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <label className="cursor-pointer">
                      <span className="text-primary hover:text-primary-600 font-medium">
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
                    <p className="text-sm text-gray-500 mt-2">
                      MP4, WebM, OGG, MOV up to 100MB per video
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formData.videoUrls.length}/5 videos • {5 - formData.videoUrls.length} remaining
                    </p>
                  </div>

                  {uploadingVideos && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
                        Uploading videos... Please wait
                      </p>
                    </div>
                  )}
                </div>
              )}

              {formData.videoUrls.length >= 5 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                  Maximum 5 videos reached. Remove a video to upload more.
                </p>
              )}
            </div>

            {/* Fee Structure */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fee Structure (Annual)</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Input
                  label="1st Year Fee"
                  type="number"
                  value={formData.year1}
                  onChange={(e) => setFormData({ ...formData, year1: e.target.value })}
                  required
                  placeholder="85000"
                  error={getFieldError('year1')?.message}
                />

                <Input
                  label="2nd Year Fee"
                  type="number"
                  value={formData.year2}
                  onChange={(e) => setFormData({ ...formData, year2: e.target.value })}
                  required
                  placeholder="85000"
                  error={getFieldError('year2')?.message}
                />

                <Input
                  label="3rd Year Fee"
                  type="number"
                  value={formData.year3}
                  onChange={(e) => setFormData({ ...formData, year3: e.target.value })}
                  required
                  placeholder="85000"
                  error={getFieldError('year3')?.message}
                />

                <Input
                  label="4th Year Fee"
                  type="number"
                  value={formData.year4}
                  onChange={(e) => setFormData({ ...formData, year4: e.target.value })}
                  required
                  placeholder="85000"
                  error={getFieldError('year4')?.message}
                />
              </div>

              <div className="border-t pt-4 mb-4">
                <h4 className="text-md font-semibold mb-4 text-gray-700 dark:text-gray-300">Additional Fees (Optional)</h4>
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

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total Course Fee (4 Years)</span>
                  <span className="text-2xl font-bold text-primary dark:text-primary-400">
                    ₹{formData.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Auto-calculated based on all fee components
                </p>
              </div>
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Settings</h3>
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
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as Featured College
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" variant="danger" disabled={loading || uploading} className="flex-1">
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
              <Link href="/admin/colleges">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}