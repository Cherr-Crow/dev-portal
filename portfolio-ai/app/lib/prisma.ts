// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Определяем URL для базы данных в зависимости от окружения
const isVercel = process.env.VERCEL === '1'
const databaseUrl = isVercel 
  ? 'file:/tmp/dev.db'  // На Vercel используем /tmp директорию
  : 'file:./prisma/dev.db'  // Локально используем папку prisma

// Создаем экземпляр PrismaClient с правильным URL
const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

export const prisma = globalForPrisma.prisma ?? prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma