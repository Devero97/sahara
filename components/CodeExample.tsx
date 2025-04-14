'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";

interface CodeExampleProps {
  code: string;
  language?: string;
  description?: string;
  className?: string;
}

export default function CodeExample({ code, language = 'typescript', description, className }: CodeExampleProps) {
  const t = useTranslations('CodeExample');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("bg-[rgb(var(--color-dark-card))] rounded-lg overflow-hidden my-4", className)}
    >
      {description && (
        <div className="p-4 border-b border-[rgb(var(--color-dark-card-hover))]">
          <p className="text-[rgb(var(--color-text-secondary))]">{description}</p>
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'rgb(var(--color-dark-base))',
          }}
        >
          {code}
        </SyntaxHighlighter>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {isCopied ? t('copiedButton') : t('copyButton')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('copyTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
} 