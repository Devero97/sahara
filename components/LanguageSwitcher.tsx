"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { Check, Languages } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Более минималистичные языковые коды как на ethereum.org
const languageCodes = {
  en: "EN",
  ru: "RU"
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  // Используем state для хранения текущей локали
  const [currentLocale, setCurrentLocale] = useState<Locale>('en' as Locale);
  
  // Инициализируем currentLocale после рендеринга компонента
  useEffect(() => {
    if (params && params.locale) {
      setCurrentLocale(params.locale as Locale);
    }
  }, [params]);

  function onSelectChange(nextLocale: string) {
    router.replace(
      pathname,
      { locale: nextLocale as Locale }
    );
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger 
        className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors focus:outline-none cursor-pointer py-2"
      >
        <Languages className="w-5 h-5 mr-2" />
        <span className="uppercase">{languageCodes[currentLocale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="bg-background border border-zinc-200/10 shadow-lg rounded-lg p-1 min-w-[120px] mt-1"
        align="end"
      >
        {routing.locales.map((locale) => {
          const isActive = locale === currentLocale;
          return (
            <motion.div
              key={locale}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DropdownMenuItem
                onClick={() => onSelectChange(locale)}
                className={cn(
                  "flex items-center justify-between py-2 px-3 rounded text-sm cursor-pointer transition-colors",
                  isActive 
                    ? "text-foreground font-medium" 
                    : "text-foreground/70 hover:text-foreground hover:bg-zinc-100/5"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="uppercase">{languageCodes[locale as keyof typeof languageCodes]}</span>
                  <span className="text-foreground/60 text-xs capitalize">
                    {locale === 'ru' ? 'русский' : 'english'}
                  </span>
                </span>
                {isActive && <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
              </DropdownMenuItem>
            </motion.div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}