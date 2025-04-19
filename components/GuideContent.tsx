'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import XpCalculator from './XpCalculator'; // ИСПРАВЛЕН РЕГИСТР НА XpCalculator

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
    imageUrl: '/welcome-banner.png', // Заменить на реальное изображение
    imageAltKey: 'm1_img_alt',
    tipsKeys: ['m1_tip1', 'm1_tip2', 'm1_tip3', 'm1_tip4'],
  },
  { // m2: Важные Каналы
    id: 'm2',
    titleKey: 'm2_title', // "Важные Информационные Каналы"
    descriptionKey: 'm2_desc', // "Чтобы эффективно пользоваться сервером..."
    imageUrl: '/channels-banner.png', // Заменить на реальное изображение
    imageAltKey: 'm2_img_alt', // "Информационные каналы"
  },
  { // m3: Выбор Ролей
    id: 'm3',
    titleKey: 'm3_title', // "Выбор Дополнительных Ролей"
    descriptionKey: 'm3_desc', // "Получив роль General Member, зайди в #community-bible..."
    imageUrl: '/roles-banner.png', // Заменить на реальное изображение
  },
  // --- Категория: Прогресс ---
  { // m4: Система XP - ОБНОВЛЕНО 
    id: 'm4',
    titleKey: 'm4_title', // "Система Опыта (XP) и Роли"
    descriptionKey: 'm4_desc', // "XP (Experience Points) — это ваша виртуальная «прокачка»..."
    // imageUrl, imageAltKey, additionalTextKey, tipsKeys удалены, так как контент рендерится напрямую
  },
  { // m5: Oasis Points (OP) - ОБНОВЛЕНО
    id: 'm5',
    titleKey: 'm5_title', // "Oasis Points (OP): Валюта Активности"
    descriptionKey: 'm5_desc', // "Oasis Points (OP) — это внутренняя валюта Sahara AI..."
    // imageUrl, imageAltKey, additionalTextKey, tipsKeys удалены
  },
  { // m6: Контент - ДОБАВЛЕНО
    id: 'm6',
    titleKey: 'm6_title', // "Контент: Роли и WL"
    descriptionKey: 'm6_desc', // "Создание контента — это не только способ проявить креативность..."
    // Остальные поля не нужны, рендерим напрямую
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
    titleKey: 'm13_title', // "Итоги"
    descriptionKey: 'm13_desc_final', // Новый ключ для финального текста
    isCompletion: true, // Помечаем как завершающий модуль
    // Остальные поля не нужны
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
  onModulePrev,
  onModuleNext,
  isFirstModule,
  isLastModule
}: GuideContentProps) {
  // Используем один неймспейс для всего контента гайда
  const t = useTranslations('GuideContent'); 
  
  const currentModuleData = modulesContentData.find(mod => mod.id === currentModuleId);

  // Получаем переведенные строки, если данные модуля найдены
  const moduleTitle = currentModuleData ? t(currentModuleData.titleKey) : '';
  const moduleDescription = currentModuleData ? t(currentModuleData.descriptionKey) : '';

  // Функция для форматирования названий каналов в тексте
  const formatChannelNames = (text: string): React.ReactNode => {
    // Регулярное выражение для поиска названий каналов в тексте (#имя-канала)
    const channelRegex = /#[\w-чатßéóíúá]+/g;
    
    // Разбиваем текст на части по найденным названиям каналов
    const parts = text.split(channelRegex);
    const channels = text.match(channelRegex) || [];
    
    // Создаем массив из обычного текста и стилизованных названий каналов
    const result: React.ReactNode[] = [];
    parts.forEach((part, index) => {
      result.push(part);
      if (index < channels.length) {
        result.push(
          <span key={index} className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">
            {channels[index]}
          </span>
        );
      }
    });
    
    return <>{result}</>;
  };

  return (
    <div className={cn(
      "flex-1 h-full rounded-lg flex flex-col  shadow-lg relative transition-all duration-300 bg-[rgb(var(--color-dark-card))]/80"
    )}>
      <div className="flex-grow overflow-y-auto p-8">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentModuleId} 
            variants={moduleVariants}
            initial="initial"
            animate="visible"
            exit="exit"
            className="flex flex-col flex-grow overflow-hidden"
          >
            {/* Верхняя часть (заголовок, описание) */} 
            {currentModuleData && (
              <>

                <h1 className={`text-3xl font-bold text-[rgb(var(--color-text-primary))] ${currentModuleData.isCompletion ? 'mb-6' : 'mb-4'}`}> {/* Больший отступ для заголовка завершения */} 
                  {moduleTitle}
                </h1>
                
                {/* Специальная разметка для первого модуля */}
                {currentModuleId === 'm1' ? (
                  <div className="space-y-6">
                    {/* Используем ключ */}
                    <p className="text-[rgb(var(--color-text-secondary))] text-lg">
                      {t('m1_intro_paragraph')}
                    </p>
                    
                    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-indigo-500/20">
                      {/* Используем ключ */}
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3">{t('m1_rewards_title')}</h2>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2 mt-1">🥉</span>
                          {/* Используем ключ */}
                          <span className="text-[rgb(var(--color-text-secondary))]" dangerouslySetInnerHTML={{ __html: t('m1_rewards_roles_desc') }} />
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2 mt-1">💎</span>
                          {/* Используем ключ */}
                          <span className="text-[rgb(var(--color-text-secondary))]" dangerouslySetInnerHTML={{ __html: t('m1_rewards_op_desc') }} />
                        </li>
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2 mt-1">🔑</span>
                           {/* Используем ключ */}
                          <span className="text-[rgb(var(--color-text-secondary))]" dangerouslySetInnerHTML={{ __html: t('m1_rewards_wl_desc') }} />
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      {/* Используем ключ */}
                      <h2 className="text-2xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-xl mr-2">🔧</span> {t('m1_how_it_works_title')}
                      </h2>
                      {/* Используем ключ */}
                      <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                        {t('m1_how_it_works_intro')}
                      </p>
                      
                      <div className="space-y-6 mt-6">
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-5 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-2">1</span>
                            {/* Используем ключ */}
                            {t('m1_step1_title')}
                          </h3>
                           {/* Используем ключ */}
                          <p className="text-[rgb(var(--color-text-secondary))]" dangerouslySetInnerHTML={{ __html: t('m1_step1_desc') }} />
                        </div>
                        
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-5 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-2">2</span>
                            {/* Используем ключ */}
                            {t('m1_step2_title')}
                          </h3>
                           {/* Используем ключ */}
                          <p className="text-[rgb(var(--color-text-secondary))] mb-3">
                            {t('m1_step2_desc')}
                          </p>
                          <ul className="list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))]">
                            <li className="flex items-start">
                              <span className="text-zinc-400 mr-2">•</span>
                              {/* Используем ключ */}
                              <span dangerouslySetInnerHTML={{ __html: t('m1_step2_role1') }} />
                            </li>
                            <li className="flex items-start">
                              <span className="text-zinc-400 mr-2">•</span>
                              {/* Используем ключ */}
                              <span dangerouslySetInnerHTML={{ __html: t('m1_step2_role2') }} />
                            </li>
                          </ul>
                          {/* Используем ключ */}
                          <p className="text-[rgb(var(--color-text-secondary))] mt-2">
                            {t('m1_step2_role_note')}
                          </p>
                        </div>
                        
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-5 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                            <span className="inline-flex justify-center items-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 mr-2">3</span>
                            {/* Используем ключ */}
                            {t('m1_step3_title')}
                          </h3>
                          {/* Используем ключ */}
                          <p className="text-[rgb(var(--color-text-secondary))]" dangerouslySetInnerHTML={{ __html: t('m1_step3_desc') }} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 border-l-4 border-emerald-500 pl-4 py-2">
                      {/* Используем ключ */}
                      <h3 className="text-xl font-semibold text-emerald-400 mb-2 flex items-center">
                        <span className="text-xl mr-2">🚀</span> {t('m1_tip_title')}
                      </h3>
                      <div className="text-[rgb(var(--color-text-secondary))]">
                        {/* Используем ключ */}
                        <p className="italic mb-3">{t('m1_tip_intro')}</p>
                        <ul className="list-inside space-y-1.5">
                          <li className="flex items-start">
                            <span className="text-zinc-400 mr-2">•</span>
                            {/* Используем ключ */}
                            <span dangerouslySetInnerHTML={{ __html: t('m1_tip_option1') }} />
                          </li>
                          <li className="flex items-start">
                            <span className="text-zinc-400 mr-2">•</span>
                             {/* Используем ключ */}
                            <span dangerouslySetInnerHTML={{ __html: t('m1_tip_option2') }} />
                          </li>
                        </ul>
                         {/* Используем ключ */}
                        <p className="italic mt-2">{t('m1_tip_conclusion')}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-5 rounded-lg border border-blue-500/10">
                      {/* Используем ключ */}
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                        <span className="text-xl mr-2">➡️</span> {t('m1_next_steps_title')}
                      </h2>
                       {/* Используем ключ */}
                      <p className="text-[rgb(var(--color-text-secondary))]" dangerouslySetInnerHTML={{ __html: t('m1_next_steps_desc') }} />
                   
                    </div>
                    
                  </div>
                ) : currentModuleId === 'm2' ? (
                  <div className="space-y-8"> {/* Увеличил отступ между блоками */} 
                    {/* Вступление */}
                    <p className="text-[rgb(var(--color-text-secondary))] text-lg">
                      {t('m2_intro_paragraph')}
                    </p>

                    {/* 1. Официальная информация */}
                    <div className="bg-gradient-to-r from-sky-900/30 to-cyan-900/30 p-6 rounded-lg border border-sky-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">📢</span> {t('m2_section1_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m2_section1_desc')}
                      </p>
                      <ul className="space-y-4">
                        {[ // Массив для удобного рендеринга каналов
                          { key: 'm2_channel_announcements', name: '#announcements' },
                          { key: 'm2_channel_minor_announcements', name: '#minor-announcements' },
                          { key: 'm2_channel_community_bible', name: '#community-bible' },
                          { key: 'm2_channel_scam_safety', name: '#scam-safety' },
                        ].map(channel => (
                          <li key={channel.key} className="flex items-start">
                            <span className="text-sky-400 mr-2 mt-1">•</span>
                            <div>
                              <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm mr-2">{channel.name}</span>
                              <span className="text-[rgb(var(--color-text-secondary))]">{t(channel.key)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 2. Общение и активность */}
                    <div className="bg-gradient-to-r from-lime-900/30 to-emerald-900/30 p-6 rounded-lg border border-lime-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">💬</span> {t('m2_section2_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m2_section2_desc')}
                      </p>
                      <div className="space-y-5">
                        {/* #general */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_general_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-2">{t('m2_channel_general_desc')}</p>
                          <p className="text-[rgb(var(--color-text-secondary))] flex items-center">
                            <span className="text-emerald-400 mr-1">🎁 </span>{t('m2_channel_general_reward')}
                          </p>
                        </div>
                        {/* #gm */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_gm_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">{t('m2_channel_gm_desc')}</p>
                        </div>
                        {/* #ru-чат */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_ru_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-2">{t('m2_channel_ru_desc')}</p>
                          <p className="text-[rgb(var(--color-text-secondary))] flex items-center">
                            <span className="text-blue-400 mr-1">🔑 </span>{t('m2_channel_ru_access')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 3. Ивенты и мероприятия */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 p-6 rounded-lg border border-purple-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">🎉</span> {t('m2_section3_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m2_section3_desc')}
                      </p>
                      <ul className="space-y-4">
                        {[ // Массив для удобного рендеринга каналов
                          { key: 'm2_channel_events_announcements', name: '#events-announcements' },
                          { key: 'm2_channel_events_schedule', name: '#events-schedule' },
                          { key: 'm2_channel_oasis_stage', name: '#oasis-stage' },
                        ].map(channel => (
                          <li key={channel.key} className="flex items-start">
                            <span className="text-purple-400 mr-2 mt-1">•</span>
                            <div>
                              <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm mr-2">{channel.name}</span>
                              <span className="text-[rgb(var(--color-text-secondary))]">{t(channel.key)}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 4. Творчество и контент */}
                    <div className="bg-gradient-to-r from-orange-900/30 to-amber-900/30 p-6 rounded-lg border border-orange-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">🎨</span> {t('m2_section4_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m2_section4_desc')}
                      </p>
                      <div className="space-y-5">
                        {/* #memes */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_memes_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-2">{t('m2_channel_memes_desc')}</p>
                       
                         </div>
                        {/* #community-tweets */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_community_tweets_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">{t('m2_channel_community_tweets_desc')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 5. Oasis Points (OP) */}
                    <div className="bg-gradient-to-r from-rose-900/30 to-red-900/30 p-6 rounded-lg border border-rose-500/20">
                       <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">💎</span> {t('m2_section5_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m2_section5_desc')}
                      </p>
                      <div className="space-y-5">
                        {/* #op-shop */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg opacity-70"> {/* Сделаем полупрозрачным */} 
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_op_shop_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">{t('m2_channel_op_shop_desc')}</p>
                        </div>
                         {/* #twitter-raids */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_twitter_raids_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-2">{t('m2_channel_twitter_raids_desc')}</p>
                          <p className="text-[rgb(var(--color-text-secondary))] flex items-center">
                             <span className="text-blue-400 mr-1">🔑 </span>{t('m2_channel_twitter_raids_req')}
                           </p>
                        </div>
                         {/* #op-commands */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">
                            <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-mono text-base">{t('m2_channel_op_commands_title')}</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-2">{t('m2_channel_op_commands_desc')}</p>
                          <ul className="list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))]">
                            <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span><code>{t('m2_op_command_rank')}</code></li>
                            <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span><code>{t('m2_op_command_leaderboard')}</code></li>
                            <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span><code>{t('m2_op_command_claim')}</code></li>
           
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Как каналы связаны с ролями? */}
                    <div className="bg-gradient-to-r from-indigo-900/30 to-blue-900/30 p-6 rounded-lg border border-indigo-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">🔗</span> {t('m2_section6_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                        {t('m2_section6_desc')}
                      </p>
                       <ul className="list-inside space-y-2 text-[rgb(var(--color-text-secondary))]">
                        <li className="flex items-start">
                          <span className="text-amber-400 mr-2">🥉🥈🥇💎</span>
                          <span><span className="font-medium text-[rgb(var(--color-text-primary))]">{t('m2_roles_level')}</span></span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-fuchsia-400 mr-2">🎨♠️</span>
                          <span><span className="font-medium text-[rgb(var(--color-text-primary))]">{t('m2_roles_exclusive')}</span></span>
                        </li>
                      </ul>
                    </div>

                    {/* Что дальше */}
                    <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-5 rounded-lg border border-blue-500/10">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                        <span className="text-xl mr-2">➡️</span> {t('m2_next_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))]"> 
                        {t('m2_next_desc')}
                      </p>
                    </div>
                  </div>
                ) : currentModuleId === 'm3' ? (
                  <div className="space-y-6">
                    {/* --- НАЧАЛО КОНТЕНТА ДЛЯ M3 (из treee.txt) --- */}
                    <p className="text-[rgb(var(--color-text-secondary))] text-lg">
                      {t('m3_desc')}
                    </p>
                    
                    {/* Роли-ключи */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-6 rounded-lg border border-blue-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-xl mr-2">🔑</span> {t('m3_key_roles_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m3_key_roles_desc', { channel: '#community-bible' })}
                      </p>
                      
                      {/* Таблица с ролями-ключами - ОБНОВЛЕНО */}
                      <div className="overflow-hidden rounded-lg border border-zinc-700/50 mb-5">
                        {/* Заголовок таблицы */}
                        <div className="grid grid-cols-2 bg-zinc-800/70 text-[rgb(var(--color-text-primary))] font-medium">
                          <div className="p-3 border-r border-zinc-700/50">{t('m3_table_header_role')}</div>
                          <div className="p-3">{t('m3_table_header_purpose')}</div>
                          {/* Убрали колонку Совет */}
                        </div>
                        
                        {/* Роль Twitter Degen */}
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center">
                          <div className="p-3 border-r border-zinc-700/50 font-medium">
                            <span className="text-blue-400 mr-2">🐦</span>{t('m3_role_twitter_degen')}
                          </div>
                          <div className="p-3">
                            {t('m3_role_twitter_degen_desc', { channel: '#twitter-raids' })}
                          </div>
                        </div>
                        
                        {/* Роль Gamer */}
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center">
                          <div className="p-3 border-r border-zinc-700/50 font-medium">
                            <span className="text-blue-400 mr-2">🎮</span>{t('m3_role_gamer')}
                          </div>
                          <div className="p-3">
                            {t('m3_role_gamer_desc', { channel: '#oasis-stage' })}
                          </div>
                        </div>
                        
                        {/* Роль Quizzes */}
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center">
                          <div className="p-3 border-r border-zinc-700/50 font-medium">
                            <span className="text-blue-400 mr-2">❓</span>{t('m3_role_quizzes')}
                          </div>
                          <div className="p-3">
                            {t('m3_role_quizzes_desc')}
                          </div>
                        </div>

                        {/* Роль Legend - ДОБАВЛЕНО */}
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center">
                          <div className="p-3 border-r border-zinc-700/50 font-medium">
                            <span className="text-yellow-400 mr-2">🏆</span>{t('m3_role_legend')}
                          </div>
                          <div className="p-3">
                            {t('m3_role_legend_desc')}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center">
                          <div className="p-3 border-r border-zinc-700/50 font-medium">
                            <span className="text-sky-400 mr-2">🌐</span>{t('m3_role_web3_ai')}
                          </div>
                          <div className="p-3">
                            {t('m3_role_web3_ai_desc')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Языковые роли - ПЕРЕМЕЩЕНО ВЫШЕ */}
                      <div className="bg-gradient-to-r from-teal-900/30 to-emerald-900/30 p-6 rounded-lg border border-teal-500/20 mb-6"> {/* Добавлен отступ снизу */} 
                        <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                           <span className="text-xl mr-2">🌐</span> {t('m3_language_roles_title')}
                        </h3>
                        <p className="text-[rgb(var(--color-text-secondary))] mb-3">
                           {t('m3_language_roles_desc', { 
                             role: 'Russian 🇷🇺', 
                             channel: '#community-bible' 
                           })}
                        </p>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                           {t('m3_language_roles_benefit')}
                        </p>
                      </div>

                      {/* Как это работает - ПЕРЕМЕЩЕНО НИЖЕ */} 
                      <div className="bg-sky-900/20 border border-sky-500/10 p-4 rounded-md"> 
                        <h3 className="font-medium text-[rgb(var(--color-text-primary))] mb-2">{t('m3_how_it_works_title')}</h3>
                        <p className="text-[rgb(var(--color-text-secondary))]">
                          {t('m3_how_it_works_desc', { channel: '#community-bible' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-900/30 to-yellow-900/30 p-6 rounded-lg border border-amber-500/20 mt-8">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-xl mr-2">🏆</span> {t('m3_reward_roles_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-5">
                        {t('m3_reward_roles_desc')}
                      </p>
                      
                      {/* Таблица с ролями-наградами - ИЗМЕНЕНО */}
                      <div className="overflow-hidden rounded-lg border border-zinc-700/50 mb-5">
                        {/* Заголовок таблицы */}
                        <div className="grid grid-cols-2 bg-zinc-800/70 text-[rgb(var(--color-text-primary))] font-medium"> {/* Стало 2 колонки */} 
                          <div className="p-3 border-r border-zinc-700/50">{t('m3_table_header_role')}</div>
                          <div className="p-3">{t('m3_table_header_purpose')}</div> {/* Объединили колонки */} 
                        </div>
                        
                        {/* Роли Bronze/Silver/Gold/Platinum */} 
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center"> {/* ДОБАВЛЕНО: flex items-center */} 
                          <div className="p-3 border-r border-zinc-700/50">
                            <span className="font-medium">
                              {t('m3_roles_bronze_silver_gold_platinum')}
                            </span>
                          </div>
                          <div className="p-3">
                            {t('m3_roles_tier_desc')}
                          </div>
                        </div>
                        
                        {/* Роль Content Creator */} 
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center"> {/* ДОБАВЛЕНО: flex items-center */} 
                          <div className="p-3 border-r border-zinc-700/50">
                            <span className="text-fuchsia-400 font-medium">{t('m3_role_content_creator')}</span>
                          </div>
                          <div className="p-3">
                            {t('m3_role_content_creator_desc', { 
                              memes: '#memes',
                              tweets: '#community-tweets'
                            })}
                          </div>
                        </div>
                        
                        {/* Роль Poker Pharaoh */} 
                        <div className="grid grid-cols-2 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center"> {/* ДОБАВЛЕНО: flex items-center */} 
                          <div className="p-3 border-r border-zinc-700/50">
                            <span className="text-green-400 font-medium">{t('m3_role_poker_pharaoh')}</span>
                          </div>
                          <div className="p-3">
                            {t('m3_role_poker_pharaoh_desc', { channel: '#oasis-stage' })}
                          </div>
                        </div>
                      </div>
                      
                       <div className="bg-purple-900/20 border border-purple-500/10 p-4 rounded-md">
                        <h3 className="font-medium text-[rgb(var(--color-text-primary))] mb-2">{t('m3_xp_title')}</h3>
                         <p className="text-[rgb(var(--color-text-secondary))] mb-2">
                            {t('m3_xp_desc')}
                         </p>
                         <ul className="list-inside space-y-1 text-[rgb(var(--color-text-secondary))]">
                            <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>
                               {t('m3_xp_chat', {
                                 general: '#general',
                                 ruchat: '#ru-чат'
                               })}
                            </li>
                            <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>
                               {t('m3_xp_voice', { channel: '#oasis-stage' })}
                            </li>
                            <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>
                               {t('m3_xp_content', { 
                                 memes: '#memes',
                                 tweets: '#community-tweets'
                               })}
                            </li>
                          </ul>
                         <p className="text-[rgb(var(--color-text-secondary))] mt-2 italic">
                            {t('m3_xp_progress')}
                          </p>
                      </div>
                   </div>
                    
                    {/* Что дальше */} 
                    <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-5 rounded-lg border border-blue-500/10">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                        <span className="text-xl mr-2">➡️</span> {t('m3_next_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        {t('m3_next_desc')}
                      </p>
                    </div>
                  </div>
                ) : currentModuleId === 'm4' ? (
                  <div className="space-y-8">
                    {/* Вступление */}
                    <p className="text-[rgb(var(--color-text-secondary))] text-lg">
                      {t('m4_desc')}
                    </p>

                    {/* Уровни и роли */}
                    <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 p-6 rounded-lg border border-yellow-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">🎯</span> {t('m4_levels_roles_title')}
                      </h2>
                      <div className="overflow-hidden rounded-lg border border-zinc-700/50">
                        {/* Заголовок таблицы */} 
                        <div className="grid grid-cols-3 bg-zinc-800/70 text-[rgb(var(--color-text-primary))] font-medium">
                          <div className="p-3 border-r border-zinc-700/50">{t('m4_table_header_role')}</div>
                          <div className="p-3 border-r border-zinc-700/50">{t('m4_table_header_xp')}</div>
                          <div className="p-3">{t('m4_table_header_level')}</div>
                        </div>
                        {/* Строки таблицы */} 
                        {[ 
                          { role: t('m4_role_bronze'), xp: '5,000', level: '25' },
                          { role: t('m4_role_silver'), xp: '55,000', level: '50' },
                          { role: t('m4_role_gold'), xp: '300,000', level: '75' },
                          { role: t('m4_role_platinum'), xp: '555,000', level: '100' },
                        ].map((item, index) => (
                          <div key={index} className="grid grid-cols-3 border-t border-zinc-700/50 text-[rgb(var(--color-text-secondary))] flex items-center">
                            <div className={`p-3 border-r border-zinc-700/50 font-medium ${ 
                              item.role.includes('Bronze') ? 'text-amber-600' : 
                              item.role.includes('Silver') ? 'text-slate-400' : 
                              item.role.includes('Gold') ? 'text-yellow-400' : 
                              item.role.includes('Platinum') ? 'text-cyan-400' : '' 
                            }`}>{item.role}</div>
                            <div className="p-3 border-r border-zinc-700/50 font-mono">{item.xp}</div>
                            <div className="p-3 font-mono">{item.level}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Где и как зарабатывать XP? */} 
                    <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 p-6 rounded-lg border border-emerald-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">💡</span> {t('m4_earning_xp_title')}
                      </h2>
                      <div className="space-y-5">
                        {/* Общение */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                            <span className="text-xl mr-2">💬</span> {t('m4_chat_title')}
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">
                            {formatChannelNames(t('m4_chat_desc', { 
                              general: '#general',
                              ruchat: '#ru-чат',
                              xpRate: `+15 XP/${t('minute')}`
                            }))}
                          </p>
                        </div>
                        {/* OasisStage */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                             <span className="text-xl mr-2">🎉</span> {t('m4_oasis_stage_title')}
                          </h3>
                           <ul className="list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))]">
                             <li className="flex items-start">
                               <span className="text-zinc-400 mr-2">•</span>
                               {formatChannelNames(t('m4_oasis_stage_events', {
                                 channel: '#events-announcements'
                               }))}
                             </li>
                             <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>{t('m4_oasis_stage_presence')}</li>
                           </ul>
                        </div>
                        {/* Задания */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                            <span className="text-xl mr-2">✅</span> {t('m4_tasks_title')}
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">
                            {formatChannelNames(t('m4_tasks_desc', {
                              channel: '#events-announcements'
                            }))}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Калькулятор XP */} 
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-6 rounded-lg border border-blue-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">📊</span> {t('m4_calculator_title')}
                      </h2>
                   
                      <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                        {t('m4_calculator_desc')}
                      </p>
                       {/* --- Место для Компонента Калькулятора --- */}
                       <XpCalculator /> {/* ВСТАВЛЕН КОМПОНЕНТ */}
                       {/* ---------------------------------------- */}
                    </div>

                    {/* Что дальше */} 
                    <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-fuchsia-900/20 p-5 rounded-lg border border-purple-500/10">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                        <span className="text-xl mr-2">➡️</span> {t('m4_next_title')}
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-3">
                        {t('m4_next_desc')}
                      </p>
                       <ul className="list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))]">
                         <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>{t('m4_next_point1')}</li>
                         <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>
                           {formatChannelNames(t('m4_next_point2', {
                             channel: '#op-shop'
                           }))}
                         </li>
                         <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span>{t('m4_next_point3')}</li>
                       </ul>
                    </div>
                  </div>
                ) : currentModuleId === 'm5' ? (
                  <div className="space-y-8">
                    {/* Вступление */}
                    <p className="text-[rgb(var(--color-text-secondary))] text-lg">
                      Oasis Points (OP) — это внутренняя валюта Sahara AI, которую вы можете обменивать на роли, бустеры и другие привилегии. В отличие от XP, OP не влияют на уровень, но открывают доступ к уникальным возможностям.
                    </p>

                    {/* Как заработать OP? */}
                    <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 p-6 rounded-lg border border-teal-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-5 flex items-center">
                        <span className="text-2xl mr-2">🚀</span> Как заработать OP?
                      </h2>
                      <div className="space-y-6">
                        {/* 1. Twitter-raids */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                            <span className="text-xl mr-2">1.</span> Twitter-raids <span className="text-blue-400 ml-2">🐦</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-3">
                            Выполняйте задания в канале <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#twitter-raids</span>:
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-[rgb(var(--color-text-secondary))] mb-3 pl-2">
                            <li><span className="font-medium">Привяжите Twitter:</span> Введите <code>/set twitter [ваш_ник]</code> в <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#op-commands</span>.</li>
                            <li><span className="font-medium">Выберите задание:</span> Нажмите на пост с кнопкой «Check Task».</li>
                            <li><span className="font-medium">Выполните условие:</span> Лайк + репост указанного твита.</li>
                            <li><span className="font-medium">Подтвердите выполнение:</span> Вернитесь в Discord → нажмите «Проверить».</li>
                          </ol>
                          <p className="text-[rgb(var(--color-text-secondary))] flex items-center">
                            <span className="text-emerald-400 mr-1">💰 Награда:</span> +200 OP за задание.
                          </p>
                        </div>
                        
                        {/* 2. Участие в Oasis Stage */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                             <span className="text-xl mr-2">2.</span> Участие в Oasis Stage <span className="text-purple-400 ml-2">🎤</span>
                          </h3>
                           <ul className="list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))] pl-2">
                             <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span><span className="font-medium">Победа в ивентах</span> (квизы, игры, турниры) → За призовые места получаем определенное количество OP.</li>
                             <li className="flex items-start"><span className="text-zinc-400 mr-2">•</span><span className="font-medium">Пассивное участие:</span> Модераторы могут начислить OP всем слушателям.</li>
                           </ul>
                        </div>

                        {/* 3. Лайк анонсов */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                             <span className="text-xl mr-2">3.</span> Лайк анонсов <span className="text-yellow-400 ml-2">🔔</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))] mb-2">
                            Лайкните пост в <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#анонсы</span> в первые 4 часа → <span className="text-emerald-400">+10 OP</span>.
                          </p>
                          <p className="text-sm text-zinc-500 italic">Важно: Повторные лайки не засчитываются.</p>
                        </div>

                        {/* 4. Ежедневный бонус */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                            <span className="text-xl mr-2">4.</span> Ежедневный бонус <span className="text-rose-400 ml-2">🎁</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">
                            Введите <code>/claim daily</code> в <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#op-commands</span> раз в 24 часа → <span className="text-emerald-400">+100 OP</span>.
                          </p>
                        </div>

                        {/* 5. Квизы в Telegram */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                            <span className="text-xl mr-2">5.</span> Квизы в Telegram <span className="text-sky-400 ml-2">❓</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">
                            Участвуйте в викторинах Telegram-канала Sahara AI → <span className="text-emerald-400">до 300 OP</span> за правильные ответы.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Как тратить OP? */}
                    <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-6 rounded-lg border border-orange-500/20">
                       <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">🛒</span> Как тратить OP?
                      </h2>
                       <p className="text-[rgb(var(--color-text-secondary))] opacity-70">
                         В магазине <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#op-shop</span> (временно недоступен)
                       </p>
                    </div>

                    {/* Как проверить сколько у вас OP? */}
                    <div className="bg-gradient-to-r from-lime-900/30 to-emerald-900/30 p-6 rounded-lg border border-lime-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">📊</span> Как проверить сколько у вас OP?
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Чтобы узнать, сколько OP нужно для цели: Введите <code>/leaderboard</code> в <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#op-commands</span> → бот покажет ваш текущий баланс поинтов.
                      </p>
                    </div>

                    {/* Что дальше */} 
                    <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-5 rounded-lg border border-blue-500/10">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                        <span className="text-xl mr-2">➡️</span> Что дальше?
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Теперь вы знаете, как зарабатывать и тратить OP. В разделе «Активности» вас ждет подробные инструкции по участию в ивентах.
                      </p>
                    </div>
                  </div>
                ) : currentModuleId === 'm6' ? ( // ДОБАВЛЕН БЛОК ДЛЯ M6
                  <div className="space-y-8">
                    {/* Вступление */}
                    <p className="text-[rgb(var(--color-text-secondary))] text-lg">
                      Создание контента — это не только способ проявить креативность, но и прямой путь к эксклюзивным наградам. Здесь вы узнаете, как ваши мемы, твиты могут открыть доступ к роли Content Creator и белому списку (WL).
                    </p>

                    {/* 1. Роль Content Creator */}
                    <div className="bg-gradient-to-r from-purple-900/30 to-fuchsia-900/30 p-6 rounded-lg border border-purple-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">1.</span> Роль Content Creator: Ваш творческий статус <span className="text-fuchsia-400 ml-2">🎨</span>
                      </h2>
                      
                      <div className="mb-5">
                        <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">Как получить?</h3>
                        <p className="text-[rgb(var(--color-text-secondary))] mb-3">
                          Публикуйте контент в специальных каналах:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))] pl-2 mb-3">
                          <li>Мемы → <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#memes</span>.</li>
                          <li>Твиты → <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#community-tweets</span> (размещайте свои работы в твиттер и публикуйте).</li>
                        </ul>
                        <p className="text-[rgb(var(--color-text-secondary))] mb-3">
                          <span className="font-medium text-[rgb(var(--color-text-primary))]">Качество важнее количества:</span> Модераторы отмечают работы, которые:
                        </p>
                        <ul className="list-disc list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))] pl-2">
                          <li>Оригинальны (не копируют чужие идеи).</li>
                          <li>Соответствуют тематике Sahara AI.</li>
                          <li>Вызывают реакцию сообщества (лайки, репосты).</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2">Что дает роль?</h3>
                         <ul className="list-disc list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))] pl-2">
                           <li>Упоминания в твитере проекта (ваш пост появляется в заданиях в канале <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#twitter-raids</span>).</li>
                           <li>Доступ к размещению своих работ в канал <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#artist-content</span>.</li>
                         </ul>
                      </div>
                    </div>

                    {/* 2. Контент = Шанс на WL */}
                    <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 p-6 rounded-lg border border-emerald-500/20">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-4 flex items-center">
                        <span className="text-2xl mr-2">2.</span> Контент = Шанс на WL <span className="text-green-400 ml-2">🎟️</span>
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                         Как попасть в белый список через творчество?
                      </p>
                      <div className="space-y-4">
                        {/* Участие в #Oasis Stage */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                            Участие в #Oasis Stage <span className="text-purple-400 ml-2">🎤</span>
                          </h3>
                           <ul className="list-inside space-y-1.5 text-[rgb(var(--color-text-secondary))] pl-2">
                             <li>Следите за анонсами в <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#events-announcements</span>.</li>
                             <li>Участвуем на АМА-сессиях, где разыгрывают среди всех участником определенное количество WL.</li>
                           </ul>
                        </div>
                         {/* Публикуйте работы в Twitter */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                             Публикуйте работы в Twitter <span className="text-blue-400 ml-2">🐦</span>
                          </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">
                            Отправляйте ссылки на посты в <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#community-tweets</span>.
                          </p>
                        </div>
                         {/* Региональные активности */}
                        <div className="bg-[rgb(var(--color-dark-base))]/60 p-4 rounded-lg">
                          <h3 className="font-semibold text-lg text-[rgb(var(--color-text-primary))] mb-2 flex items-center">
                             Региональные активности <span className="text-yellow-400 ml-2">🌍</span>
                    </h3>
                          <p className="text-[rgb(var(--color-text-secondary))]">
                            В <span className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded-md font-mono text-sm">#ru-чат</span> и других языковых чатах проводятся мини-конкурсы, за победу в которых выдают WL.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5. Что дальше? (Нумерация из файла) */} 
                    <div className="mt-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 p-5 rounded-lg border border-blue-500/10">
                      <h2 className="text-xl font-semibold text-[rgb(var(--color-text-primary))] mb-3 flex items-center">
                        <span className="text-xl mr-2">5.</span> Что дальше?
                      </h2>
                      <p className="text-[rgb(var(--color-text-secondary))]">
                        Теперь вы знаете, как контент помогает получить роль и WL. Давайте подведем «Итоги».
                      </p>
                    </div>
                   </div>
                ) : moduleDescription && (
                   // ОБНОВЛЕННЫЙ БЛОК ДЛЯ ОБЫЧНЫХ И ЗАВЕРШАЮЩЕГО МОДУЛЕЙ
                  <div className={`text-[rgb(var(--color-text-secondary))]  ${currentModuleData.isCompletion ? ' prose prose-invert prose-neutral prose-p:my-3 prose-blockquote:my-4 prose-li:my-1 prose-ul:my-3 prose-headings:text-[rgb(var(--color-text-primary))] prose-strong:text-[rgb(var(--color-text-primary))] ' : 'whitespace-pre-line'}`}> 
                    
                    {/* Разделяем текст на части для лучшей стилизации m13 */}
                    {currentModuleData.isCompletion && moduleDescription.includes('Помните:') ? (
                      <>
                        {moduleDescription.split('Помните:')[0].split('\n\n').map((paragraph, index) => (
                          <p key={`intro-${index}`}>{paragraph}</p>
                        ))}
                        <blockquote className="mt-6 border-l-2 border-yellow-500/50 pl-4 italic text-yellow-300/80">
                          <p className="font-semibold text-yellow-300">Помните:</p>
                          <ul className="list-disc list-outside ml-4 mt-2 space-y-1">
                            {moduleDescription.split('Помните:')[1].split('\n•').filter(item => item.trim()).map((item, index) => (
                              <li key={`remember-${index}`}>{item.trim()}</li>
                      ))}
                    </ul>
                        </blockquote>
                        
                            <p className="mt-6">Держите этот гайд под рукой, возвращайтесь к нему, если что-то забудете, и — вперёд! Sahara AI ждет ваших достижений.</p>
                   
                      </>
                    ) : (
                      // Обычный рендеринг для других модулей или если нет "Помните:"
                      moduleDescription.split('\n\n').map((paragraph, index) => (
                         <p key={index}>{paragraph}</p>
                      ))
                    )}

                    {/* КНОПКИ ДЛЯ ЗАВЕРШАЮЩЕГО МОДУЛЯ (m13) */}
                    {currentModuleData.isCompletion && (
                       <div className="mt-10 flex flex-wrap gap-4 justify-center">
                         <a href="#discord" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                           <Button variant="outline" className="bg-indigo-600/10 hover:bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:text-indigo-200">
                             {/* Иконка Discord */} 
                             Discord
                           </Button>
                         </a>
                         <a href="#website" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                           <Button variant="outline" className="bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/30 text-emerald-300 hover:text-emerald-200">
                              <Globe className="h-4 w-4 mr-2" />
                             Сайт
                           </Button>
                         </a>
                         <a href="#twitter" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                           <Button variant="outline" className="bg-sky-600/10 hover:bg-sky-600/20 border-sky-500/30 text-sky-300 hover:text-sky-200">
                              {/* Иконка Twitter */} 
                             Twitter
                           </Button>
                         </a>
                       </div>
                    )}
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
                className="cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t('back_button')} 
              </Button>
          <Button 
            onClick={onModuleNext} 
            disabled={isLastModule} // isLastModule теперь будет true для m13, но кнопки все равно скроются
            aria-label={t('next_module_button')}
            className="cursor-pointer"
          >
            {t('next_button')} 
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

const GuideContent = React.memo(GuideContentComponent);
export default GuideContent; 