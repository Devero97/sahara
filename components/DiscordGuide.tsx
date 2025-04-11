'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';
import ServerPanel from './ServerPanel';
import GuideContent from './GuideContent';

export default function DiscordGuide() {
  const [currentStep, setCurrentStep] = useState<string>('0');
  const [activeChannel, setActiveChannel] = useState<string>('1');
  const [highestStepReachedId, setHighestStepReachedId] = useState<string>('0');
  const [isNextOnCooldown, setIsNextOnCooldown] = useState<boolean>(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [animationDirection, setAnimationDirection] = useState<number>(1); // 1: forward, -1: backward

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
    const isUnlocked = Number(highestStepReachedId) >= Number(activeChannel);
    
    if (isUnlocked && currentStep !== LAST_GUIDE_STEP_ID) { 
      if (channelToStepMap[activeChannel] && currentStep !== channelToStepMap[activeChannel]) {
          setCurrentStep(channelToStepMap[activeChannel]);
      }
    } else if (currentStep !== '0') {
        // Если активный канал заблокирован, а мы не на приветствии?
        // Возможно, стоит перейти на highestStepReachedId?
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
        />
      </motion.div>
    </motion.div>
  );
} 