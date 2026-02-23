'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        }, 5000); // Auto-advance every 5 seconds

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

    if (loading || banners.length === 0) return null;

    const currentBanner = banners[currentIndex];

    const widthClasses = {
        full: 'max-w-full',
        large: 'max-w-[90%]',
        medium: 'max-w-[75%]',
        small: 'max-w-[60%]',
    };

    const BannerContent = () => (
        <div className="relative w-full">
            <div className={`mx-auto ${widthClasses[currentBanner.width as keyof typeof widthClasses]}`}>
                <div className="relative aspect-[16/6] rounded-xl overflow-hidden group">
                    <Image
                        src={currentBanner.imageUrl}
                        alt={currentBanner.name}
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* Message Overlay */}
                    {currentBanner.message && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                            <div
                                className="p-8 text-white prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: currentBanner.message }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <section className="relative bg-background dark:bg-gray-900 py-8">
            <div className="container-custom">
                {/* Carousel */}
                <div className="relative">
                    {currentBanner.link ? (
                        <Link href={currentBanner.link} target="_blank" rel="noopener noreferrer">
                            <BannerContent />
                        </Link>
                    ) : (
                        <BannerContent />
                    )}

                    {/* Navigation Arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all z-10"
                                aria-label="Previous banner"
                            >
                                <ChevronLeft className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all z-10"
                                aria-label="Next banner"
                            >
                                <ChevronRight className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                            </button>
                        </>
                    )}

                    {/* Dots Indicator */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                            ? 'bg-white w-8'
                                            : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    aria-label={`Go to banner ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}