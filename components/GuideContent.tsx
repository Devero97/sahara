'use client';

import React, { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import CodeExample from '@/components/CodeExample';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';

interface StepData {
  id: string;
  image?: string;
  hasTips?: boolean;
  codeExample?: {
    code: string;
    language?: string;
  };
}

interface GuideContentProps {
  currentStep: string;
  onStepChange: (stepId: string) => void;
  onStepAnimationComplete: (stepId: string) => void;
  isNextOnCooldown: boolean;
  animationDirection: number;
}

const stepsData: StepData[] = [
  {
    id: '1',
    hasTips: true,
    codeExample: {
      code: '// Пример настройки бота\nconst bot = new Discord.Client();\nbot.login(process.env.TOKEN);',
      language: 'typescript',
    }
  },
  {
    id: '2',
    hasTips: true,
  },
  {
    id: '3',
    hasTips: true,
    codeExample: {
      code: '// Пример настройки голосового канала\nconst voiceChannel = message.guild.channels.cache.find(\n  channel => channel.name === "Общий"\n);',
      language: 'typescript',
    }
  },
  {
    id: '4',
    hasTips: true,
    codeExample: {
      code: '// Пример команды для воспроизведения музыки\n!play https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      language: 'bash',
    }
  },
  { id: '5' }
];

const stepVariants: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 30 : -30
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -30 : 30,
    transition: { duration: 0.3 }
  })
};

// Варианты для анимации прогресс-бара и навигации
const navAndProgressVariants: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  },
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -30 : 30,
    transition: { duration: 0.3 }
  })
};

const COOLDOWN_DURATION = 1500;
const LAST_VISIBLE_PROGRESS_STEP = 5;
const LAST_GUIDE_STEP_ID = '5';

