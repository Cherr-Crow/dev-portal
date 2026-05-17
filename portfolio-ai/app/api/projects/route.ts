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
    const { title, description, repoUrl, demoUrl, imageUrl, techStack } = body

    if (!title) {
      return NextResponse.json(
        { error: "Название проекта обязательно" },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description: description || "",
        repoUrl: repoUrl || "",
        demoUrl: demoUrl || "",
        imageUrl: imageUrl || "",
        techStack: JSON.stringify(techStack || []),
        userId: session.user.id,
      }
    })

    return NextResponse.json({ 
      project: {
        ...project,
        techStack: JSON.parse(project.techStack)
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Ошибка создания проекта" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
  
    if (!session || !session.user) {
      const allProjects = await prisma.project.findMany({
        include: {
          user: {
            select: {
              name: true,
              profile: {
                select: {
                  title: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      const projectsWithArray = allProjects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        techStack: JSON.parse(p.techStack || '[]'),
        demoUrl: p.demoUrl,
        repoUrl: p.repoUrl,
        author: p.user ? {
          name: p.user.name || 'Аноним',
          profile: {
            title: p.user.profile?.title || 'Разработчик'
          }
        } : null,
        createdAt: p.createdAt,
      }))

      return NextResponse.json({ projects: projectsWithArray })
    }

 
    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const projectsWithArray = projects.map(p => ({
      ...p,
      techStack: JSON.parse(p.techStack || '[]')
    }))

    return NextResponse.json({ projects: projectsWithArray })
    
  } catch (error) {
    console.error('Ошибка получения проектов:', error)
    return NextResponse.json(
      { error: "Ошибка получения проектов" },
      { status: 500 }
    )
  }
}