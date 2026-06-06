# 🦊 DevPortal — Платформа для разработчиков и работодателей

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8-4479a1?logo=mysql)
![NextAuth](https://img.shields.io/badge/NextAuth-5-000000?logo=next.js)

**Учебный проект**  
**Автор:** Кострыгина Виктория Александровна  
**Группа:** ИС-24, 2 курс

---

## О проекте

DevPortal — веб-сервис для связи разработчиков и работодателей. Разработчики создают портфолио с проектами, а работодатели находят специалистов через умный поиск.

**Возможности:**
- Вход через email, GitHub или Google
- Два типа аккаунтов: Разработчик и Работодатель
- Управление портфолио проектов
- AI-поиск разработчиков
- Встроенный чат
- Адаптивный дизайн

---

## Технологии

| Технология | Версия |
|------------|--------|
| Next.js | 16.2.4 |
| TypeScript | 5 |
| Prisma | 5.22.0 |
| MySQL | 8 |
| NextAuth | 5.0.0-beta |
| Framer Motion | 12.40.0 |
| React Icons | 5.6.0 |
| OpenAI | 6.39.0 |

---

dev-portal/
├── app/                        # Роутинг и страницы (App Router)
│   ├── api/                    # API-эндпоинты
│   │   ├── auth/               #   Аутентификация
│   │   ├── chat/               #   Чат
│   │   ├── developer/          #   Разработчики
│   │   └── projects/           #   Проекты
│   ├── auth/                   # Страницы аутентификации
│   │   ├── signin/             #   Вход
│   │   └── signup/             #   Регистрация
│   ├── chat/                   # Страница чата
│   ├── dashboard/              # Личный кабинет
│   ├── developers/             # Каталог разработчиков
│   ├── profile/                # Профиль пользователя
│   │   ├── create/             #   Создание профиля
│   │   └── edit/               #   Редактирование профиля
│   ├── projects/               # Проекты
│   │   ├── create/             #   Создание проекта
│   │   └── new/                #   Новый проект
│   ├── layout.tsx              # Корневой layout
│   └── page.tsx                # Главная страница
├── components/                 # UI-компоненты
├── lib/                        # Утилиты и библиотеки
├── prisma/                     # Схема и миграции БД
├── public/                     # Статические файлы
├── styles/                     # Глобальные стили
├── types/                      # TypeScript-типы
├── .env.local                  # Переменные окружения
└── package.json                # Зависимости

**Роутинг (файловая система):**

| Путь | URL |
|------|-----|
| app/page.tsx | / |
| app/auth/signin/page.tsx | /auth/signin |
| app/auth/signup/page.tsx | /auth/signup |
| app/chat/page.tsx | /chat |
| app/dashboard/page.tsx | /dashboard |
| app/developers/page.tsx | /developers |
| app/profile/page.tsx | /profile |
| app/profile/create/page.tsx | /profile/create |
| app/profile/edit/page.tsx | /profile/edit |
| app/projects/page.tsx | /projects |
| app/projects/create/page.tsx | /projects/create |
| app/projects/new/page.tsx | /projects/new |

---

### Требования

- Node.js 18+
- MySQL 8+

### Карта маршрутов

| Файл | URL | Описание |
|---------|--------|-------------|
| `app/page.tsx` | `/` | Главная страница |
| `app/auth/signin/page.tsx` | `/auth/signin` | Вход в аккаунт |
| `app/auth/signup/page.tsx` | `/auth/signup` | Регистрация |
| `app/chat/page.tsx` | `/chat` | Чат |
| `app/dashboard/page.tsx` | `/dashboard` | Личный кабинет |
| `app/developers/page.tsx` | `/developers` | Поиск разработчиков |
| `app/profile/page.tsx` | `/profile` | Просмотр профиля |
| `app/profile/create/page.tsx` | `/profile/create` | Создание профиля |
| `app/profile/edit/page.tsx` | `/profile/edit` | Редактирование профиля |
| `app/projects/page.tsx` | `/projects` | Список проектов |
| `app/projects/create/page.tsx` | `/projects/create` | Создание проекта |
| `app/projects/new/page.tsx` | `/projects/new` | Новый проект |

---

## Быстрый старт

### Предварительные требования

- **Node.js** версии 18 или выше
- **MySQL** версии 8 или выше
- **npm** или **yarn**

### Установка за 5 шагов

<table>
  <tr>
    <td align="center"><b>1</b></td>
    <td><b>Клонирование репозитория</b></td>
    <td>
    </tr>
    </table>

```bash
git clone https://github.com/Cherr-Crow/dev-portal.git
cd dev-portal
npm install
Настройка окружения
Создай .env.local:

env
DATABASE_URL="mysql://user:password@localhost:3306/devportal"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="сгенерируй-ключ"
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
OPENAI_API_KEY="sk-..."

База данных
bash
npx prisma db push
npm run seed

Запуск
bash
npm run dev
Открой http://localhost:3000

Скрипты
Команда	Описание
npm run dev	Разработка
npm run build	Сборка
npm start	Запуск
npm run lint	Линтинг
npm run seed	Тестовые данные
AI-поиск
┌─────────────────────────┐
│     Пользовательский    │
│     запрос              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     /api/developer/     │
│     search?mode=smart   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     OpenAI создаёт      │
│     эмбеддинг запроса   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     Поиск ближайших     │
│     разработчиков       │
│     по эмбеддингам      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     Сортировка по       │
│     релевантности       │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     Результат           │
│     пользователю        │
└─────────────────────────┘

Режимы:

Умный (AI) — с ранжированием

Точный — текстовый поиск

### Типы аккаунтов
Разработчик:

Портфолио

Проекты

Чат

Работодатель:

Поиск

Просмотр

Сообщения

Зависимости
json
{
  "next": "16.2.4",
  "next-auth": "^5.0.0-beta.31",
  "prisma": "^5.22.0",
  "openai": "^6.39.0",
  "framer-motion": "^12.40.0",
  "react-icons": "^5.6.0",
  "bcryptjs": "^3.0.3",
  "natural": "^8.1.1"
}

<div align="center"> <sub>© 2026 Кострыгина В.А. | Учебный проект</sub> </div> ```