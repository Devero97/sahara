import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import "./globals.css";
import Header from '../../components/Header';
import { Toaster } from '@/components/ui/sonner';
import { getMessages } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Ensure that the incoming `locale` is valid
  if (!hasLocale(routing.locales, params.locale)) {
    notFound();
  }
 
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={params.locale}>
      <body className={`text-primary bg-[url('/fon.png')] bg-top   bg-cover flex mx-auto max-w-7xl flex-col min-h-screen`}>
           <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Header />          
          {children}
          <Toaster position="bottom-right" richColors />
          </NextIntlClientProvider>
      </body>
    </html>
  );
}