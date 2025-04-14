'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from 'next-intl';

// Интерфейс для опции ответа
interface CheckpointOption {
  id: string;
  textKey: string; // Ключ для перевода текста опции
  isCorrect: boolean;
}

// Обновленный интерфейс данных для чекпоинта
export interface CheckpointData {
  id: string; 
  moduleId: string; // Переименовали channelId в moduleId
  questionKey: string; // Ключ для перевода вопроса
  options: CheckpointOption[]; // Используем новый интерфейс для опций
  explanationKey?: string; // Ключ для перевода пояснения (необязательно)
}

interface CheckpointPopoverContentProps {
  checkpoint: CheckpointData;
  onComplete: () => void; 
}

export const CheckpointPopoverContent: React.FC<CheckpointPopoverContentProps> = ({ checkpoint, onComplete }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const tCheckpoints = useTranslations('Checkpoints'); // Неймспейс для переводов чекпоинтов

  const handleAnswer = (optionId: string) => {
    setSelectedOptionId(optionId);
    const correct = checkpoint.options.find(o => o.id === optionId)?.isCorrect ?? false;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      // Даем небольшую задержку перед закрытием, чтобы пользователь увидел результат
      setTimeout(onComplete, 500); 
    }
  };

  const questionText = tCheckpoints(checkpoint.questionKey);
  const explanationText = checkpoint.explanationKey ? tCheckpoints(checkpoint.explanationKey) : '';

  return (
    <div className="p-4 w-64">
      <p className="text-sm font-medium mb-3 text-foreground">{questionText}</p>
      <div className="space-y-2">
        {checkpoint.options.map(option => (
          <Button
            key={option.id}
            variant="outline"
            size="sm"
            className={cn(
                "w-full justify-start text-left h-auto whitespace-normal",
                showResult && selectedOptionId === option.id && !isCorrect && "border-red-500 text-red-500 hover:bg-red-500/10", // Стиль для неверного выбранного
                showResult && option.isCorrect && "border-green-500 text-green-500 hover:bg-green-500/10", // Стиль для верного
                showResult && selectedOptionId !== option.id && option.isCorrect && "border-green-500/50" // Подсвечиваем правильный, если выбрали неверный
            )}
            onClick={() => !showResult && handleAnswer(option.id)}
            disabled={showResult}
          >
            {/* Получаем перевод текста опции */} 
            {tCheckpoints(option.textKey)} 
          </Button>
        ))}
      </div>
      {showResult && (
        <div className={`mt-3 text-xs font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
          {isCorrect ? tCheckpoints('correct') : tCheckpoints('incorrect')}{' '}
          {explanationText && <span className="text-muted-foreground font-normal">{explanationText}</span>}
        </div>
      )}
    </div>
  );
}; 