'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';
import React from 'react';

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
  activeChannel: string;
  onChannelChange: (channelId: string) => void;
  highestStepReachedId: string;
}

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

function ServerPanelComponent({ activeChannel, onChannelChange, highestStepReachedId }: ServerPanelProps) {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);
  const tCategories = useTranslations('ServerPanel.categories');
  const tChannels = useTranslations('ServerPanel.channels');

  const visibleCategories = categories.filter(category => 
      category.id !== '3' || (category.id === '3' && Number(highestStepReachedId) >= 5)
  );

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
                
                return (
                  <motion.button
                    key={channel.id}
                    onHoverStart={() => !isLocked && setHoveredChannel(channel.id)}
                    onHoverEnd={() => setHoveredChannel(null)}
                    whileTap={isClickable ? { scale: 0.98 } : {}}
                    disabled={!isClickable}
                    className={`w-full text-left px-2 py-1.5 rounded transition-all duration-200 flex items-center justify-between ${
                      activeChannel === channel.id && !isLocked
                        ? 'bg-[rgb(var(--color-dark-card))] shadow-lg'
                        : hoveredChannel === channel.id && !isLocked
                        ? 'bg-[rgb(var(--color-dark-card-hover))]'
                        : ''
                    } ${
                      !isClickable ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() => {if (isClickable) onChannelChange(channel.id)}}
                  >
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className={`${
                          activeChannel === channel.id && !isLocked
                            ? 'text-[rgb(var(--color-accent-yellow))]'
                            : isLocked
                            ? 'text-muted-foreground/50'
                            : 'text-[rgb(var(--color-text-secondary))]/'
                        }`}
                        whileHover={isLocked ? {} : { scale: 1.1 }}
                      >
                        {channel.type === 'text' ? '#' : '🔊'}
                      </motion.span>
                      <span
                        className={`transition-colors duration-200 ${
                          activeChannel === channel.id && !isLocked
                            ? 'text-[rgb(var(--color-text-primary))] font-medium'
                            : isLocked
                            ? 'text-muted-foreground/50'
                            : 'text-[rgb(var(--color-text-secondary))]'
                        }`}
                      >
                        {tChannels(channel.id)}
                      </span>
                    </div>
                    
                    {isLocked && (
                      <Lock className="w-4 h-4 text-muted-foreground/50 ml-auto" />
                    )}
                  </motion.button>
                );
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