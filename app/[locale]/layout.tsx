import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "./globals.css";
import Header from '../../components/Header';
import { Toaster } from '@/components/ui/sonner';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale}>
      <body className={`bg-background text-primary  bg-top bg-no-repeat flex mx-auto max-w-7xl flex-col `}>
           <NextIntlClientProvider>
          <Header />          
          {children}
          <Toaster position="bottom-left" richColors />
          </NextIntlClientProvider>
      </body>
    </html>
  );
}