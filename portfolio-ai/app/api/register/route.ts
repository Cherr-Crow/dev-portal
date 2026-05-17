import { prisma } from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'DEVELOPER',
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: "Регистрация успешна" },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    )
  }
}