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

---

### Роутинг (файловая система):


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


## 🚀 Быстрый старт

### Требования
- Node.js 18+
- MySQL 8+
- npm или yarn

### Установка

```bash
# 1. Клонирование
git clone https://github.com/Cherr-Crow/dev-portal.git
cd dev-portal

# 2. Установка зависимостей
npm install

# 3. Настройка окружения
# Создайте файл .env.local:

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

