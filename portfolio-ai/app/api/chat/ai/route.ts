// app/api/chat/ai/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// 🧠 РАСШИРЕННАЯ НЕЙРОСЕТЬ (без внешних API)
// Распознаёт больше слов и даёт умные ответы

function generateSmartReply(message: string, context: string[] = []): string {
  const lowerMessage = message.toLowerCase()
  
  // --- ПРИВЕТСТВИЯ ---
  if (lowerMessage.match(/привет|здравствуй|добрый день|доброе утро|добрый вечер|хай|hello|ку|здарова/)) {
    const replies = [
      'Здравствуйте! Рад(а) видеть вас в чате!',
      'Привет! Чем могу помочь сегодня?',
      'Добрый день! Как ваши дела?',
      'Здравствуйте! Слушаю внимательно.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ВОПРОСЫ КАК ДЕЛА ---
  if (lowerMessage.match(/как дела|как жизнь|как ты|как настроение|чё как/)) {
    const replies = [
      'Отлично! Работаю над проектами. А у вас?',
      'Хорошо, спасибо! Чем могу помочь?',
      'Всё отлично, готов(а) к сотрудничеству!'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ПРОЕКТЫ И ПОРТФОЛИО ---
  if (lowerMessage.match(/проект|портфолио|работа|делаешь|разрабатываешь/)) {
    const replies = [
      'Сейчас работаю над несколькими интересными проектами. Могу показать портфолио!',
      'У меня есть проекты на React, Next.js и TypeScript. Что вас интересует?',
      'Мои проекты можно посмотреть в профиле. Там есть и бэкенд, и фронтенд.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ТЕХНОЛОГИИ (React, Next, Node и т.д.) ---
  if (lowerMessage.match(/react|next|vue|angular|javascript|typescript|js|ts/)) {
    const replies = [
      'Отлично разбираюсь в React и TypeScript! Могу помочь с проектом.',
      'Next.js — моя любимая технология. Делаю SSR, API роуты и многое другое.',
      'Да, работаю с современным стеком: React, Next.js, Node.js, Prisma.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- БЭКЕНД ---
  if (lowerMessage.match(/backend|бэкенд|сервер|node|python|django|база данных|sql|postgresql|mysql/)) {
    const replies = [
      'У меня есть опыт в бэкенд-разработке: Node.js, Express, Prisma, PostgreSQL.',
      'Могу делать и бэкенд, и фронтенд. Полный цикл разработки.',
      'Работал с базами данных, REST API, аутентификацией.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ЦЕНА И ОПЛАТА ---
  if (lowerMessage.match(/цена|стоим|деньг|оплат|сколько|бюджет/)) {
    const replies = [
      'Цена обсуждается индивидуально, зависит от объёма и сложности работы.',
      'Могу назвать примерную стоимость после уточнения деталей проекта.',
      'Давайте обсудим ваш проект, и я предложу оптимальную цену.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- СРОКИ ---
  if (lowerMessage.match(/срок|когда|быстро|долго|время|дэдлайн|дедлайн/)) {
    const replies = [
      'Сроки зависят от сложности. Обычно укладываюсь в оговорённые рамки.',
      'Могу сделать быстро, если проект небольшой. Давайте обсудим детали.',
      'Ориентировочные сроки смогу сказать после изучения задач.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ОПЫТ РАБОТЫ ---
  if (lowerMessage.match(/опыт|сколько лет|работал|проектов сделал|стаж/)) {
    const replies = [
      'У меня несколько лет опыта в веб-разработке. Делал проекты разной сложности.',
      'Много коммерческих проектов за плечами. Могу показать примеры в портфолио.',
      'Опыт позволяет решать задачи любой сложности. Работал как в команде, так и соло.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ОБРАЗОВАНИЕ ---
  if (lowerMessage.match(/учил|образование|курс|универ|институт|школа|студент/)) {
    const replies = [
      'У меня профильное IT-образование. Постоянно учусь новому.',
      'Прошёл много курсов по веб-разработке. Слежу за трендами.',
      'Самообразование — моя сильная сторона. Постоянно изучаю новые технологии.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ФРИЛАНС / РАБОТА ---
  if (lowerMessage.match(/фриланс|работ|заказ|ваканс|найм|беру заказы/)) {
    const replies = [
      'Да, я открыт(а) для новых заказов и сотрудничества!',
      'Рассматриваю интересные предложения. Расскажите о вашем проекте.',
      'Могу взяться за проект, если задачи совпадают с моими навыками.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- БЛАГОДАРНОСТИ ---
  if (lowerMessage.match(/спасиб|благодар|от души|мерси/)) {
    const replies = [
      'Пожалуйста! Всегда рад(а) помочь!',
      'Не за что! Обращайтесь ещё.',
      'Рад(а), что смог(ла) помочь!'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ДО СВИДАНИЯ ---
  if (lowerMessage.match(/пока|до свидани|увидим|прощай|бывай|удачи/)) {
    const replies = [
      'До свидания! Хорошего дня!',
      'Пока! Буду на связи.',
      'Удачи! Заходите ещё!'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ВОПРОСЫ ПРО СОБЕСЕДНИКА ---
  if (lowerMessage.match(/ты кто|расскажи о себе|кто ты|представься/)) {
    const replies = [
      'Я разработчик на платформе DevPortal. Специализируюсь на веб-технологиях.',
      'Я AI-ассистент, помогаю вести диалог. А если серьёзно — я разработчик из этого чата.',
      'Меня зовут... Давайте просто общаться! Я разработчик ищущий интересные проекты.'
    ]
    return replies[Math.floor(Math.random() * replies.length)]
  }
  
  // --- ШУТКИ ---
  if (lowerMessage.match(/шут|смешн|анекдот|ржач/)) {
    const jokes = [
      'Почему программисты не любят природу? Там слишком много багов (жуков).',
      'Что говорит программист, когда видит проблему? "Это не баг, а фича!"',
      'Сколько программистов нужно, чтобы заменить лампочку? Ни одного — это hardware проблема.'
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }
  
  // --- ДЕФОЛТНЫЕ УМНЫЕ ОТВЕТЫ ---
  const defaultReplies = [
    'Понял. Расскажите подробнее о вашем проекте?',
    'Интересно! Что ещё хотели бы узнать?',
    'Хорошо. Давайте обсудим детали?',
    'Я вас слушаю. Какие задачи стоят?',
    'Понял. Чем ещё могу помочь?'
  ]
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)]
}

// Предсказание следующих слов (расширенное)
function suggestNextWords(message: string): string[] {
  const lowerMessage = message.toLowerCase()
  
  const suggestions: { [key: string]: string[] } = {
    'привет': ['привет! чем могу помочь?', 'привет! как дела?', 'привет! давайте работать'],
    'проект': ['проект на React', 'проект на Next.js', 'проект с бэкендом'],
    'цена': ['цена обсуждаема', 'цена за час работы', 'цена за проект'],
    'срок': ['сроки выполнения', 'сроки проекта', 'сроки обсуждаемы'],
    'опыт': ['опыт работы 3 года', 'опыт в React', 'опыт в TypeScript'],
    'react': ['React + TypeScript', 'React + Next.js', 'React + Redux'],
    'работа': ['работа готова', 'работа над проектом', 'работа в команде'],
    'помощь': ['помощь с кодом', 'помощь с проектом', 'помощь с багами'],
    'телеграм': ['ссылка на Telegram', 'контакт в Telegram', '@username в Telegram']
  }
  
  for (const [key, value] of Object.entries(suggestions)) {
    if (lowerMessage.includes(key)) {
      return value
    }
  }
  
  // Умные дефолтные подсказки
  return [
    'расскажите подробнее',
    'какие технологии вас интересуют?',
    'когда планируете начать?'
  ]
}

// Анализ тональности (расширенный)
function analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
  const positive = [
    'отлично', 'хорошо', 'класс', 'супер', 'прекрасно', 'замечательно', 
    '👍', 'спасибо', 'благодарю', 'круто', 'топ', 'ого', 'вау', 'нравится'
  ]
  const negative = [
    'плохо', 'ужасно', 'не нравится', 'проблема', 'ошибка', 'баг',
    'сломалось', 'не работает', 'фигня', 'отвратительно', 'негатив'
  ]
  
  const lower = message.toLowerCase()
  
  // Проверка на позитив
  for (const word of positive) {
    if (lower.includes(word)) return 'positive'
  }
  
  // Проверка на негатив
  for (const word of negative) {
    if (lower.includes(word)) return 'negative'
  }
  
  return 'neutral'
}

// Получение эмодзи под настроение
function getEmojiBySentiment(sentiment: string): string {
  if (sentiment === 'positive') return '😊'
  if (sentiment === 'negative') return '😟'
  return '😐'
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, action, chatHistory } = await req.json()

    // Генерация умного ответа
    if (action === 'smartReply') {
      const smartReply = generateSmartReply(message, chatHistory || [])
      return NextResponse.json({ reply: smartReply })
    }
    
    // Анализ тональности
    if (action === 'analyze') {
      const sentiment = analyzeSentiment(message)
      const emoji = getEmojiBySentiment(sentiment)
      return NextResponse.json({ sentiment, emoji })
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
    const emoji = getEmojiBySentiment(sentiment)
    
    return NextResponse.json({ 
      reply: aiReply,
      sentiment,
      emoji,
      suggestions
    })
    
  } catch (error) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}