'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import ServerPanel from './ServerPanel';
import GuideContent from './GuideContent';
import { toast } from "sonner";

// ДАННЫЕ О НАГРАДАХ (Временно здесь, лучше вынести)
// -------------------------------------------------
const MILESTONE_STEPS: Record<string, string> = {
  '2': 'section-1-complete', // Шаг 2 завершает раздел 1
  '4': 'section-2-complete', // Шаг 4 завершает раздел 2
};
interface MilestoneReward {
  id: string;
  title: string; 
  backgroundClass: string; 
}
const MILESTONE_REWARDS: Record<string, MilestoneReward> = {
  'section-1-complete': {
    id: 'section-1-complete',
    title: 'Бронзовый Новичок',
    backgroundClass: 'bg-gradient-to-br from-yellow-900/20 via-yellow-800/10 to-yellow-900/20 border border-yellow-700/30',
  },
  'section-2-complete': {
    id: 'section-2-complete',
    title: 'Серебряный Исследователь',
    backgroundClass: 'bg-gradient-to-br from-slate-600/20 via-slate-500/10 to-slate-600/20 border border-slate-500/30',
  },
};
// -------------------------------------------------

export default function DiscordGuide() {
  const [currentStep, setCurrentStep] = useState<string>('0');
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [highestStepReachedId, setHighestStepReachedId] = useState<string>('0');
  const [isNextOnCooldown, setIsNextOnCooldown] = useState<boolean>(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [animationDirection, setAnimationDirection] = useState<number>(1); // 1: forward, -1: backward

  // Состояние для отслеживания завершенных этапов (milestones)
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set());
  
  // Состояние для чекпоинтов знаний
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<string>>(new Set());

  const COOLDOWN_DURATION = 1500;
  const LAST_GUIDE_STEP_ID = '5';
  const LAST_VISIBLE_PROGRESS_STEP = 5;

  const channelToStepMap: Record<string, string> = {
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  };
  const stepToChannelMap: Record<string, string> = {
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  };

  useEffect(() => {
    if (!activeChannel) return;
    
    const isUnlocked = Number(highestStepReachedId) >= Number(activeChannel);
    
    if (isUnlocked && currentStep !== LAST_GUIDE_STEP_ID) { 
      if (channelToStepMap[activeChannel] && currentStep !== channelToStepMap[activeChannel]) {
          setCurrentStep(channelToStepMap[activeChannel]);
      }
    } else if (currentStep !== '0') {
        const highestAvailableStep = String(highestStepReachedId);
        if (currentStep !== highestAvailableStep) {
            //setCurrentStep(highestAvailableStep);
        }
    }
  }, [activeChannel, highestStepReachedId, currentStep]);

  const handleStepChange = (stepId: string) => {
    console.log("DiscordGuide: handleStepChange received stepId:", stepId);
    
    const newStepNum = Number(stepId);
    const currentStepNum = Number(currentStep);

    // Определяем и устанавливаем направление АНИМАЦИИ перед обновлением шага
    if (newStepNum > currentStepNum) {
      setAnimationDirection(1);
    } else if (newStepNum < currentStepNum) {
      setAnimationDirection(-1);
    } // Если шаги равны, направление не меняем
    
    const isForwardStep = newStepNum > currentStepNum && stepId !== '0'; // Переход вперед, но не на шаг 0
    const isNewHighest = newStepNum > Number(highestStepReachedId);

    // Обновляем highestStepReachedId ЗДЕСЬ по общему правилу
    if (isNewHighest) {
        setHighestStepReachedId(stepId);

        // Проверяем, завершает ли этот шаг какой-либо этап
        const milestoneId = MILESTONE_STEPS[stepId]; // Используем MILESTONE_STEPS
        if (milestoneId && !completedMilestones.has(milestoneId)) {
          console.log("Milestone reached:", milestoneId);
          const newMilestones = new Set(completedMilestones).add(milestoneId);
          setCompletedMilestones(newMilestones);
          
          // Показываем уведомление о достижении
          const reward = MILESTONE_REWARDS[milestoneId];
          if (reward) {
            toast.success(`Этап пройден: ${reward.title}!`, {
              description: `Фон гайда обновлен.`, // Можно добавить описание
              duration: 4000, // Длительность показа в мс
            });
          }
        }
    }

    // Обновляем текущий шаг
    setCurrentStep(stepId);

    // Ищем соответствующий канал для НОВОГО шага
    const nextChannelId = stepToChannelMap[stepId];
    if (nextChannelId && activeChannel !== nextChannelId) {
        setActiveChannel(nextChannelId);
    }

    // Обрабатываем кулдаун по общему правилу для НОВОГО максимального шага,
    // но НЕ для перехода на последний шаг
    if (isForwardStep && isNewHighest && stepId !== '1' && stepId !== LAST_GUIDE_STEP_ID) {
      console.log("SETTING COOLDOWN: true");
      setIsNextOnCooldown(true);
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
      cooldownTimerRef.current = setTimeout(() => {
        setIsNextOnCooldown(false);
        cooldownTimerRef.current = null; 
      }, COOLDOWN_DURATION);
    }
  };

  // Очистка таймера при размонтировании компонента
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  const handleChannelChange = (channelId: string) => {
    const isUnlocked = Number(highestStepReachedId) >= Number(channelId);
    if (isUnlocked) {
      // Убрана проверка channelId !== '5'
      if(channelToStepMap[channelId] && currentStep !== channelToStepMap[channelId]){
          setCurrentStep(channelToStepMap[channelId]);
      }
      // Убрана проверка channelId !== '5'
      if(activeChannel !== channelId){
          setActiveChannel(channelId); 
      }
    }
  };

  const handleStepAnimationComplete = (stepId: string) => {
    // Упрощено: убрана вся логика, связанная с highestStepReachedId и кулдауном для LAST_GUIDE_STEP_ID.
    // Таймер из handleStepChange сам снимет кулдаун.
    // console.log("Animation complete for step:", stepId);
  };

  // Функция для отметки чекпоинта как пройденного
  const markCheckpointComplete = (checkpointId: string) => {
    setCompletedCheckpoints(prev => new Set(prev).add(checkpointId));
    // Можно добавить toast или другой фидбек
    toast.info(`Чекпоинт "${checkpointId}" пройден!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex py-[20px]  bg-[rgb(var(--color-dark-base))]"
    >
      <ServerPanel 
        activeChannel={activeChannel} 
        onChannelChange={handleChannelChange} 
        highestStepReachedId={highestStepReachedId}
        // Передаем состояние и обработчик для чекпоинтов
        completedCheckpoints={completedCheckpoints}
        onCheckpointComplete={markCheckpointComplete}
      />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 h-[calc(100dvh-120px)]"
      >
        <GuideContent 
          currentStep={currentStep} 
          onStepChange={handleStepChange} 
          onStepAnimationComplete={handleStepAnimationComplete}
          isNextOnCooldown={isNextOnCooldown}
          animationDirection={animationDirection}
          completedMilestones={completedMilestones} // Оставляем для наград
        />
      </motion.div>
    </motion.div>
  );
} 