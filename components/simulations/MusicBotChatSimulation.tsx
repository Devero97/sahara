'use client';

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button'; 
import { Terminal } from 'lucide-react';

const ChatMessage = ({ author, children }: { author: string; children: React.ReactNode }) => (
  <div className="mb-3 text-sm">
    <span className="font-semibold text-[rgb(var(--color-text-primary))] mr-2">{author}:</span>
    <span className="text-[rgb(var(--color-text-secondary))]">{children}</span>
  </div>
);

const ClickableCommand = ({ command, explanation }: { command: string; explanation: string }) => (
  <Popover>
    <PopoverTrigger asChild>
      <code className="bg-[rgba(var(--color-primary-rgb),0.1)] text-[rgb(var(--color-primary))] px-1.5 py-0.5 rounded cursor-pointer hover:bg-[rgba(var(--color-primary-rgb),0.2)] transition-colors">
        {command}
      </code>
    </PopoverTrigger>
    <PopoverContent side="top" className="text-sm w-auto max-w-xs p-3">
      {explanation}
    </PopoverContent>
  </Popover>
);

export default function MusicBotChatSimulation() {
  return (
    <div className="bg-[rgb(var(--color-dark-base))] p-4 rounded-lg my-6 shadow-inner border border-[rgb(var(--color-separator))]">
       <h4 className="text-base font-semibold text-[rgb(var(--color-text-primary))] mb-4 border-b border-[rgb(var(--color-separator))] pb-2">
        <Terminal className="inline h-4 w-4 mr-2 align-text-bottom"/>
        Симуляция чата с музыкальным ботом
      </h4>
      <div className="max-h-60 overflow-y-auto pr-2"> 
          <ChatMessage author="User123">
              Привет! Как включить музыку?
          </ChatMessage>
          <ChatMessage author="HelpfulBot">
              Привет! Используй команду{' '}
              <ClickableCommand
                  command="!play [ссылка или название]"
                  explanation="Эта команда добавит трек по ссылке (YouTube, Spotify...) или найдет его по названию и начнет воспроизведение."
              />
              .
          </ChatMessage>
          <ChatMessage author="User123">
              Ок, спасибо! Попробую: <ClickableCommand command="!play https://www.youtube.com/watch?v=dQw4w9WgXcQ" explanation="Нажатие на команду покажет это объяснение. В реальном Discord бот начнет воспроизведение."/>
          </ChatMessage>
           <ChatMessage author="MusicBot">
              ▶️ Начинаю воспроизведение: Rick Astley - Never Gonna Give You Up
          </ChatMessage>
           <ChatMessage author="User456">
             А как поставить на паузу?
          </ChatMessage>
           <ChatMessage author="HelpfulBot">
              Для паузы используй <ClickableCommand command="!pause" explanation="Эта команда приостановит воспроизведение текущего трека."/>.
          </ChatMessage>
      </div>
       {/* Input simulation can be added later */}
    </div>
  );
} 