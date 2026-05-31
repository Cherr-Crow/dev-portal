import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const results: any = {}
  
  // 1. Проверяем переменную окружения
  results.dbUrlExists = !!process.env.DATABASE_URL
  results.dbUrlStart = process.env.DATABASE_URL?.substring(0, 60)
  
  // 2. Пробуем подключиться
  try {
    const prisma = new PrismaClient()
    await prisma.$connect()
    results.connect = '✅ Connected'
    
    // 3. Пробуем сделать запрос
    const count = await prisma.user.count()
    results.userCount = count
    
    await prisma.$disconnect()
  } catch (error: any) {
    results.error = error.message
    results.stack = error.stack?.substring(0, 300)
  }
  
  return NextResponse.json(results)
}