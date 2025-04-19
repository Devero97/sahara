import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Создаем middleware на основе конфигурации маршрутизации
export const middleware = createMiddleware({
  // Используем существующую конфигурацию из routing
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
  // Унифицируем pathnames с конфигурацией в routing.ts
  pathnames: routing.pathnames
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};