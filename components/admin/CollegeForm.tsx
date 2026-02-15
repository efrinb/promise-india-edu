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

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || 'Nursing',
    location: initialData?.location || '',
    shortDescription: initialData?.shortDescription || '',
    about: initialData?.about || '',
    courses: (initialData?.courses || []) as string[],
    tuition: initialData?.fees?.tuition || 0,
    hostel: initialData?.fees?.hostel || 0,
    other: initialData?.fees?.other || 0,
    total: initialData?.fees?.total || 0,
    featured: initialData?.featured || false,
    thumbnailUrl: initialData?.thumbnailUrl || '',
    galleryUrls: (initialData?.galleryUrls || []) as string[],
    googleFormUrl: initialData?.googleFormUrl || '',
    status: initialData?.status || 'draft',
  });

  // Auto-calculate total fees
  useEffect(() => {
    const total = Number(formData.tuition) + Number(formData.hostel) + Number(formData.other);
    setFormData(prev => ({ ...prev, total }));
  }, [formData.tuition, formData.hostel, formData.other]);

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

    // Nursing courses validation
    if (formData.category === 'Nursing' && formData.courses.length === 0) {
      errors.push({ field: 'courses', message: 'Please select at least one nursing course' });
    }

    // Fee validation
    if (Number(formData.tuition) <= 0) {
      errors.push({ field: 'tuition', message: 'Tuition fee must be greater than 0' });
    }

    if (Number(formData.hostel) <= 0) {
      errors.push({ field: 'hostel', message: 'Hostel fee must be greater than 0' });
    }

    if (Number(formData.other) < 0) {
      errors.push({ field: 'other', message: 'Other fees cannot be negative' });
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
          tuition: Number(formData.tuition),
          hostel: Number(formData.hostel),
          other: Number(formData.other),
          total: Number(formData.total),
        },
        featured: formData.featured,
        thumbnailUrl: formData.thumbnailUrl || null,
        galleryUrls: formData.galleryUrls,
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="Nursing">Nursing</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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

            {/* Courses Offered - Only show for Nursing category */}
            {formData.category === 'Nursing' && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Courses Offered</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select all nursing courses offered by this college <span className="text-red-500">*</span>
                </p>

                {getFieldError('courses') && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm text-red-800 block">{getFieldError('courses')?.message}</span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-3">
                  {NURSING_COURSES.map((course) => (
                    <div
                      key={course}
                      onClick={() => toggleCourse(course)}
                      className={`
                        p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${formData.courses.includes(course)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-primary/50'
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
                        <label className="text-sm font-medium text-gray-700 cursor-pointer">
                          {course}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                {formData.courses.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      Selected Courses ({formData.courses.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.courses.map((course) => (
                        <span
                          key={course}
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                        >
                          {course}
                          <button
                            type="button"
                            onClick={() => toggleCourse(course)}
                            className="ml-2 hover:text-blue-900"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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

            {/* Fee Structure */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Fee Structure (Annual)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Tuition Fee"
                  type="number"
                  value={formData.tuition}
                  onChange={(e) => setFormData({ ...formData, tuition: e.target.value })}
                  required
                  placeholder="85000"
                  error={getFieldError('tuition')?.message}
                />

                <Input
                  label="Hostel Fee"
                  type="number"
                  value={formData.hostel}
                  onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                  required
                  placeholder="45000"
                  error={getFieldError('hostel')?.message}
                />

                <Input
                  label="Other Fees"
                  type="number"
                  value={formData.other}
                  onChange={(e) => setFormData({ ...formData, other: e.target.value })}
                  required
                  placeholder="15000"
                  error={getFieldError('other')?.message}
                />

                <Input
                  label="Total Fee (Auto-calculated)"
                  type="number"
                  value={formData.total}
                  disabled
                  className="bg-gray-100"
                />
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
                <p className="text-xs text-gray-500 -mt-2">
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
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as Featured College
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" variant="primary" disabled={loading || uploading} className="flex-1">
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