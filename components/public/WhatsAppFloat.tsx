'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatProps {
    whatsappUrl: string | null;
}

export function WhatsAppFloat({ whatsappUrl }: WhatsAppFloatProps) {
    if (!whatsappUrl) return null;

    return (
        <a href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 mb-10 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with us
            </span>
        </a>
    );
}