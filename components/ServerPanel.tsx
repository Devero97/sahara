'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  Hash, // Оставляем на всякий случай
  DoorOpen, Info, Users, TrendingUp, Coins, ShoppingCart, TerminalSquare,
  Calendar, Brush, MessageSquare, Ticket, ShieldCheck, Newspaper, LayoutList,
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface Module {
  id: string;
  nameKey: string;
  category: string;
  icon: React.ElementType; // Тип для React компонента
}

interface Category {
  id: string;
  nameKey: string;
  modules: Module[];
}

export const categories: Category[] = [
  // Категория 1: Введение
  {
    id: 'cat_intro', nameKey: 'cat_intro',
    modules: [
      { id: 'm1', nameKey: 'm1_nav', category: 'cat_intro', icon: DoorOpen },
      { id: 'm2', nameKey: 'm2_nav', category: 'cat_intro', icon: Info },
      { id: 'm3', nameKey: 'm3_nav', category: 'cat_intro', icon: Users },
    ],
  },
  // Категория 2: Прогресс
  {
    id: 'cat_progress', nameKey: 'cat_progress',
    modules: [
      { id: 'm4', nameKey: 'm4_nav', category: 'cat_progress', icon: TrendingUp },
      { id: 'm5', nameKey: 'm5_nav', category: 'cat_progress', icon: Coins },
      { id: 'm6', nameKey: 'm6_nav', category: 'cat_progress', icon: TerminalSquare }, // Или ShoppingCart
    ],
  },
  // Категория 3: Активности
  {
    id: 'cat_activities', nameKey: 'cat_activities',
    modules: [
      { id: 'm7', nameKey: 'm7_nav', category: 'cat_activities', icon: Calendar },
      { id: 'm8', nameKey: 'm8_nav', category: 'cat_activities', icon: Brush },
      { id: 'm9', nameKey: 'm9_nav', category: 'cat_activities', icon: MessageSquare },
      { id: 'm10', nameKey: 'm10_nav', category: 'cat_activities', icon: Ticket },
    ],
  },
    // Категория 4: Информация
  {
    id: 'cat_info', nameKey: 'cat_info',
    modules: [
      { id: 'm11', nameKey: 'm11_nav', category: 'cat_info', icon: ShieldCheck },
      { id: 'm12', nameKey: 'm12_nav', category: 'cat_info', icon: Newspaper },
      { id: 'm13', nameKey: 'm13_nav', category: 'cat_info', icon: LayoutList },
    ],
  },
];

interface ServerPanelProps {
  activeModuleId: string | null;
  onModuleChange: (moduleId: string) => void;
}

function ServerPanelComponent({ 
  activeModuleId, 
  onModuleChange, 
}: ServerPanelProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const t = useTranslations('GuideNav');

  const visibleCategories = categories;

  const renderModule = (module: Module) => {
    const isActive = activeModuleId !== null && module.id === activeModuleId;
    const isHovered = module.id === hoveredModule;
    // Динамически выбираем иконку из данных модуля
    const Icon = module.icon || Hash; // Используем иконку модуля или Hash как fallback
    
    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "flex items-center justify-between p-2 mx-2 rounded cursor-pointer transition-colors duration-150 relative",
          isActive ? 'bg-[rgb(var(--color-dark-card))] shadow-lg'
            : isHovered ? 'bg-[rgb(var(--color-dark-card-hover))]'
            : '',
        )}
        onClick={() => onModuleChange(module.id)}
        onMouseEnter={() => setHoveredModule(module.id)}
        onMouseLeave={() => setHoveredModule(null)}
        style={{ marginBottom: '4px' }} 
      >
        <div className="flex items-center">
          {/* Используем выбранную иконку */} 
          <Icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-gray-400'}`} />
          <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
            {t(module.nameKey)}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 mr-3 flex items-start"
    >
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence>
          {visibleCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4 relative"
            >
              <motion.div 
                className="px-2 py-1 mb-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-[rgb(var(--color-text-muted))] text-xs font-semibold uppercase tracking-wider">
                  {t(category.nameKey)}
                </span>
              </motion.div>

              <div>
                {category.modules.map((module) => {
                  return renderModule(module); 
                })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const ServerPanel = React.memo(ServerPanelComponent);
export default ServerPanel; 