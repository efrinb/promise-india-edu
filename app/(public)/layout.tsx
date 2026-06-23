import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { AnnouncementBar } from '@/components/public/AnnouncementBar';
import { WhatsAppFloat } from '@/components/public/WhatsAppFloat';
import { prisma } from '@/lib/db';

async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    return settings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {settings && (
        <AnnouncementBar
          text={settings.announcementText || ''}
          enabled={settings.announcementEnabled}
        />
      )}
      <Header phone={settings?.phone} />
      <main className="flex-grow bg-background dark:bg-gray-900">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat whatsappUrl={settings?.whatsappUrl || null} />
    </div>
  );
}