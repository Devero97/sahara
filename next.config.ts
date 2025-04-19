import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  // Добавляем конфигурацию TypeScript
  typescript: {
    // Запрет на фейловы сборки при ошибках типизации
    ignoreBuildErrors: true,
  },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);