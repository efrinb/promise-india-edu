'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function MobileCTA() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-3 animate-fade-in">
            <div className="flex gap-2">
                <Link href="/contact?type=consultation&source=mobile_cta" className="flex-1">
                    <Button variant="danger" className="w-full">
                        Get Free Consultation
                    </Button>
                </Link>
                <a href="tel:+919876543210">
                    <Button variant="primary" className="px-4">
                        <Phone className="h-5 w-5" />
                    </Button>
                </a>
            </div>
        </div>
    );
}