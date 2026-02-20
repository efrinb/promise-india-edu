'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import type { Settings } from '@/types';

export function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch((err) => console.error('Failed to fetch settings:', err));
  }, []);

  return (
    <footer className="bg-primary dark:bg-gray-900 text-white dark:text-gray-100 transition-colors">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm leading-relaxed">
              Promise India Education Consultancy is your trusted partner for nursing college admissions,
              providing transparent guidance and personalized support to help you achieve your career goals.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/colleges" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                  Colleges
                </Link>
              </li>
              <li>
                <Link href="/abroad-education" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                  Abroad Education
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400 text-sm">
                  {settings?.adminEmail || 'info@promiseindia.com'}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400 text-sm">
                  {settings?.phone || '+91 9876543210'}
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 dark:text-gray-400 text-sm">
                  {settings?.address || 'Kochi, Kerala, India'}
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-3">
              {settings?.whatsappUrl && (

                <a href={settings.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 dark:bg-gray-700 p-3 rounded-full hover:bg-green-500 dark:hover:bg-green-600 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
              )}
              {settings?.facebookUrl && (

                <a href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 dark:bg-gray-700 p-3 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings?.instagramUrl && (

                <a href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 dark:bg-gray-700 p-3 rounded-full hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings?.twitterUrl && (

                <a href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 dark:bg-gray-700 p-3 rounded-full hover:bg-blue-400 dark:hover:bg-blue-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings?.linkedinUrl && (

                <a href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 dark:bg-gray-700 p-3 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )
              }
            </div >
          </div >
        </div >

        <div className="border-t border-white/20 dark:border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300 dark:text-gray-400 text-sm">
            © 2026 Promise India Education Consultancy. All Rights Reserved.
          </p>
        </div>
      </div >
    </footer >
  );
}