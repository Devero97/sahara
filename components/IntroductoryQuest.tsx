'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Rocket, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface IntroductoryQuestProps {
  onComplete: () => void; // Функция для вызова при завершении квеста
}

// Определим шаги квеста с ключами локализации
const introSteps = [
  {
    id: 1,
    titleKey: "welcome_title",
    descriptionKey: "welcome_description",
    isWelcome: true, // Добавляем флаг, что это первый приветственный шаг
  },
  {
    id: 2,
    titleKey: "step1_title",
    descriptionKey: "step1_description",
    isVerification: true, // Добавляем флаг для шага верификации
  },
  {
    id: 3,
    titleKey: "step2_title",
    descriptionKey: "step2_description",
    isVisitor: true, // Добавляем флаг для шага с Visitor
  },
  {
    id: 4,
    titleKey: "step3_title",
    descriptionKey: "step3_description",
    isRolePicker: true, // Добавляем флаг для шага выбора ролей
  },
  {
    id: 5,
    titleKey: "step4_title",
    descriptionKey: "step4_description",
    isActivity: true, // Добавляем флаг для шага активности
  },
  {
    id: 6,
    titleKey: "step5_title",
    descriptionKey: "step5_description",
    isEvent: true, // Добавляем флаг для шага с ивентами
  },
  {
    id: 7,
    titleKey: "final_title",
    descriptionKey: "final_description",
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
    x: direction > 0 ? '-100%' : '100%', 
    opacity: 0, 
    transition: { duration: 0.2 } 
  }),
};

