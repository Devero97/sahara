import { getTranslations } from 'next-intl/server';
import DiscordGuide from '@/components/DiscordGuide';

export default async function HomePage() {
  const t = await getTranslations('Index');

  return (
    <main className="">
      <DiscordGuide />
      
    </main>
  );
}