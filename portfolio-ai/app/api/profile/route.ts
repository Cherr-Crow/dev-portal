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

    return NextResponse.json({ profile }, { status: 201 })
    
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

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    return NextResponse.json(profile || null)
    
  } catch (error) {
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

    const profile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        title: title || "",
        bio: bio || "",
        location: location || "",
        githubUrl: githubUrl || "",
        linkedinUrl: linkedinUrl || "",
        website: website || "",
      }
    })

    return NextResponse.json({ profile })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка обновления профиля" },
      { status: 500 }
    )
  }
}