# 🦊 DevPortal — Платформа для разработчиков и работодателей

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)

> **Учебный проект**  
> **Автор:** Кострыгина Виктория Александровна  
> **Группа:** ИС-24, 2 курс

---

## О проекте

**DevPortal** — веб-сервис, объединяющий разработчиков и работодателей. Разработчики публикуют свои проекты и формируют портфолио, а работодатели просматривают работы и находят исполнителей.

### Основные возможности

- Вход через GitHub, Google или email
- Два типа аккаунтов: Разработчик и Работодатель
- Создание и управление портфолио проектов
- Поиск разработчиков по имени, должности и локации
- Встроенный чат для общения
- Полная адаптивность под все устройства

---

## 🛠 Технологии

| Технология | Назначение |
|------------|------------|
| Next.js 15 | Фреймворк (App Router) |
| TypeScript | Типизация |
| Prisma | ORM для базы данных |
| SQLite | База данных |
| NextAuth.js | Аутентификация |
| CSS Modules | Стилизация |

---

## Быстрый старт

### Требования

- Node.js 18+
- SQLite (локально или облачная)
- Аккаунты GitHub/Google для OAuth (опционально)

### 1. Клонирование и установка

```bash
git clone https://github.com/Cherr-Crow/dev-portal.git
cd dev-portal portfolio ai
npm install
npm run dev