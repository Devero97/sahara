"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { ChevronDown, Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as Locale;

  function onSelectChange(nextLocale: string) {
    router.replace(
      pathname,
      { locale: nextLocale as Locale }
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger 
        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors focus:outline-none cursor-pointer"
      >
        <Globe className="h-4 w-4" />
        {currentLocale === 'ru' ? 'Русский' : 'English'}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-background border-border/50 w-[100px]"
        align="end"
      >
        {routing.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => onSelectChange(locale)}
            className="text-foreground hover:text-primary hover:bg-muted focus:bg-muted focus:text-primary cursor-pointer"
          >
            {locale === 'ru' ? 'Русский' : 'English'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}