function GuideContentComponent({ 
  currentStep, 
  onStepChange, 
  onStepAnimationComplete,
  isNextOnCooldown,
  animationDirection
}: GuideContentProps) {
  const tGuide = useTranslations('GuideContent');
  const tSteps = useTranslations('GuideContent.steps');
  const tWelcome = useTranslations('WelcomeStep');

  const totalVisibleSteps = LAST_VISIBLE_PROGRESS_STEP;

  const handleNext = useCallback(() => {
    const currentIndex = stepsData.findIndex(step => step.id === currentStep);
    if (currentIndex >= 0 && currentIndex < stepsData.length - 1) {
      onStepChange(stepsData[currentIndex + 1].id);
    }
  }, [currentStep, stepsData, onStepChange]);

  const handlePrevious = () => {
    if (currentStep === '1') {
      onStepChange('0');
    } else if (currentStep !== '0') {
        const currentIndex = stepsData.findIndex(step => step.id === currentStep);
        if (currentIndex > 0) {
            onStepChange(stepsData[currentIndex - 1].id);
        }
    }
  };

  const handleStartGuide = () => {
    onStepChange('1');
  };

  const handleReturnToGuide = () => {
    onStepChange('1');
  };

  const isGuideStep = currentStep !== '0' && currentStep !== LAST_GUIDE_STEP_ID;
  const isCompletionStep = currentStep === LAST_GUIDE_STEP_ID;

  const currentStepStructure = stepsData.find(step => step.id === currentStep);
  const progress = isGuideStep ? (Number(currentStep) / totalVisibleSteps) * 100 : (isCompletionStep ? 100 : 0);
  const stepTitle = currentStep !== '0' ? tSteps(`${currentStep}.title`) : '';
  const stepDescription = currentStep !== '0' ? tSteps(`${currentStep}.description`) : '';
  const stepTips: string[] = currentStepStructure?.hasTips ? tSteps.raw(`${currentStep}.tips`) : [];
  const codeDescription = currentStepStructure?.codeExample ? tSteps(`${currentStep}.codeDescription`) : undefined;

  if (currentStep === '0') {
    return (
      <div className="flex-1 h-full rounded-3xl bg-[rgb(var(--color-dark-card))] p-8 flex flex-col items-center justify-center text-center">
        <div className="mb-6 text-4xl">🦊</div>
        
        <p className="text-xl text-foreground mb-8">
          {tWelcome('greeting')}
        </p>

        <Button size="lg" onClick={handleStartGuide}>
           {tWelcome('startButton')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full rounded-3xl bg-[rgb(var(--color-dark-card))] p-8 flex flex-col">
      {/* Оборачиваем прогресс-бар в motion.div и убираем условный рендер */}
      <motion.div
        className="mb-8 max-w-4xl mx-auto w-full"
        variants={navAndProgressVariants}
        animate={isCompletionStep ? 'hidden' : 'visible'}
        initial={false}
        custom={animationDirection}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[rgb(var(--color-text-secondary))] mr-auto">
            {/* Убираем isGuideStep && - анимация родителя скроет текст на последнем шаге */}
            {tGuide('stepLabel', { currentStep: currentStep, totalSteps: totalVisibleSteps })}
          </span>
        </div>
        <Progress value={progress} />
      </motion.div>

      {/* Убираем условный mb-8 отсюда, т.к. блок навигации всегда есть */}
      <div className={`flex-grow  ${isCompletionStep ? '' : ''}`}>
        <AnimatePresence mode="wait" custom={animationDirection}>
          <motion.div
            key={currentStep}
            custom={animationDirection}
            variants={stepVariants}
            initial="initial"
            animate="visible"
            exit="exit"
            className={`max-w-4xl mx-auto ${isCompletionStep ? 'flex flex-col items-center justify-center text-center' : ''}`}
            onAnimationComplete={() => onStepAnimationComplete(currentStep)}
          >
            {isGuideStep && (
              <>
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
                  {stepTitle}
                </h1>
                <p className="text-[rgb(var(--color-text-secondary))] mb-8">
                  {stepDescription}
                </p>
                {currentStepStructure?.codeExample && (
                  <CodeExample
                    code={currentStepStructure.codeExample.code}
                    language={currentStepStructure.codeExample.language}
                    description={codeDescription}
                  />
                )}

                {currentStepStructure?.hasTips && stepTips.length > 0 && (
                  <div className="bg-[rgb(var(--color-dark-base))] p-4 rounded-lg mb-8">
                    <h3 className="text-[rgb(var(--color-text-primary))] font-semibold mb-2">
                      {tGuide('tipsTitle')}
                    </h3>
                    <ul className="list-disc list-inside text-[rgb(var(--color-text-secondary))]">
                      {stepTips.map((tip, index) => (
                        <li key={index} className="mb-1">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {isCompletionStep && (
              <>
                <div className="mb-6 text-4xl">🎉</div>
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
                  {stepTitle}
                </h1>
                <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-8 max-w-xl">
                  {stepDescription}
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                   <Button variant="default" size="lg" asChild>
                    <a href="https://discord.gg/your-invite" target="_blank" rel="noopener noreferrer"> 
                      {tSteps('5.socialDiscord')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="default" size="lg" asChild>
                    <a href="https://your-website.com" target="_blank" rel="noopener noreferrer">
                      {tSteps('5.socialWebsite')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="default" size="lg" asChild>
                    <a href="https://twitter.com/your-twitter" target="_blank" rel="noopener noreferrer">
                      {tSteps('5.socialTwitter')}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <Button size="lg" variant="default" onClick={handleReturnToGuide}> 
                  {tSteps('5.returnButton')}
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Оборачиваем навигацию в motion.div и убираем условный рендер */}
      <motion.div
        className="flex justify-between mt-auto max-w-4xl mx-auto w-full"
        variants={navAndProgressVariants}
        animate={isCompletionStep ? 'hidden' : 'visible'}
        initial={false}
        custom={animationDirection}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                variant="secondary"
                className="bg-secondary hover:bg-secondary/80"
                onClick={handlePrevious}
                disabled={currentStep === '1'}
              >
                {tGuide('backButton')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tGuide('backTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                variant="default"
                onClick={handleNext}
                disabled={isNextOnCooldown}
                className="relative overflow-hidden"
              >
                <span className="relative z-10">{tGuide('nextButton')}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tGuide('nextTooltip')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </div>
  );
}

const GuideContent = React.memo(GuideContentComponent);
export default GuideContent; 