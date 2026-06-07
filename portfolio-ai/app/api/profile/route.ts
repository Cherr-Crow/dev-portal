import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, bio, location, githubUrl, linkedinUrl, website } = body

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "Профиль уже существует" },
        { status: 400 }
      )
    }

    const profile = await prisma.profile.create({
      data: {
        title: title || "",
        bio: bio || "",
        location: location || "",
        githubUrl: githubUrl || "",
        linkedinUrl: linkedinUrl || "",
        website: website || "",
        userId: session.user.id,
      }
    })

    // Возвращаем полного пользователя с профилем
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        projects: true
      }
    })

    return NextResponse.json({ user, profile }, { status: 201 })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка создания профиля" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    // Получаем ПОЛНОГО пользователя с профилем и проектами
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        projects: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json({ user })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка получения профиля" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, bio, location, githubUrl, linkedinUrl, website } = body

    // Проверяем, существует ли профиль
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    let profile

    if (!existingProfile) {
      // Создаем если нет
      profile = await prisma.profile.create({
        data: {
          title: title || "",
          bio: bio || "",
          location: location || "",
          githubUrl: githubUrl || "",
          linkedinUrl: linkedinUrl || "",
          website: website || "",
          userId: session.user.id,
        }
      })
    } else {
      // Обновляем если есть
      profile = await prisma.profile.update({
        where: { userId: session.user.id },
        data: {
          title: title !== undefined ? title : existingProfile.title,
          bio: bio !== undefined ? bio : existingProfile.bio,
          location: location !== undefined ? location : existingProfile.location,
          githubUrl: githubUrl !== undefined ? githubUrl : existingProfile.githubUrl,
          linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : existingProfile.linkedinUrl,
          website: website !== undefined ? website : existingProfile.website,
        }
      })
    }

    // Возвращаем полного пользователя с обновленным профилем
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        projects: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    return NextResponse.json({ user, profile })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка обновления профиля" },
      { status: 500 }
    )
  }
}