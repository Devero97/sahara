'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import CodeExample from '@/components/CodeExample';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { ExternalLink, HelpCircle, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CheckpointData, CheckpointPopoverContent } from './CheckpointPopover';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MusicBotChatSimulation from './simulations/MusicBotChatSimulation';

// Обновляем интерфейс данных для одного модуля
interface ModuleContentData {
  id: string; // ID модуля (m1, m2, ...)
  // Переименовываем ключи для ясности и соответствия плану
  titleKey: string;
  descriptionKey: string;
  additionalTextKey?: string;
  imageUrl?: string; // Оставляем возможность для URL
  imageAltKey?: string;
  tipsKeys?: string[]; // Массив ключей для советов
  codeExample?: {
    code: string;
    language?: string;
    descriptionKey?: string;
  };
  simulationType?: 'musicBotChat'; // Типы симуляций
  isCompletion?: boolean; // Добавляем флаг завершения
}

// Обновленный интерфейс пропсов для GuideContent
interface GuideContentProps {
  currentModuleId: string; // Используем ID модуля
  completedCheckpoints: Set<string>;
  checkpoints: CheckpointData[]; // Массив всех доступных чекпоинтов
  onCheckpointComplete: (checkpointId: string) => void;
  onModulePrev: () => void;
  onModuleNext: () => void;
  isFirstModule: boolean;
  isLastModule: boolean;
}

