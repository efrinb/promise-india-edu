'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImagePreviewProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ImagePreview({ src, alt, className }: ImagePreviewProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Thumbnail */}
            <div
                className={`cursor-pointer ${className}`}
                onClick={() => setOpen(true)}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative max-w-5xl w-full max-h-[90vh]">
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute -top-12 right-0 text-white hover:text-accent transition-colors"
                        >
                            <X className="h-8 w-8" />
                        </button>

                        <div className="relative w-full h-[80vh]">
                            <Image
                                src={src}
                                alt={alt}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
