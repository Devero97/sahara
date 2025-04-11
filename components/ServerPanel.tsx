'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Lock, CheckCircle, HelpCircle, Hash, Mic } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  category: string;
}

interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

interface ServerPanelProps {
  activeChannel: string | null;
  onChannelChange: (channelId: string) => void;
  highestStepReachedId: string;
  completedCheckpoints: Set<string>;
  onCheckpointComplete: (checkpointId: string) => void;
}

interface CheckpointData {
  id: string; 
  channelId: string; 
  triggerStepId: string; 
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
}

const CHECKPOINTS: CheckpointData[] = [
  { id: 'rules-check-1', channelId: '2', triggerStepId: '2', question: 'Можно ли использовать Caps Lock в сообщениях?', options: [ { id: 'o1', text: 'Да, всегда', isCorrect: false }, { id: 'o2', text: 'Только для выделения', isCorrect: true }, { id: 'o3', text: 'Никогда', isCorrect: false }, ], explanation: 'Используйте Caps Lock умеренно.'}, 
  { id: 'voice-check-1', channelId: '3', triggerStepId: '3', question: 'Какой режим микрофона рекомендуют?', options: [ { id: 'o1', text: 'Push-to-talk', isCorrect: true }, { id: 'o2', text: 'Активация по голосу', isCorrect: false }, ], }, 
  { id: 'music-check-1', channelId: '4', triggerStepId: '4', question: 'Команда !play используется для...', options: [ { id: 'o1', text: 'Паузы', isCorrect: false }, { id: 'o2', text: 'Воспроизведения', isCorrect: true }, { id: 'o3', text: 'Пропуска трека', isCorrect: false }, ], },
];

const categories: Category[] = [
  {
    id: '1',
    name: 'Основные каналы',
    channels: [
      { id: '1', name: 'общие', type: 'text', category: 'Основные каналы' },
      { id: '2', name: 'правила', type: 'text', category: 'Основные каналы' },
    ],
  },
  {
    id: '2',
    name: 'Голосовые каналы',
    channels: [
      { id: '3', name: 'Общий', type: 'voice', category: 'Голосовые каналы' },
      { id: '4', name: 'Музыка', type: 'voice', category: 'Голосовые каналы' },
    ],
  },
  {
    id: '3',
    name: 'Завершение',
    channels: [
      { id: '5', name: 'итоги', type: 'text', category: 'Завершение' },
    ],
  },
];

const CheckpointPopoverContent: React.FC<{ 
  checkpoint: CheckpointData;
  onComplete: () => void;
}> = ({ checkpoint, onComplete }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = (optionId: string) => {
    setSelectedOptionId(optionId);
    const correct = checkpoint.options.find(o => o.id === optionId)?.isCorrect ?? false;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      onComplete(); 
    }
  };

  return (
    <div className="p-4 w-64">
      <p className="text-sm font-medium mb-3 text-foreground">{checkpoint.question}</p>
      <div className="space-y-2">
        {checkpoint.options.map(option => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            className={cn(
                "w-full justify-start",
                showResult && selectedOptionId === option.id && !isCorrect && "border-red-500 text-red-500",
                showResult && option.isCorrect && "border-green-500 text-green-500"
            )}
            onClick={() => !showResult && handleAnswer(option.id)}
            disabled={showResult}
          >
            {option.text}
          </Button>
        ))}
      </div>
      {showResult && (
        <div className={`mt-3 text-xs ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? 'Верно!' : 'Неверно.'} {checkpoint.explanation}
        </div>
      )}
    </div>
  );
};

function ServerPanelComponent({ 
  activeChannel, 
  onChannelChange, 
  highestStepReachedId, 
  completedCheckpoints, 
  onCheckpointComplete 
}: ServerPanelProps) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const tCategories = useTranslations('ServerPanel.categories');
  const tChannels = useTranslations('ServerPanel.channels');

  const visibleCategories = categories.filter(category => 
      category.id !== '3' || (category.id === '3' && Number(highestStepReachedId) >= 5)
  );

  const renderChannel = (channel: Channel, isLocked: boolean) => {
    const isActive = activeChannel !== null && channel.id === activeChannel;
    const isHovered = channel.id === hoveredChannel;
    const Icon = channel.type === 'text' ? Hash : Mic;
    
    const checkpoint = CHECKPOINTS.find(cp => cp.channelId === channel.id);
    const isCheckpointVisible = checkpoint && Number(highestStepReachedId) >= Number(checkpoint.triggerStepId);
    const isCheckpointCompleted = checkpoint && completedCheckpoints.has(checkpoint.id);

    return (
      <motion.div
        key={channel.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "flex items-center justify-between p-2 mx-2 rounded cursor-pointer transition-colors duration-150",
          isActive ? 'bg-[rgb(var(--color-dark-card))] shadow-lg'
            : isHovered ? 'bg-[rgb(var(--color-dark-card-hover))]'
            : '',
          !isLocked ? 'cursor-pointer' : 'cursor-not-allowed'
        )}
        onClick={() => !isLocked && onChannelChange(channel.id)}
        onMouseEnter={() => setHoveredChannel(channel.id)}
        onMouseLeave={() => setHoveredChannel(null)}
      >
        <div className="flex items-center">
          {isLocked ? (
            <Lock className="h-4 w-4 mr-2 text-gray-500" />
          ) : (
            <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-gray-400'}`} />
          )}
          <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-300'} ${isLocked ? 'text-gray-500' : ''}`}>
            {tChannels(channel.id) || channel.name}
          </span>
        </div>

        {isCheckpointVisible && !isLocked && (
          <Popover>
            <PopoverTrigger asChild>
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-0.5 rounded-full ${isCheckpointCompleted ? 'bg-green-500/70' : 'bg-blue-500/70 hover:bg-blue-400/70'} cursor-pointer`}
              >
                {isCheckpointCompleted ? (
                  <CheckCircle size={14} className="text-white"/>
                ) : (
                  <HelpCircle size={14} className="text-white"/>
                )}
              </motion.div>
            </PopoverTrigger>
            {!isCheckpointCompleted && checkpoint && (
              <PopoverContent side="right" align="start" className="p-0 bg-background border-border">
                 <CheckpointPopoverContent 
                    checkpoint={checkpoint} 
                    onComplete={() => onCheckpointComplete(checkpoint.id)} 
                  />
              </PopoverContent>
            )}
          </Popover>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 mr-3 flex items-start "
    >
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {visibleCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4"
            >
              {category.id !== '3' && (
                <motion.div 
                  className="px-2 py-1"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-[rgb(var(--color-text-muted))] text-xs font-semibold uppercase tracking-wider">
                    {tCategories(category.id)}
                  </span>
                </motion.div>
              )}

              {category.channels.map((channel) => {
                const isLocked = Number(highestStepReachedId) < Number(channel.id);
                const isClickable = !isLocked;
                
                return renderChannel(channel, isLocked);
              })}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const ServerPanel = React.memo(ServerPanelComponent);
export default ServerPanel; 