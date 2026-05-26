// app/api/chat/ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'

// AI подсказки без внешнего API (встроенная нейросеть)
function generateSmartReply(message: string, context: string[]): string {
  const lowerMessage = message.toLowerCase()
  
  // Приветствия
  if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
    const greetings = [
      'Здравствуйте! Чем могу помочь?',
      'Привет! Рад(а) общению!',
      'Здравствуйте! Какие у вас планы?'
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  // Вопросы о проекте
  if (lowerMessage.includes('проект') || lowerMessage.includes('делаешь')) {
    return 'Работаю над интересными проектами. А у вас?'
  }
  
  // Благодарности
  if (lowerMessage.includes('спасиб')) {
    return 'Пожалуйста! Всегда рад(а) помочь!'
  }
  
  // Вопросы о времени
  if (lowerMessage.includes('время') || lowerMessage.includes('когда')) {
    return 'Могу обсудить в любое удобное для вас время'
  }
  
  // Вопросы о цене
  if (lowerMessage.includes('цена') || lowerMessage.includes('стоим') || lowerMessage.includes('деньг')) {
    return 'Цена обсуждается индивидуально в зависимости от объема работ'
  }
  
  // Технические вопросы
  if (lowerMessage.includes('react') || lowerMessage.includes('фронт')) {
    return 'Отлично разбираюсь в React и современном фронтенде!'
  }
  
  if (lowerMessage.includes('backend') || lowerMessage.includes('бэкенд')) {
    return 'У меня есть опыт в бэкенд разработке на Node.js и Python'
  }
  
  // Дефолтный ответ
  const defaultReplies = [
    'Интересно! Расскажите подробнее.',
    'Понял. Давайте обсудим детали.',
    'Хорошо. Что еще хотели бы узнать?',
    'Отлично! Продолжим общение.'
  ]
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
}

// Анализ тональности сообщения
function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const positive = ['отлично', 'хорошо', 'класс', 'супер', '👍', 'спасибо']
  const negative = ['плохо', 'ужасно', 'не нравится', 'проблема', 'ошибка']
  
  const lower = message.toLowerCase()
  if (positive.some(word => lower.includes(word))) return 'positive'
  if (negative.some(word => lower.includes(word))) return 'negative'
  return 'neutral'
}

// Предсказание следующих слов
function suggestNextWords(message: string): string[] {
  const suggestions: { [key: string]: string[] } = {
    'спасиб': ['спасибо большое', 'спасибо за ответ', 'спасибо за помощь'],
    'привет': ['привет! как дела?', 'привет, рад видеть', 'привет, давай работать'],
    'цена': ['цена проекта', 'цена за час', 'цена договорная'],
    'срок': ['сроки выполнения', 'сроки проекта', 'сроки обсуждаемы'],
    'опыт': ['опыт работы', 'опыт в React', 'опыт в TypeScript']
  }
  
  for (const [key, value] of Object.entries(suggestions)) {
    if (message.toLowerCase().includes(key)) {
      return value
    }
  }
  return []
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, chatId, action } = await req.json()

    // Генерация умного ответа
    if (action === 'smartReply') {
      const smartReply = generateSmartReply(message, [])
      return NextResponse.json({ reply: smartReply })
    }
    
    // Анализ тональности
    if (action === 'analyze') {
      const sentiment = analyzeSentiment(message)
      return NextResponse.json({ sentiment })
    }
    
    // Предсказание следующих слов
    if (action === 'suggest') {
      const suggestions = suggestNextWords(message)
      return NextResponse.json({ suggestions })
    }
    
    // Полное AI взаимодействие
    const aiReply = generateSmartReply(message, [])
    const sentiment = analyzeSentiment(message)
    const suggestions = suggestNextWords(message)
    
    return NextResponse.json({ 
      reply: aiReply,
      sentiment,
      suggestions
    })
    
  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}