// НОВЫЕ ДАННЫЕ КОНТЕНТА МОДУЛЕЙ (13 модулей)
const modulesContentData: ModuleContentData[] = [
  // --- Категория: Введение ---
  { // m1: Первые Шаги
    id: 'm1',
    titleKey: 'm1_title', // "Добро пожаловать в Sahara AI Discord!"
    descriptionKey: 'm1_desc', // "Добро пожаловать! Discord сервер..."
    additionalTextKey: 'm1_add_text', // "После присоединения... Visitor... General Member..."
    imageUrl: 'https://via.placeholder.com/600x300.png/8A2BE2/FFFFFF?text=Getting+Started',
    imageAltKey: 'm1_img_alt',
    tipsKeys: ['m1_tip1', 'm1_tip2', 'm1_tip3', 'm1_tip4'],
  },
  { // m2: Важные Каналы
    id: 'm2',
    titleKey: 'm2_title', // "Важные Информационные Каналы"
    descriptionKey: 'm2_desc', // "Чтобы эффективно пользоваться сервером..."
    additionalTextKey: 'm2_add_text', // "#announcements (10 OP!), #minor..., #community-bible, #scam-safety..."
    imageUrl: 'https://via.placeholder.com/600x300.png/3CB371/FFFFFF?text=Info+Channels',
    imageAltKey: 'm2_img_alt', // "Информационные каналы"
    tipsKeys: ['m2_tip1', 'm2_tip2', 'm2_tip3', 'm2_tip4'],
  },
  { // m3: Выбор Ролей
    id: 'm3',
    titleKey: 'm3_title', // "Выбор Дополнительных Ролей"
    descriptionKey: 'm3_desc', // "Получив роль General Member, зайди в #community-bible..."
    additionalTextKey: 'm3_add_text', // "Web3/AI, Twitter Degen, Gamer, Giveaways, Quizzes, Russian..."
    imageUrl: 'https://via.placeholder.com/600x300.png/6A5ACD/FFFFFF?text=Role+Selection',
    imageAltKey: 'm3_img_alt', // "Выбор ролей в Community Bible"
    tipsKeys: ['m3_tip1', 'm3_tip2', 'm3_tip3'], // Новые ключи для советов
  },
  // --- Категория: Прогресс ---
  { // m4: Система XP
    id: 'm4',
    titleKey: 'm4_title', // "Система Опыта (XP) и Роли"
    descriptionKey: 'm4_desc', // "XP нужен для получения ролей Бронзовая..."
    additionalTextKey: 'm4_add_text', // "Как заработать: Сообщения (15 XP/мин)... Как проверить: /rank..."
    imageUrl: 'https://via.placeholder.com/600x300.png/FFD700/000000?text=XP+System',
    imageAltKey: 'm4_img_alt', // "Система XP"
    tipsKeys: ['m4_tip1', 'm4_tip2', 'm4_tip3'],
  },
  { // m5: Oasis Points (OP)
    id: 'm5',
    titleKey: 'm5_title', // "Oasis Points (OP): Валюта Сервера"
    descriptionKey: 'm5_desc', // "Oasis Points (OP) – внутренняя валюта для покупки наград."
    additionalTextKey: 'm5_add_text', // "Как заработать: /claim daily, Twitter Рейды, Анонсы..."
    imageUrl: 'https://via.placeholder.com/600x300.png/FFA500/000000?text=Oasis+Points',
    imageAltKey: 'm5_img_alt', // "Oasis Points"
    tipsKeys: ['m5_tip1', 'm5_tip2', 'm5_tip3', 'm5_tip4'],
  },
  { // m6: Магазин и Команды
    id: 'm6',
    titleKey: 'm6_title', // "Магазин (#op-shop) и Полезные Команды"
    descriptionKey: 'm6_desc', // "Заработанные OP можно потратить в магазине #op-shop..."
    codeExample: {
      code: "# Полезные команды в #op-commands\n/rank           # Узнать свой XP и уровень\n/leaderboard    # Посмотреть баланс OP и рейтинг\n/claim daily    # Забрать ежедневные 100 OP\n/set twitter [X_username] # Привязать Twitter",
      language: 'bash',
      descriptionKey: 'm6_code_desc'
    },
    imageUrl: 'https://via.placeholder.com/600x300.png/DA70D6/FFFFFF?text=OP+Shop+%26+Commands',
    imageAltKey: 'm6_img_alt',
    tipsKeys: ['m6_tip1', 'm6_tip2', 'm6_tip3'],
  },
  // --- Категория: Активности ---
  { // m7: Мероприятия
    id: 'm7',
    titleKey: 'm7_title', // "Мероприятия: Ивенты, AMA, Музыка"
    descriptionKey: 'm7_desc', // "Сервер Sahara AI живет благодаря активным участникам! Участвуй в мероприятиях..."
    additionalTextKey: 'm7_add_text', // "#events-announcements, #events-schedule, #Oasis Stage, #Music and Chill..."
    imageUrl: 'https://via.placeholder.com/600x300.png/FF69B4/FFFFFF?text=Events',
    imageAltKey: 'm7_img_alt',
    tipsKeys: ['m7_tip1', 'm7_tip2', 'm7_tip3'],
  },
  { // m8: Контент и Творчество
    id: 'm8',
    titleKey: 'm8_title', // "Создание Контента и Творчество"
    descriptionKey: 'm8_desc', // "Делись своим творчеством с сообществом!"
    additionalTextKey: 'm8_add_text', // "#community-tweets, #meme, #artist-content, #generative-prompts..."
    imageUrl: 'https://via.placeholder.com/600x300.png/20B2AA/FFFFFF?text=Content+Creation',
    imageAltKey: 'm8_img_alt',
    tipsKeys: ['m8_tip1', 'm8_tip2', 'm8_tip3'],
  },
  { // m9: Общение
    id: 'm9',
    titleKey: 'm9_title', // "Каналы для Общения"
    descriptionKey: 'm9_desc', // "Общение - ключ к получению XP и интеграции."
    additionalTextKey: 'm9_add_text', // "#general (англ.), #russian (и другие)..."
    simulationType: 'musicBotChat', // Пример: Заменяем на симуляцию чата #general?
    tipsKeys: ['m9_tip1', 'm9_tip2', 'm9_tip3'],
  },
  { // m10: Доступ к Тестнету (WL)
    id: 'm10',
    titleKey: 'm10_title', // "Как Получить Доступ к Тестнету (WL)"
    descriptionKey: 'm10_desc', // "Участие в закрытом тестнете..."
    additionalTextKey: 'm10_add_text', // "Способы: AMA-сессии, Контент, Региональные Конкурсы..."
    imageUrl: 'https://via.placeholder.com/600x300.png/4682B4/FFFFFF?text=Testnet+WL',
    imageAltKey: 'm10_img_alt',
    tipsKeys: ['m10_tip1', 'm10_tip2', 'm10_tip3'],
  },
  // --- Категория: Информация ---
  { // m11: Помощь и Поддержка
    id: 'm11',
    titleKey: 'm11_title', // "Помощь, Поддержка и Безопасность"
    descriptionKey: 'm11_desc', // "Если возникли проблемы..."
    additionalTextKey: 'm11_add_text', // "#open-a-ticket, #report-scams-and-spams, #scam-safety..."
    tipsKeys: ['m11_tip1', 'm11_tip2'],
  },
  { // m12: Источники Новостей
    id: 'm12',
    titleKey: 'm12_title', // "Источники Новостей"
    descriptionKey: 'm12_desc', // "Где следить за официальными новостями и новостями от сообщества."
    additionalTextKey: 'm12_add_text', // "#ai-web3-news (официальные), #web3-ai-news-finds (сообщество)..."
    tipsKeys: ['m12_tip1', 'm12_tip2'],
  },
  { // m13: Обзор Структуры (Итоги)
    id: 'm13',
    titleKey: 'm13_title', // "Итоги: Обзор Структуры Сервера"
    descriptionKey: 'm13_desc', // Краткий обзор всех категорий и каналов
    isCompletion: true, // Флаг завершения
  }
];

