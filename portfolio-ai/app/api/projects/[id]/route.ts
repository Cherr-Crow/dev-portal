import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// ИСПРАВЛЕННЫЙ DELETE обработчик
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Важно! Нужно await для params
    const { id: projectId } = await params
    
    console.log("=== DELETE запрос ===")
    console.log("ID проекта:", projectId)
    
    const session = await auth()
    
    if (!session || !session.user) {
      console.log("Ошибка: не авторизован")
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }

    if (!projectId) {
      console.log("Ошибка: ID не указан")
      return NextResponse.json(
        { error: "ID проекта не указан" },
        { status: 400 }
      )
    }

    // Проверяем существование проекта и права
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      console.log("Ошибка: проект не найден или нет прав")
      return NextResponse.json(
        { error: "Проект не найден или у вас нет прав на удаление" },
        { status: 404 }
      )
    }

    // Удаляем
    await prisma.project.delete({
      where: { id: projectId }
    })

    console.log("Успешно удален")
    return NextResponse.json(
      { message: "Проект успешно удален" },
      { status: 200 }
    )
    
  } catch (error) {
    console.error("Ошибка:", error)
    return NextResponse.json(
      { error: "Ошибка при удалении проекта" },
      { status: 500 }
    )
  }
}

// ИСПРАВЛЕННЫЙ GET (один проект)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!project) {
      return NextResponse.json(
        { error: "Проект не найден" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      ...project,
      techStack: JSON.parse(project.techStack || '[]')
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка получения проекта" },
      { status: 500 }
    )
  }
}

// ИСПРАВЛЕННЫЙ PATCH (обновление)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { title, description, repoUrl, demoUrl, imageUrl, techStack } = body
    
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })
    
    if (!existingProject) {
      return NextResponse.json(
        { error: "Проект не найден или нет прав" },
        { status: 404 }
      )
    }
    
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existingProject.title,
        description: description !== undefined ? description : existingProject.description,
        repoUrl: repoUrl !== undefined ? repoUrl : existingProject.repoUrl,
        demoUrl: demoUrl !== undefined ? demoUrl : existingProject.demoUrl,
        imageUrl: imageUrl !== undefined ? imageUrl : existingProject.imageUrl,
        techStack: techStack !== undefined ? JSON.stringify(techStack) : existingProject.techStack,
      }
    })
    
    return NextResponse.json({
      ...updatedProject,
      techStack: JSON.parse(updatedProject.techStack || '[]')
    })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка обновления проекта" },
      { status: 500 }
    )
  }
}