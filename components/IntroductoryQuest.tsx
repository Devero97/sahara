'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IntroductoryQuestProps {
  onComplete: () => void; // Функция для вызова при завершении квеста
}

// Определим шаги квеста (пока без переводов для простоты)
const introSteps = [
  {
    id: 1,
    title: "Добро пожаловать!",
    description: "Этот краткий квест расскажет, как получить полный доступ на нашем Discord-сервере. Это необходимо для участия во всех активностях.",
  },
  {
    id: 2,
    title: "Шаг 1: Прочитайте правила",
    description: "Перейдите в канал `#правила` на нашем Discord-сервере и внимательно прочитайте все пункты.",
    // TODO: Добавить изображение/скриншот?
  },
  {
    id: 3,
    title: "Шаг 2: Подтвердите ознакомление",
    description: "Под сообщением с правилами найдите и нажмите на реакцию ✅, чтобы подтвердить, что вы ознакомились с ними.",
    // TODO: Добавить изображение/скриншот?
  },
  {
    id: 4,
    title: "Завершение",
    description: "Отлично! Как только вы выполните эти действия в Discord, вы получите роль General Member и полный доступ к серверу. Нажмите кнопку ниже, чтобы разблокировать полный интерактивный гайд здесь, на сайте.",
    isFinal: true,
  },
];

const stepVariants = {
  initial: (direction: number) => ({ 
    x: direction > 0 ? '100%' : '-100%', 
    opacity: 0 
  }),
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 150, damping: 20 } 
  },
  exit: (direction: number) => ({ 
    x: direction < 0 ? '100%' : '-100%', 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }),
};

export default function IntroductoryQuest({ onComplete }: IntroductoryQuestProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  // TODO: Подключить переводы useTranslations

  const currentStepData = introSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < introSteps.length - 1) {
      setDirection(1);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleComplete = () => {
    onComplete(); // Вызываем колбэк для сохранения состояния и разблокировки гайда
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 h-[calc(100dvh-120px)] flex flex-col items-center justify-center bg-[rgb(var(--color-dark-base))] p-8"
    >
      <div className="bg-[rgb(var(--color-dark-card))] p-8 rounded-xl shadow-lg max-w-2xl w-full text-center relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode='wait'>
          <motion.div
            key={currentStepData.id}
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="visible"
            exit="exit"
            className=""
          >
            <Image
              src="/bitsy.svg"
              alt="Приветственный персонаж"
              width={150}
              height={150}
              className="mb-6 mx-auto"
              priority
            />
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-4">{currentStepData.title}</h1>
            <p className="text-[rgb(var(--color-text-secondary))] mb-8">{currentStepData.description}</p>
            {/* Можно добавить сюда изображения для шагов */}
          </motion.div>
        </AnimatePresence>

        {/* Навигация */}
        <div className="mt-8 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={handlePrev} 
            disabled={currentStepIndex === 0}
            aria-label="Предыдущий шаг"
            className={cn(currentStepIndex === 0 && 'opacity-0 pointer-events-none')} // Скрываем, если неактивна
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </Button>

          <div className="text-xs text-[rgb(var(--color-text-muted))]">
            Шаг {currentStepIndex + 1} из {introSteps.length}
          </div>

          {currentStepData.isFinal ? (
            <Button onClick={handleComplete} aria-label="Разблокировать полный гайд">
              Разблокировать полный гайд
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} aria-label="Следующий шаг">
              Далее
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
} 