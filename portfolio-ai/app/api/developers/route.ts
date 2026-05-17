import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const developers = await prisma.user.findMany({
      where: {
        role: 'DEVELOPER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            title: true,
            location: true,
            bio: true,
            githubUrl: true,
            linkedinUrl: true,
            website: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Найдено разработчиков:', developers.length)
    return NextResponse.json({ developers })
  } catch (error) {
    console.error('Ошибка загрузки разработчиков:', error)
    return NextResponse.json({ developers: [] })
  }
}