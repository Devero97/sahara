import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Создаем базовый middleware
export const middleware = createMiddleware({
  ...routing,
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/en': '/en',
    '/ru': '/ru',
    '/*': '/*'
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.svg|pattern.png|body.svg|head.svg|hand1.svg|hand2.svg|foods.svg).*)"],
};