import { Section } from '@/components/GuideContent';

export const guideContent: Section[] = [
  {
    id: 'introduction',
    title: 'Введение',
    type: 'content',
    data: {
      title: 'Добро пожаловать в Sahara AI',
      content: 'Sahara AI - это уникальное сообщество, объединяющее энтузиастов искусственного интеллекта, разработчиков и исследователей. Наш сервер предлагает широкий спектр возможностей для обучения, общения и развития в сфере AI.',
      media: {
        type: 'image',
        src: '/images/server-preview.png',
        alt: 'Главная страница сервера Sahara AI',
        caption: 'Интерфейс главной страницы сервера'
      }
    }
  },
  {
    id: 'roles',
    title: 'Система ролей',
    type: 'content',
    data: {
      title: 'Роли и их преимущества',
      content: 'На сервере действует система ролей, которая отражает ваш прогресс и активность. Каждая роль открывает новые возможности и привилегии.',
      media: {
        type: 'infographic',
        src: '/images/roles-scheme.svg',
        alt: 'Схема развития ролей',
        caption: 'Путь развития от новичка до эксперта'
      }
    }
  },
  {
    id: 'faq',
    title: 'Часто задаваемые вопросы',
    type: 'faq',
    data: {
      title: 'FAQ',
      items: [
        {
          question: 'Как начать зарабатывать XP?',
          answer: 'Для начала заработка XP вам нужно быть активным на сервере: участвовать в обсуждениях, помогать другим участникам и выполнять задания.'
        },
        {
          question: 'Какие преимущества дают роли?',
          answer: 'Роли открывают доступ к специальным каналам, дают возможность участвовать в закрытых мероприятиях и получать эксклюзивные награды.'
        }
      ]
    }
  },
  {
    id: 'rules',
    title: 'Правила сервера',
    type: 'rules',
    data: {
      title: 'Основные правила',
      rules: [
        {
          text: 'Уважайте других участников и их мнение',
          type: 'allowed'
        },
        {
          text: 'Запрещено спамить и флудить',
          type: 'prohibited'
        },
        {
          text: 'Соблюдайте тематику каналов',
          type: 'warning'
        }
      ]
    }
  },
  {
    id: 'contact',
    title: 'Контактная информация',
    type: 'contact',
    data: {
      title: 'Свяжитесь с нами',
      contacts: [
        {
          type: 'discord',
          label: 'Discord сервер',
          value: 'discord.gg/sahara-ai',
          description: 'Присоединяйтесь к нашему сообществу'
        },
        {
          type: 'email',
          label: 'Электронная почта',
          value: 'support@sahara-ai.com',
          description: 'По всем вопросам поддержки'
        },
        {
          type: 'support',
          label: 'Техническая поддержка',
          value: '#support',
          description: 'Канал для решения технических проблем'
        }
      ]
    }
  }
]; 