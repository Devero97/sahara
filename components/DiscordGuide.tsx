'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';
import ServerPanel from './ServerPanel';
import GuideContent from './GuideContent';
import IntroductoryQuest from './IntroductoryQuest';
import { toast } from "sonner";
import { CheckpointData } from './CheckpointPopover';
import { categories } from './ServerPanel'; // Импортируем categories

// КОНСТАНТЫ
const LOCAL_STORAGE_KEYS = {
  CURRENT_STEP: 'discordGuide_currentStep',
  COMPLETED_CHECKPOINTS: 'discordGuide_completedCheckpoints',
  INTRO_COMPLETED: 'discordGuide_introCompleted', // Ключ для статуса интро
};

// НОВЫЕ ДАННЫЕ ЧЕКПОИНТОВ (с обновленными moduleId)
const CHECKPOINTS: CheckpointData[] = [
  { // Чекпоинт 1 -> Модуль m1
    id: 'cp1', 
    moduleId: 'm1', 
    questionKey: 'cp1_q', 
    options: [
      { id: 'cp1_o1', textKey: 'cp1_o1_text', isCorrect: false },
      { id: 'cp1_o2', textKey: 'cp1_o2_text', isCorrect: true }, // Правильный
      { id: 'cp1_o3', textKey: 'cp1_o3_text', isCorrect: false },
      { id: 'cp1_o4', textKey: 'cp1_o4_text', isCorrect: false },
    ],
    explanationKey: 'cp1_exp'
  },
  { // Чекпоинт 2 -> Модуль m2
    id: 'cp2', 
    moduleId: 'm2',
    questionKey: 'cp2_q',
    options: [
      { id: 'cp2_o1', textKey: 'cp2_o1_text', isCorrect: false },
      { id: 'cp2_o2', textKey: 'cp2_o2_text', isCorrect: false },
      { id: 'cp2_o3', textKey: 'cp2_o3_text', isCorrect: true }, // Правильный
      { id: 'cp2_o4', textKey: 'cp2_o4_text', isCorrect: false },
    ],
    explanationKey: 'cp2_exp'
  },
  { // Чекпоинт 3 -> Модуль m5 (Про OP)
    id: 'cp3',
    moduleId: 'm5', 
    questionKey: 'cp3_q',
    options: [
      { id: 'cp3_o1', textKey: 'cp3_o1_text', isCorrect: false },
      { id: 'cp3_o2', textKey: 'cp3_o2_text', isCorrect: false },
      { id: 'cp3_o3', textKey: 'cp3_o3_text', isCorrect: false },
      { id: 'cp3_o4', textKey: 'cp3_o4_text', isCorrect: true }, // Правильный
    ],
    explanationKey: 'cp3_exp'
  },
  { // Чекпоинт 4 -> Модуль m8 (Про контент)
    id: 'cp4',
    moduleId: 'm8',
    questionKey: 'cp4_q',
    options: [
      { id: 'cp4_o1', textKey: 'cp4_o1_text', isCorrect: false },
      { id: 'cp4_o2', textKey: 'cp4_o2_text', isCorrect: false },
      { id: 'cp4_o3', textKey: 'cp4_o3_text', isCorrect: true }, // Правильный
      { id: 'cp4_o4', textKey: 'cp4_o4_text', isCorrect: false },
    ],
    explanationKey: 'cp4_exp'
  },
  { // Чекпоинт 5 -> Модуль m10 (Про WL)
    id: 'cp5',
    moduleId: 'm10',
    questionKey: 'cp5_q',
    options: [
      { id: 'cp5_o1', textKey: 'cp5_o1_text', isCorrect: false },
      { id: 'cp5_o2', textKey: 'cp5_o2_text', isCorrect: false },
      { id: 'cp5_o3', textKey: 'cp5_o3_text', isCorrect: true }, // Правильный
      { id: 'cp5_o4', textKey: 'cp5_o4_text', isCorrect: false },
    ],
    explanationKey: 'cp5_exp'
  },
  { // Чекпоинт 6 -> Модуль m9 (Про общение)
    id: 'cp6',
    moduleId: 'm9',
    questionKey: 'cp6_q',
    options: [
      { id: 'cp6_o1', textKey: 'cp6_o1_text', isCorrect: false },
      { id: 'cp6_o2', textKey: 'cp6_o2_text', isCorrect: false },
      { id: 'cp6_o3', textKey: 'cp6_o3_text', isCorrect: true }, // Правильный
      { id: 'cp6_o4', textKey: 'cp6_o4_text', isCorrect: false },
    ],
    explanationKey: 'cp6_exp'
  },
  { // Чекпоинт 7 -> Модуль m11 (Про помощь)
    id: 'cp7',
    moduleId: 'm11',
    questionKey: 'cp7_q',
    options: [
      { id: 'cp7_o1', textKey: 'cp7_o1_text', isCorrect: false },
      { id: 'cp7_o2', textKey: 'cp7_o2_text', isCorrect: false },
      { id: 'cp7_o3', textKey: 'cp7_o3_text', isCorrect: true }, // Правильный
      { id: 'cp7_o4', textKey: 'cp7_o4_text', isCorrect: false },
    ],
    explanationKey: 'cp7_exp'
  },
];

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
  const [completedCheckpoints, addCompletedCheckpoint] = usePersistentSetState(LOCAL_STORAGE_KEYS.COMPLETED_CHECKPOINTS, new Set<string>());
  const [activeModuleId, setActiveModuleId] = useState<string | null>(currentModuleId);

  // === ЭФФЕКТЫ ===
  useEffect(() => {
    setActiveModuleId(currentModuleId);
  }, [currentModuleId]);

  // --- ОБРАБОТЧИКИ --- 
  const handleModuleChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
  };

  const markCheckpointComplete = (checkpointId: string) => {
    addCompletedCheckpoint(checkpointId);
    toast.success("Проверка пройдена!");
  };

  const handleCompleteIntro = () => {
    setIsIntroCompleted(true); 
    toast.info("Вводный квест завершен! Добро пожаловать в полный гайд.");
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
    }
  };

  const handleModulePrev = () => {
    if (currentModuleIndex > 0) {
      const prevModuleId = orderedModuleIds[currentModuleIndex - 1];
      setCurrentModuleId(prevModuleId);
    }
  };
  // --------------------------------

  // === РЕНДЕР ===
  
  if (!isIntroCompleted) {
    return <IntroductoryQuest onComplete={handleCompleteIntro} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex py-[20px] bg-[rgb(var(--color-dark-base))]"
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
          completedCheckpoints={completedCheckpoints}
          checkpoints={CHECKPOINTS}
          onCheckpointComplete={markCheckpointComplete}
          onModulePrev={handleModulePrev}
          onModuleNext={handleModuleNext}
          isFirstModule={currentModuleIndex === 0}
          isLastModule={currentModuleIndex === orderedModuleIds.length - 1}
        />
      </motion.div>
    </motion.div>
  );
} 