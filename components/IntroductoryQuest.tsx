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

// Определим шаги квеста (пока без переводов для простоты)
const introSteps = [
  {
    id: 1,
    title: "Добро пожаловать!",
    description: "Привет! Я Bitsy, гид по сообществу Sahara AI. Если ты новичок, я покажу, как получить полный доступ к серверу. А если уже освоился — жми «Пропустить» и изучай продвинутые возможности!",
    isWelcome: true, // Добавляем флаг, что это первый приветственный шаг
  },
  {
    id: 2,
    title: "Шаг 1: Пройди верификацию",
    description: "Зайди в канал #verify на сервере.\nНажми кнопку Verify → прочитай правила → Continue → пройди капчу (выбери нужные цифры).",
    isVerification: true, // Добавляем флаг для шага верификации
  },
  {
    id: 3,
    title: "Шаг 2: Ты получил роль Visitor!",
    description: "Теперь ты Visitor! Эта роль дает доступ к базовым каналам. Чтобы стать General Member, покажи, что ты активный и живой участник. Дальше — инструкции!",
    isVisitor: true, // Добавляем флаг для шага с Visitor
  },
  {
    id: 4,
    title: "Шаг 3: Выбери роли в #role-picker",
    description: "Перейди в канал #role-picker и выбери интересующие тебя роли. Это откроет доступ к специализированным каналам и повысит шанс быть замеченным модераторами.",
    isRolePicker: true, // Добавляем флаг для шага выбора ролей
  },
  {
    id: 5,
    title: "Шаг 4: Прояви активность в #visitor-general",
    description: "Пиши в каналах для Visitor, общайся с модераторами, делись контентом. Это поможет тебе получить роль General Member быстрее.",
    isActivity: true, // Добавляем флаг для шага активности
  },
  {
    id: 6,
    title: "Шаг 5: Участвуй в ивентах в канале #Oasis Stage",
    description: "Посещай событий сообщества, слушай спикеров, задавай вопросы. Это отличная возможность быстро получить роль General Member.",
    isEvent: true, // Добавляем флаг для шага с ивентами
  },
  {
    id: 7,
    title: "Ты готов!",
    description: "Поздравляю! Теперь ты знаешь все секреты. Если ты выполнил все шаги — модераторы уже заметили твою активность. Осталось дождаться роли General Member. Добро пожаловать в коммьюнити!",
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

  const handleSkipTutorial = () => {
    // Сразу пропускаем весь вводный курс и разблокируем полный гайд
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex-1 h-[calc(100dvh-120px)] flex flex-col items-center justify-center  p-8"
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
              <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))] mb-4">{currentStepData.title}</h1>
              
              {/* Форматированная инструкция для шага верификации */}
              {currentStepData.isVerification ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">Как пройти верификацию:</h2>
                  <ol className="space-y-5">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          Зайди в канал <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#verify-yourself</span> на сервере
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          Нажми кнопку <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">✅ Verify</span>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">3</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          Прочитай правила и нажми <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">Continue</span>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">4</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          Пройди капчу (выбери нужные цифры)
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>
              ) : currentStepData.isVisitor ? (
                <div className="text-center mb-8">
                  <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                    Теперь ты <span className="font-bold text-blue-400">Visitor</span>! Эта роль дает доступ к базовым каналам. Чтобы стать <span className="font-bold text-pink-400">General Member</span>, покажи, что ты активный и живой участник. Дальше — инструкции!
                  </p>
                  
                  {/* Блок с важной информацией */}
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 mt-6 rounded-lg text-left">
                    <p className="text-blue-200 font-medium">Важно:</p>
                    <p className="text-blue-100/90 mt-1">
                      Без роли <span className="font-bold text-pink-400">General Member</span> ты не сможешь участвовать во всех активностях и стать полноценным членом сообщества!
                    </p>
                  </div>
                </div>
              ) : currentStepData.isRolePicker ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">Инструкция:</h2>
                  <ol className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          Перейди в канал <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#role-picker</span>
                        </p>
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <div>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          Нажми на кнопки, которые доступны в канале, чтобы выбрать роли
                        </p>
                      </div>
                    </li>
                  </ol>
                  
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 rounded-lg mb-4">
                    <h3 className="text-blue-200 font-medium mb-2">Зачем это нужно:</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li className="text-blue-100/90">
                        Открывают больше возможностей для вашей активности и доступ к специализированным каналам (например, <span className="italic">#art-forge</span> для художников)
                      </li>
                      <li className="text-blue-100/90">
                        Повышают шанс быть замеченным модераторами
                      </li>
                    </ul>
                  </div>
                </div>
              ) : currentStepData.isActivity ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">Что делать:</h2>
                  <ol className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Пиши в <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#visitor-general</span> на английском, тегай модераторов и общайся с ними
                      </p>
                    </li>
                    
                    <div className="ml-8 mt-1">
                      <ul className="list-disc list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                        <li>Задавай вопросы о проекте</li>
                        <li>Участвуй в обсуждениях</li>
                      </ul>
                    </div>
                    
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Размещай контент в креативных каналах
                      </p>
                    </li>
                    
                    <div className="ml-8 mt-1">
                      <ul className="list-disc list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                        <li>Мемы в <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#memes-share</span> 🐦</li>
                        <li>Фан-арты в <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#sahara-fan-arts</span> 🎨</li>
                        <li>Свои проекты в <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#i-made-this</span> ✨</li>
                      </ul>
                    </div>
                  </ol>
                  
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 rounded-lg mb-4">
                    <h3 className="text-blue-200 font-medium mb-2">Совет:</h3>
                    <p className="text-blue-100/90">
                      Не спамь! Качественный контент увеличивает шансы на одобрение.
                    </p>
                  </div>
                </div>
              ) : currentStepData.isEvent ? (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-medium text-[rgb(var(--color-text-primary))] mb-3">Инструкция:</h2>
                  
                  <ol className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">1</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Следи за анонсами в <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#events-schedule</span>
                      </p>
                    </li>
                    
                    <li className="flex items-center">
                      <div className="bg-emerald-800/30 p-1 rounded-full mr-3">
                        <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400">2</span>
                      </div>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Заходи в <span className="bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#Oasis Stage</span> во время ивента
                      </p>
                    </li>
                    
                    <div className="ml-8 mt-1">
                      <ul className="list-disc list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                        <li>Общайся и отвечай на вопросы в чате</li>
                        <li>Поднимайся на трибуну (если разрешают ведущие)</li>
                      </ul>
                    </div>
                  </ol>
                  
                  <div className="bg-blue-950/30 border border-blue-600/30 p-4 rounded-lg mb-4">
                    <h3 className="text-blue-200 font-medium mb-2">Лайфхак:</h3>
                    <p className="text-blue-100/90">
                      Модераторы часто раздают роли General Member прямо во время ивентов!
                    </p>
                  </div>
                </div>
              ) : currentStepData.isFinal ? (
                <div className="text-center mb-8">
                  <Image
                    src="/bitsy/bitsy-success.svg"
                    alt="Лисёнок Bitsy держит табличку 'General Member Unlocked!'"
                    width={200}
                    height={200}
                    className="mb-6 mx-auto"
                  />
                  <p className="text-[rgb(var(--color-text-secondary))] mb-8 whitespace-pre-line">{currentStepData.description}</p>
                </div>
              ) : (
                <p className="text-[rgb(var(--color-text-secondary))] mb-8 whitespace-pre-line">{currentStepData.description}</p>
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
                aria-label="Пропустить вводный курс"
              >
                Пропустить вводный курс <SkipForward className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 mx-2 cursor-pointer"
                aria-label="Начать"
              >
                Начать <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            // Навигация для остальных шагов
            <>
              <Button 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentStepIndex === 0}
                aria-label="Предыдущий шаг"
                className={cn(currentStepIndex === 0 && 'opacity-0 pointer-events-none', "cursor-pointer")}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Назад
              </Button>

              <div className="text-xs text-[rgb(var(--color-text-muted))]">
                Шаг {currentStepIndex + 1} из {introSteps.length}
              </div>

              {currentStepData.isFinal ? (
                <Button onClick={handleComplete} aria-label="Открыть полный гайд" className="cursor-pointer">
                  Открыть полный гайд 📖
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext} aria-label="Следующий шаг" className="cursor-pointer">
                  Далее
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