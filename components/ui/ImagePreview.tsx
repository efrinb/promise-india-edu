'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewProps {
    src: string;
    alt: string;
    className?: string;
    images?: string[];
    currentIndex?: number;
}

export default function ImagePreview({
    src,
    alt,
    className,
    images,
    currentIndex = 0,
}: ImagePreviewProps) {
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(currentIndex);

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images && activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (images && activeIndex < images.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setOpen(false);
        } else if (e.key === 'ArrowLeft') {
            if (images && activeIndex > 0) {
                setActiveIndex(activeIndex - 1);
            }
        } else if (e.key === 'ArrowRight') {
            if (images && activeIndex < images.length - 1) {
                setActiveIndex(activeIndex + 1);
            }
        }
    };

    useEffect(() => {
        if (open) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [open, activeIndex]);

    const displaySrc = images && images[activeIndex] ? images[activeIndex] : src;

    return (
        <>
            {/* Thumbnail */}
            <div
                className={`cursor-pointer relative ${className}`}
                onClick={() => {
                    setActiveIndex(currentIndex);
                    setOpen(true);
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded text-sm font-medium transition-opacity">
                        Click to View
                    </span>
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setOpen(false)}
                >
                    <div className="relative max-w-7xl w-full max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-accent transition-colors z-10"
                            aria-label="Close"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        {/* Navigation Buttons */}
                        {images && images.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevious}
                                    disabled={activeIndex === 0}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={activeIndex === images.length - 1}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        {images && images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm z-10">
                                {activeIndex + 1} / {images.length}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="relative w-full h-[85vh]">
                            <Image
                                src={displaySrc}
                                alt={`${alt} - Image ${activeIndex + 1}`}
                                fill
                                sizes="100vw"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}