export default function IntroductoryQuest({ onComplete }: IntroductoryQuestProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const t = useTranslations('IntroductoryQuest'); // Добавляем хук для локализации

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

  const handleSkipTutorial = () => {
    // Сразу пропускаем весь вводный курс и разблокируем полный гайд
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 mt-24 flex flex-col items-center justify-center  p-8"
    >
      <div className="bg-[rgb(var(--color-dark-card))]/80 p-12 rounded-xl shadow-lg max-w-2xl w-full text-center relative overflow-hidden">
        {/* Контейнер с фиксированной высотой для контента */}
        <div className="h-[500px] relative overflow-hidden mb-8">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentStepData.id}
              custom={direction}
              variants={stepVariants}
              initial="initial"
              animate="visible"
              exit="exit"
              className="absolute inset-0 overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgb(63 63 70) transparent'
              }}
            >
              {/* Содержимое шага */}
              {currentStepData.isWelcome && (
                <Image
                  src="/bitsy.png"
                  alt="Лисёнок Bitsy"
                  width={200}
                  height={150}
                  className="mb-6 mx-auto"
                  priority
                />
              )}
              {!currentStepData.isFinal && (
                <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-4">{t(currentStepData.titleKey)}</h1>
              )}
              
              {/* Форматированная инструкция для шага верификации */}
              {currentStepData.isVerification ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">{t('step1_how_to')}</h2>
                  <ol className="space-y-5">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('step1_go_to_channel')}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('step1_click_verify')}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">3</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('step1_read_rules')}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">4</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('step1_captcha')}
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              ) : currentStepData.isVisitor ? (
                <div className="text-center mb-8">
                  <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                    {t('step2_visitor_info')}
                  </p>
                  
                  {/* Блок с важной информацией */}
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 mt-6 rounded-lg text-left">
                    <p className="text-blue-200 font-medium">{t('step2_important')}</p>
                    <p className="text-blue-100/90 mt-1">
                      {t('step2_important_text')}
                    </p>
                  </div>
                </div>
              ) : currentStepData.isRolePicker ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">{t('step3_instruction')}</h2>
                  <ol className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('step3_go_to_channel')}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('step3_click_buttons')}
                        </p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 rounded-lg mb-4">
                    <h3 className="text-blue-200 font-medium mb-2">{t('step3_why_needed')}</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li className="text-blue-100/90">
                        {t('step3_why_needed_1')}
                      </li>
                      <li className="text-blue-100/90">
                        {t('step3_why_needed_2')}
                      </li>
                    </ul>
                  </div>
                </div>
              ) : currentStepData.isActivity ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">{t('step4_what_to_do')}</h2>
                  <ol className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        {t('step4_write_in_channel')}
                      </p>
                    </li>
                    
                    <div className="ml-8 mt-1">
                      <ul className="list-disc list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                        <li>{t('step4_ask_questions')}</li>
                        <li>{t('step4_participate')}</li>
                      </ul>
                    </div>
                    
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        {t('step4_post_content')}
                      </p>
                    </li>
                    
                    <div className="ml-8 mt-1">
                      <ul className="list-disc list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                        <li>{t('step4_memes')}</li>
                        <li>{t('step4_fanarts')}</li>
                        <li>{t('step4_projects')}</li>
                      </ul>
                    </div>
                  </ol>
                  
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 rounded-lg mb-4">
                    <h3 className="text-blue-200 font-medium mb-2">{t('step4_tip')}</h3>
                    <p className="text-blue-100/90">
                      {t('step4_no_spam')}
                    </p>
                  </div>
                </div>
              ) : currentStepData.isEvent ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">{t('step3_instruction')}</h2>
                  
                  <ol className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        {t('step5_follow_announcements')}
                      </p>
                    </li>
                    
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        {t('step5_join_channel')}
                      </p>
                    </li>
                    
                    <div className="ml-8 mt-1">
                      <ul className="list-disc list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                        <li>{t('step5_chat')}</li>
                        <li>{t('step5_stage')}</li>
                      </ul>
                    </div>
                  </ol>
                  
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 rounded-lg mb-4">
                    <h3 className="text-blue-200 font-medium mb-2">{t('step5_lifehack')}</h3>
                    <p className="text-blue-100/90">
                      {t('step5_lifehack_text')}
                    </p>
                  </div>
                </div>
              ) : currentStepData.isFinal ? (
                <div className="text-center mb-8">
                  <Image
                    src="/introBitsy.png"
                    alt="Лисёнок Bitsy"
                    width={200}
                    height={200}
                    className="mb-6 mx-auto"
                  />
                  <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-4">{t(currentStepData.titleKey)}</h1>
                  <p className="text-[rgb(var(--color-text-secondary))] mb-8 whitespace-pre-line">{t(currentStepData.descriptionKey)}</p>
                </div>
              ) : (
                <p className="text-[rgb(var(--color-text-secondary))] mb-8 whitespace-pre-line">{t(currentStepData.descriptionKey)}</p>
              )}
              
              {/* Скриншот для шага верификации */}
              {currentStepData.isVerification && (
                <div className="mb-8 border border-[rgb(var(--color-separator))] rounded-lg overflow-hidden shadow-md">
                  <div className="bg-zinc-800 p-6 flex items-center justify-center">
                    <Image
                      src="/verify.png"
                      alt="Процесс верификации на сервере Discord"
                      width={500}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                </div>
              )}
              
              {/* Скриншот для шага с ролью Visitor */}
              {currentStepData.isVisitor && (
                <div className="mb-8 border border-[rgb(var(--color-separator))] rounded-lg overflow-hidden shadow-md">
                  <div className="bg-zinc-800 p-6 flex items-center justify-center">
                    <Image
                      src="/visitor.png"
                      alt="Роль Visitor в Discord"
                      width={300}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                </div>
              )}
              
              {/* Скриншот для шага выбора ролей */}
              {currentStepData.isRolePicker && (
                <div className="mb-8 border border-[rgb(var(--color-separator))] rounded-lg overflow-hidden shadow-md">
                  <div className="bg-zinc-800 p-6 flex items-center justify-center">
                  <Image
                      src="/role-picker.png"
                      alt="Роль Visitor в Discord"
                      width={500}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                </div>
              )}
              
              {/* Коллаж для шага активности */}
              {currentStepData.isActivity && (
                <div className="mb-8 border border-[rgb(var(--color-separator))] rounded-lg overflow-hidden shadow-md">
                  <div className="bg-zinc-800 p-6 flex items-center justify-center">
                  <Image
                      src="/visitor-general.png"
                      alt="Роль Visitor в Discord"
                      width={500}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                </div>
              )}
              
              {/* Скриншот для шага с событиями */}
              {currentStepData.isEvent && (
                <div className="mb-8 border border-[rgb(var(--color-separator))] rounded-lg overflow-hidden shadow-md">
                  <div className="bg-zinc-800 p-6 flex items-center justify-center">
                  <Image
                      src="/oasis-stage.png"
                      alt="Роль Visitor в Discord"
                      width={500}
                      height={300}
                      className="rounded-md"
                    />
                  </div>
                </div>
                
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Навигация - вынесена за пределы анимированного контента */}
        <div className="mt-2 flex justify-between items-center">
          {currentStepData.isWelcome ? (
            // Кнопки для приветственного шага
            <>
              <Button 
                variant="outline" 
                onClick={handleSkipTutorial} 
                className="flex-1 mx-2 cursor-pointer"
                aria-label={t('button_skip')}
              >
                {t('button_skip')} <SkipForward className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 mx-2 cursor-pointer"
                aria-label={t('button_start')}
              >
                {t('button_start')} <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            // Навигация для остальных шагов
            <>
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentStepIndex === 0}
                aria-label={t('button_back')}
                className={cn(currentStepIndex === 0 && 'opacity-0 pointer-events-none', "cursor-pointer")}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t('button_back')}
              </Button>

              <div className="text-xs text-[rgb(var(--color-text-muted))]">
                {t('step_counter', { current: currentStepIndex + 1, total: introSteps.length })}
              </div>

              {currentStepData.isFinal ? (
                <Button onClick={handleComplete} aria-label={t('button_open_guide')} className="cursor-pointer">
                  {t('button_open_guide')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext} aria-label={t('button_next')} className="cursor-pointer">
                  {t('button_next')}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
} 