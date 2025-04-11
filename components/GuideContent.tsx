'use client';

import React, { useState, useEffect, useRef, Dispatch, SetStateAction, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CooldownButton } from '@/components/ui/CooldownButton';
import { Progress } from '@/components/ui/progress';
import CodeExample from '@/components/CodeExample';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  completedMilestones: Set<string>;
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

// Скопируем данные о наградах сюда для определения backgroundClass
// В идеале, получать их из пропсов или общего файла
const MILESTONE_REWARDS_COPY: Record<string, { backgroundClass: string }> = {
  'section-1-complete': { backgroundClass: 'bg-gradient-to-br from-yellow-900/20 via-yellow-800/10 to-yellow-900/20 border border-yellow-700/30' },
  'section-2-complete': { backgroundClass: 'bg-gradient-to-br from-slate-600/20 via-slate-500/10 to-slate-600/20 border border-slate-500/30' },
};

function GuideContentComponent({ 
  currentStep, 
  onStepChange, 
  onStepAnimationComplete,
  isNextOnCooldown,
  animationDirection,
  completedMilestones
}: GuideContentProps) {
  const tGuide = useTranslations('GuideContent');
  const tSteps = useTranslations('GuideContent.steps');
  const tWelcome = useTranslations('WelcomeStep');
  
  const totalVisibleSteps = LAST_VISIBLE_PROGRESS_STEP;

  const handleNext = useCallback(() => {
    console.log("Attempting to go next from step:", currentStep);
    const currentStepIndex = stepsData.findIndex(step => step.id === currentStep);
    if (currentStepIndex === -1) return;

    const nextStepIndex = currentStepIndex + 1;
    const nextStepExists = nextStepIndex < stepsData.length;

    if (nextStepExists) {
      const nextStepId = stepsData[nextStepIndex].id;
      console.log("Proceeding to next step:", nextStepId);
      onStepChange(nextStepId);
    } else {
      console.log("Already at the last step or no next step exists.");
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

  // Определяем последний завершенный этап для стилизации фона
  const getLastCompletedMilestoneId = (): string | null => {
    const milestonesArray = Array.from(completedMilestones);
    if (milestonesArray.length === 0) return null;
    // Сортируем по ID награды (предполагаем, что ID отражают порядок)
    // Это упрощенный вариант, возможно, понадобится другая логика сортировки
    milestonesArray.sort(); 
    return milestonesArray[milestonesArray.length - 1];
  };

  const lastMilestoneId = getLastCompletedMilestoneId();
  const backgroundRewardClass = lastMilestoneId ? MILESTONE_REWARDS_COPY[lastMilestoneId]?.backgroundClass : '';
  const defaultBackgroundClass = "bg-[rgb(var(--color-dark-card))]";

  // --- Обработка приветственного шага --- 
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

  // --- Рендеринг для остальных шагов --- 
  // (handleNext, handlePrevious, handleStartGuide, handleReturnToGuide, isGuideStep, isCompletionStep, etc.)
  // ... (вся остальная логика компонента остается здесь)

  return (
    // Основной контейнер для шагов 1-5 (с наградами)
    <div className={cn(
      "flex-1 h-full rounded-3xl p-8 flex flex-col relative transition-all duration-300",
      backgroundRewardClass || defaultBackgroundClass
    )}>
      {/* Индикатор шага */} 
      {isGuideStep && (
        <div className="absolute top-4 right-4 bg-[rgb(var(--color-dark-base))] py-2 px-4 rounded-full"
          style={{ zIndex: 10 }}
        >
          <span className="text-[rgb(var(--color-text-secondary))] text-sm font-medium">
            {tGuide('stepLabel', { currentStep: currentStep, totalSteps: totalVisibleSteps })}
          </span>
        </div>
      )}

      {/* Основной контент шага (1-5) */} 
      <div className={`flex-grow mt-4 ${isCompletionStep ? '' : ''}`}>
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
            {/* Условный рендеринг контента шага 1-4 */} 
            {isGuideStep && (
              <>
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">{stepTitle}</h1>
                <p className="text-[rgb(var(--color-text-secondary))] mb-8">{stepDescription}</p>
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
                        <li key={index} className="mb-1">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )} 
            {/* Условный рендеринг контента шага 5 (завершение) */} 
            {isCompletionStep && (
              <>
                <div className="mb-6 text-4xl">🎉</div>
                <h1 className="text-3xl font-bold text-[rgb(var(--color-text-primary))] mb-4">{stepTitle}</h1>
                <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-8 max-w-xl">{stepDescription}</p>
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {/* Социальные кнопки */} 
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

      {/* Навигация (скрыта на последнем шаге) */} 
      <motion.div
        className="flex justify-between mt-auto max-w-4xl mx-auto w-full"
        variants={navAndProgressVariants}
        animate={isCompletionStep ? 'hidden' : 'visible'} // Скрываем на последнем шаге
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
              <CooldownButton
                size="lg"
                variant="default"
                onClick={handleNext}
                disabled={(currentStep === '1' ? false : undefined)}
                isOnCooldown={isNextOnCooldown && currentStep !== '1'}
                cooldownDuration={COOLDOWN_DURATION}
              >
                {tGuide('nextButton')}
              </CooldownButton>
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