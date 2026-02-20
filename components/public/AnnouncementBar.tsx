'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
    text: string;
    enabled: boolean;
}

export function AnnouncementBar({ text, enabled }: AnnouncementBarProps) {
    const [visible, setVisible] = useState(false);
    const [animateOut, setAnimateOut] = useState(false);


    useEffect(() => {
        if (!enabled) {
            setVisible(false);
            return;
        }

        const dismissed = localStorage.getItem('announcement-dismissed');
        const dismissedTime = dismissed ? parseInt(dismissed) : 0;
        const dayInMs = 24 * 60 * 60 * 1000;

        if (Date.now() - dismissedTime > dayInMs) {
            setVisible(true);
        }
    }, [enabled]);

    const handleDismiss = () => {
        setAnimateOut(true);
        setVisible(false);
        localStorage.setItem('announcement-dismissed', Date.now().toString());
    };

    if (!visible || !enabled) return null;

    return (
        <div
            className={`
                bg-accent text-white py-2 px-4 text-center relative z-50
                ${animateOut ? 'announcement-exit' : 'announcement-enter'}
                `}
            style={{
                animation: animateOut
                    ? undefined
                    : 'slideDownFade 0.4s ease-out',
            }}
        >
            <div className="container-custom flex items-center justify-center overflow-hidden">
                {/* Animated Text */}
                <div className="announcement-marquee-wrapper">
                    <div className="announcement-marquee-text text-sm md:text-base font-medium">
                        {text} &nbsp;&nbsp;&nbsp; {text}
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition"
                    aria-label="Dismiss announcement"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}