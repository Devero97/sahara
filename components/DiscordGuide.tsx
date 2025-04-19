'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import ServerPanel from './ServerPanel';
import GuideContent from './GuideContent';
import IntroductoryQuest from './IntroductoryQuest';
import { categories } from './ServerPanel'; // Импортируем categories

// КОНСТАНТЫ
const LOCAL_STORAGE_KEYS = {
  CURRENT_STEP: 'discordGuide_currentStep',
  INTRO_COMPLETED: 'discordGuide_introCompleted', // Ключ для статуса интро
};

// --- ХУКИ ДЛЯ LOCALSTORAGE ---
function usePersistentState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        try {
          return JSON.parse(storedValue);
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
          localStorage.removeItem(key); // Удаляем некорректное значение
        }
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

// Неиспользуемая функция - закомментируем для прохождения линтера
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function usePersistentSetState(key: string, defaultValue: Set<string>): [Set<string>, (value: string) => void, (value: string) => void] {
  const [state, setState] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        try {
          const parsedArray = JSON.parse(storedValue);
          if (Array.isArray(parsedArray)) {
            return new Set(parsedArray);
          } else {
             console.error(`Invalid data type found in localStorage for key "${key}": expected array.`);
             localStorage.removeItem(key);
          }
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}":`, error);
          localStorage.removeItem(key);
        }
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(Array.from(state)));
    }
  }, [key, state]);

  const addValue = (value: string) => {
    setState(prevSet => new Set(prevSet).add(value));
  };

  const deleteValue = (value: string) => {
    setState(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete(value);
      return newSet;
    });
  };

  return [state, addValue, deleteValue];
}
// --------------------------

// Обновляем функцию получения ID модулей (из ServerPanel)
const getOrderedModuleIds = () => {
  return categories.flatMap(category => category.modules.map(module => module.id));
};

export default function DiscordGuide() {
  // === СОСТОЯНИЕ ===
  const [isIntroCompleted, setIsIntroCompleted] = usePersistentState<boolean>(LOCAL_STORAGE_KEYS.INTRO_COMPLETED, false);
  // Ставим ID первого модуля (m1) по умолчанию
  const [currentModuleId, setCurrentModuleId] = usePersistentState<string>(LOCAL_STORAGE_KEYS.CURRENT_STEP, 'm1'); 
  const [activeModuleId, setActiveModuleId] = useState<string | null>(currentModuleId);
  
  // Добавляем состояние для предотвращения ошибок гидратации
  const [isClientReady, setIsClientReady] = useState(false);

  // === ЭФФЕКТЫ ===
  useEffect(() => {
    setActiveModuleId(currentModuleId);
  }, [currentModuleId]);
  
  // Эффект для обозначения, что клиент готов к рендерингу
  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // --- ОБРАБОТЧИКИ --- 
  const handleModuleChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
    // Добавляем скролл наверх при изменении модуля
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteIntro = () => {
    setIsIntroCompleted(true); 
    setCurrentModuleId('m1');
    setActiveModuleId('m1');
  };

  // --- ЛОГИКА НАВИГАЦИИ ПО МОДУЛЯМ --- 
  const orderedModuleIds = useMemo(() => getOrderedModuleIds(), []);

  const currentModuleIndex = useMemo(() => 
      orderedModuleIds.findIndex(id => id === currentModuleId), 
      [orderedModuleIds, currentModuleId]
  );

  const handleModuleNext = () => {
    if (currentModuleIndex !== -1 && currentModuleIndex < orderedModuleIds.length - 1) {
      const nextModuleId = orderedModuleIds[currentModuleIndex + 1];
      setCurrentModuleId(nextModuleId);
      // Добавляем скролл наверх при переходе к следующему модулю
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleModulePrev = () => {
    if (currentModuleIndex > 0) {
      const prevModuleId = orderedModuleIds[currentModuleIndex - 1];
      setCurrentModuleId(prevModuleId);
      // Добавляем скролл наверх при переходе к предыдущему модулю
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  // --------------------------------

  // === РЕНДЕР ===
  
  // Если клиент не готов, показываем пустой div для избежания ошибок гидратации
  if (!isClientReady) {
    return <div className="min-h-[calc(100dvh-120px)]"></div>;
  }
  
  if (!isIntroCompleted) {
    return <IntroductoryQuest onComplete={handleCompleteIntro} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex py-[20px]"
    >
      <ServerPanel 
        activeModuleId={activeModuleId}
        onModuleChange={handleModuleChange}
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <GuideContent 
          currentModuleId={activeModuleId ?? 'm1'}
          onModulePrev={handleModulePrev}
          onModuleNext={handleModuleNext}
          isFirstModule={currentModuleIndex === 0}
          isLastModule={currentModuleIndex === orderedModuleIds.length - 1}
        />
      </motion.div>
    </motion.div>
  );
} 