// Анимация смены контента модуля (простой fade)
const moduleVariants: Variants = {
  initial: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

function GuideContentComponent({ 
  currentModuleId, 
  completedCheckpoints,
  checkpoints,
  onCheckpointComplete,
  onModulePrev,
  onModuleNext,
  isFirstModule,
  isLastModule
}: GuideContentProps) {
  // Используем один неймспейс для всего контента гайда
  const t = useTranslations('GuideContent'); 
  const tCheckpoints = useTranslations('Checkpoints'); // Для статуса чекпоинтов
  
  const currentModuleData = modulesContentData.find(mod => mod.id === currentModuleId);
  const currentCheckpoint = checkpoints.find(cp => cp.moduleId === currentModuleId);
  const isCurrentCheckpointCompleted = currentCheckpoint ? completedCheckpoints.has(currentCheckpoint.id) : false;

  // Получаем переведенные строки, если данные модуля найдены
  const moduleTitle = currentModuleData ? t(currentModuleData.titleKey) : '';
  const moduleDescription = currentModuleData ? t(currentModuleData.descriptionKey) : '';
  const moduleAdditionalText = currentModuleData?.additionalTextKey ? t(currentModuleData.additionalTextKey) : '';
  const moduleImageAlt = currentModuleData?.imageAltKey ? t(currentModuleData.imageAltKey) : 'Изображение модуля';
  const moduleTips = currentModuleData?.tipsKeys?.map(key => t(key)) ?? [];
  const codeDescription = currentModuleData?.codeExample?.descriptionKey ? t(currentModuleData.codeExample.descriptionKey) : undefined;

  // Логика для фона (можно оставить или сделать проще, т.к. модулей 7)
  const backgroundClasses = [
    //... (можно оставить 5 или добавить еще 2)
      "bg-gradient-to-br from-sky-900/50 to-indigo-900/50",
      "bg-gradient-to-br from-emerald-900/50 to-teal-900/50",
      "bg-gradient-to-br from-rose-900/50 to-fuchsia-900/50",
      "bg-gradient-to-br from-amber-900/50 to-orange-900/50",
      "bg-gradient-to-br from-violet-900/50 to-purple-900/50",
      "bg-gradient-to-br from-cyan-900/50 to-blue-900/50", 
      "bg-gradient-to-br from-lime-900/50 to-green-900/50",
  ];
  const moduleIndex = parseInt(currentModuleId.substring(1), 10) - 1; 
  const dynamicBackgroundClass = "bg-[rgb(var(--color-dark-card))]";

  // Компонент кнопки-иконки для квиза
  const QuizTriggerButton = () => {
    if (!currentCheckpoint) return null;

    const triggerText = isCurrentCheckpointCompleted ? "Проверка пройдена" : "Начать проверку";
    const TriggerIcon = isCurrentCheckpointCompleted ? CheckCircle : HelpCircle;

    return (
      <Popover>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                {/* Оборачиваем кнопку в motion.div для анимации */}
                <motion.div
                   whileHover={{ scale: 1.15 }}
                   transition={{ type: "spring", stiffness: 400, damping: 17 }} // Упругая анимация
                   className="inline-block align-middle ml-2" // Для корректного позиционирования
                 >
                  <Button 
                    variant="outline" // Оставляем outline для видимости рамки
                    size="icon" 
                    className={cn(
                      // Убрали ml-2, h-7, w-7 отсюда, задаем через motion.div и size
                      "p-1 h-7 w-7 rounded-full", // Убрали transition-none
                      isCurrentCheckpointCompleted 
                        ? "border-green-500/50 text-green-500 hover:bg-green-500/10"
                        : "border-blue-500/50 text-blue-500 hover:bg-blue-500/10"
                    )}
                  >
                    <TriggerIcon className="h-4 w-4" />
                  </Button>
                 </motion.div>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent side="top">
              <p>{triggerText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {!isCurrentCheckpointCompleted && (
          <PopoverContent side="top" align="center" className="p-0 bg-background border-border w-auto">
            <CheckpointPopoverContent 
              checkpoint={currentCheckpoint} 
              onComplete={() => onCheckpointComplete(currentCheckpoint.id)} 
            />
          </PopoverContent>
        )}
      </Popover>
    );
  }

  // Компонент для отображения статуса всех чекпоинтов
  const CheckpointStatusList = () => (
      <div className="w-full max-w-md text-left border-t border-[rgb(var(--color-separator))] pt-8 mt-10">
          <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 text-center">
              {t('checkpoint_status_title')} 
          </h3>
          <ul className="space-y-3">
              {checkpoints.map((checkpoint) => {
                  const isCompleted = completedCheckpoints.has(checkpoint.id);
                  // Получаем заголовок модуля, к которому относится чекпоинт
                  const moduleTitleForCp = modulesContentData.find(m => m.id === checkpoint.moduleId);
                  const titleText = moduleTitleForCp ? t(moduleTitleForCp.titleKey) : `Модуль ${checkpoint.moduleId}`;
                  const StatusIcon = isCompleted ? CheckCircle : HelpCircle;

                  return (
                      <li 
                          key={checkpoint.id} 
                          className={cn(
                              "flex items-center justify-between p-3 rounded-lg",
                              isCompleted ? "bg-green-500/10" : "bg-gray-500/10"
                          )}
                      >
                          <span className="text-[rgb(var(--color-text-secondary))]">
                              {titleText}
                          </span>
                          <StatusIcon 
                              className={cn(
                                  "h-5 w-5",
                                  isCompleted ? "text-green-500" : "text-gray-400"
                              )}
                          />
                      </li>
                  );
              })}
          </ul>
      </div>
  );

  return (
    <div className={cn(
      "flex-1 h-full rounded-3xl flex flex-col shadow-lg relative transition-all duration-300",
      dynamicBackgroundClass
    )}>
      <div className="flex-grow overflow-y-auto p-8">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentModuleId} 
            variants={moduleVariants}
            initial="initial"
            animate="visible"
            exit="exit"
            className={`max-w-4xl mx-auto ${currentModuleData?.isCompletion ? 'flex flex-col items-center justify-center text-center' : ''}`}
          >
            {/* Рендер контента модуля */} 
            {currentModuleData && (
              <>
                {/* === Сообщение о завершении === */} 
                {currentModuleData.isCompletion && (
                    <div className="text-6xl mb-6">🎉</div>
                )}

                <h1 className={`text-3xl font-bold text-[rgb(var(--color-text-primary))] ${currentModuleData.isCompletion ? 'mb-6' : 'mb-4'}`}> {/* Больший отступ для заголовка завершения */} 
                  {moduleTitle}
                  {/* Кнопка квиза после заголовка, если больше ничего нет */} 
                  {!moduleDescription && !currentModuleData.simulationType && !currentModuleData.imageUrl && !moduleAdditionalText && !currentModuleData.codeExample && <QuizTriggerButton />}
                </h1>
                
                {moduleDescription && (
                   <p className={`text-[rgb(var(--color-text-secondary))] mb-8 ${currentModuleData.isCompletion ? 'max-w-2xl' : 'whitespace-pre-line'}`}> {/* Разный стиль для описания */} 
                     {moduleDescription} {/* Используем whitespace-pre-line для сохранения переносов из JSON */} 
                   </p>
                )}
                
                {/* Добавляем сюда сообщение о завершении после описания */} 
                {currentModuleData.isCompletion && (
                  <p className="text-lg font-semibold text-green-400 mt-6 mb-8">
                    {t('completion_message')} {/* Новый ключ */} 
                  </p>
                )}
                
                {/* Условный рендеринг Симуляции или Статики */} 
                {currentModuleData.simulationType === 'musicBotChat' ? (
                  <MusicBotChatSimulation />
                ) : (
                  <>
                    {currentModuleData.imageUrl && (
                      <img 
                        src={currentModuleData.imageUrl} 
                        alt={moduleImageAlt} 
                        className="rounded-lg my-6 w-full max-w-2xl mx-auto shadow-md object-cover"
                      />
                    )}
                    {moduleAdditionalText && (
                      <p className="text-[rgb(var(--color-text-secondary))] mb-8 mt-6">
                        {moduleAdditionalText}
                        {!currentModuleData.codeExample && <QuizTriggerButton />} 
                      </p>
                    )}
                  </>
                )}
                
                {/* Пример Кода */} 
                {currentModuleData.codeExample && (
                  <div className="relative mb-8">
                    <CodeExample
                      code={currentModuleData.codeExample.code}
                      language={currentModuleData.codeExample.language}
                      description={codeDescription}
                    />
                    <div className="absolute top-2 right-2 z-10">
                       <QuizTriggerButton /> 
                    </div>
                  </div>
                )}
                
                {/* Кнопка квиза после симуляции, если нет кода */} 
                {currentModuleData.simulationType && !currentModuleData.codeExample && (
                    <div className="mb-8 text-right -mt-4">
                       <QuizTriggerButton /> 
                    </div>
                )}

                {/* Статус Чекпоинтов (Только для модуля 13 - Итоги) */} 
                {currentModuleId === 'm13' && <CheckpointStatusList />} 

                {/* Советы (Tips) */} 
                {moduleTips.length > 0 && (
                  <div className="bg-[rgb(var(--color-dark-base))] p-4 rounded-lg mt-8 mb-8">
                    <h3 className="text-[rgb(var(--color-text-primary))] font-semibold mb-2">
                      {t('tips_title')} 
                    </h3>
                    <ul className="list-disc list-inside text-[rgb(var(--color-text-secondary))]">
                      {moduleTips.map((tip, index) => (
                        <li key={index} className="mb-1">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )} 
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Блок навигации */} 
      {/* Не показываем кнопки, если это последний модуль (m13) */}
      {currentModuleId !== 'm13' && (
        <div className="mt-auto p-8 pt-4 flex justify-between items-center">
          <Button 
            variant="secondary" 
            onClick={onModulePrev} 
            disabled={isFirstModule}
            aria-label={t('prev_module_button')}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('back_button')} 
          </Button>
          <Button 
            onClick={onModuleNext} 
            disabled={isLastModule} // isLastModule теперь будет true для m13, но кнопки все равно скроются
            aria-label={t('next_module_button')}
          >
            {t('next_button')} 
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

const GuideContent = React.memo(GuideContentComponent);
export default GuideContent; 