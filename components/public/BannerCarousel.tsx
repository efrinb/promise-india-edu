'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Banner {
    id: string;
    uniqueId: string;
    name: string;
    link: string | null;
    imageUrl: string;
    width: string;
    message: string | null;
    active: boolean;
    order: number;
}

export function BannerCarousel() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === banners.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const fetchBanners = async () => {
        try {
            const response = await fetch('/api/banners');
            const data = await response.json();
            if (response.ok) {
                setBanners(data.banners || []);
            }
        } catch (error) {
            console.error('Failed to fetch banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <section className="relative bg-gradient-to-br from-primary via-primary-600 to-secondary h-[500px] md:h-[600px]">
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            </section>
        );
    }

    // NO BANNERS - Show default hero section
    if (banners.length === 0) {
        return (
            <section className="relative bg-gradient-to-br from-primary via-primary-600 to-secondary py-20 md:py-32">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                                Your Trusted Partner for Nursing College Admissions
                            </h1>
                            <p className="text-xl md:text-2xl mb-8 text-gray-100">
                                Guiding students toward top accredited nursing institutions with transparent fees and personalized support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/colleges">
                                    <Button variant="secondary" size="lg">
                                        View Colleges
                                    </Button>
                                </Link>
                                <Link href="/contact?type=consultation&source=homepage">
                                    <Button variant="danger" size="lg">
                                        Get Free Consultation
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                                <GraduationCap className="h-64 w-64 text-white/80 mx-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const currentBanner = banners[currentIndex];

    // Banner section width classes
    const bannerWidthClasses = {
        full: 'w-full',
        container: 'container-custom',
        large: 'w-[90%] max-w-[1600px]',
        medium: 'w-[85%] max-w-[1400px]',
    };

    return (
        <section className="relative bg-background dark:bg-gray-900 py-8 md:py-12">
            <div className="flex justify-center">
                <div className={`${bannerWidthClasses[currentBanner.width as keyof typeof bannerWidthClasses]} mx-auto`}>
                    <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-xl shadow-2xl">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={currentBanner.imageUrl}
                                alt={currentBanner.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Dark overlay only if there's text or button */}
                            {(currentBanner.message || currentBanner.link) && (
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                            )}
                        </div>

                        {/* Content - Only show if message or link exists */}
                        {(currentBanner.message || currentBanner.link) && (
                            <div className="relative z-10 h-full flex items-center">
                                <div className="w-full px-6 md:px-12 lg:px-16">
                                    <div className="max-w-3xl">
                                        <div className="text-white">
                                            {/* Custom message from admin */}
                                            {currentBanner.message && (
                                                <div
                                                    className="banner-message-content mb-8"
                                                    dangerouslySetInnerHTML={{ __html: currentBanner.message }}
                                                />
                                            )}

                                            {/* Button - Only show if link provided */}
                                            {currentBanner.link && (
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <Link href={currentBanner.link}>
                                                        <Button variant="secondary" size="lg">
                                                            View College
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {banners.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all z-20"
                                    aria-label="Previous banner"
                                >
                                    <ChevronLeft className="h-6 w-6 text-white" />
                                </button>
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all z-20"
                                    aria-label="Next banner"
                                >
                                    <ChevronRight className="h-6 w-6 text-white" />
                                </button>
                            </>
                        )}

                        {/* Dots Indicator */}
                        {banners.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {banners.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`h-3 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/75 w-3'
                                            }`}
                                        aria-label={`Go to banner ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}