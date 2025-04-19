import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "./globals.css";
import Header from '../../components/Header';
import { getMessages } from 'next-intl/server';
import type { Messages } from 'next-intl';
import { Metadata } from 'next';

export const dynamicParams = true;

export const metadata: Metadata = {
  title: {
    template: '%s | Sahara AI',
    default: 'Sahara AI - Discord Guide',
  },
  description: 'Sahara AI Discord Server: Server Guide and User Manual',
  icons: {
    icon: '/favicon.ico',
  },
};

// Определяем какие локали поддерживаем в генерации статических путей
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// @ts-expect-error - игнорируем ошибку типизации для Layout, так как Next.js ожидает специальный тип
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  
  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await getMessages({
    locale,
  })) as Messages;

  return (
    <html lang={locale}>
      <body className={`px-4 text-primary bg-[url('/fon.png')] bg-top bg-cover flex mx-auto max-w-7xl flex-col min-h-screen`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}