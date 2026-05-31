import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const logs: string[] = []
  
  try {
    logs.push('1. Начало диагностики')
    logs.push(`2. DATABASE_URL: ${process.env.DATABASE_URL ? '✅ есть' : '❌ нет'}`)
    
    const prisma = new PrismaClient()
    logs.push('3. PrismaClient создан')
    
    await prisma.$connect()
    logs.push('4. ✅ Подключение к БД успешно')
    
    const count = await prisma.user.count()
    logs.push(`5. ✅ В БД ${count} пользователей`)
    
    await prisma.$disconnect()
    
    return NextResponse.json({ success: true, logs })
    
  } catch (error: any) {
    logs.push(`❌ ОШИБКА: ${error.message}`)
    return NextResponse.json({ success: false, logs }, { status: 500 })
  }
}