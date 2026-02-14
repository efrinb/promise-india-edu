'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, GraduationCap, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/utils';
import type { College } from '@/types';

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    fetchColleges();
  }, [search, category, location]);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (location) params.set('location', location);

      const response = await fetch(`/api/colleges?${params.toString()}`);
      const data = await response.json();
      setColleges(data.colleges || []);
    } catch (error) {
      console.error('Failed to fetch colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Nursing Colleges</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect nursing institution that matches your career aspirations and educational goals.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search colleges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="Nursing">Nursing</option>
              <option value="Abroad">Abroad Education</option>
              <option value="Other">Other</option>
            </select>

            <Input
              type="text"
              placeholder="Filter by location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading colleges...</p>
          </div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No colleges found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colleges.map((college) => (
                <Card key={college.id}>
                  <div className="aspect-video bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <GraduationCap className="h-24 w-24 text-white/50" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{college.location}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{college.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{college.shortDescription}</p>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b">
                      <span className="text-sm text-gray-600">Annual Fee:</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency((college.fees as any).total)}
                      </span>
                    </div>
                    <Link href={`/colleges/${college.slug}`}>
                      <Button variant="primary" className="w-full">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center text-gray-600">
              Showing {colleges.length} college{colleges.length !== 1 ? 's' : ''}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
