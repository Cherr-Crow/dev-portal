// app/api/developer/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'

// Простой AI поиск (без внешних API)
function calculateRelevance(developer: any, query: string): number {
  const searchText = query.toLowerCase()
  let score = 0
  
  // Имя
  if (developer.name?.toLowerCase().includes(searchText)) score += 10
  
  // Должность
  if (developer.profile?.title?.toLowerCase().includes(searchText)) score += 8
  
  // Локация
  if (developer.profile?.location?.toLowerCase().includes(searchText)) score += 5
  
  // Био
  if (developer.profile?.bio?.toLowerCase().includes(searchText)) score += 6
  
  // Навыки из проектов
  if (developer.projects) {
    developer.projects.forEach((project: any) => {
      try {
        const techStack = JSON.parse(project.techStack || '[]')
        techStack.forEach((tech: string) => {
          if (tech.toLowerCase().includes(searchText)) score += 7
        })
      } catch (e) {}
      
      if (project.title?.toLowerCase().includes(searchText)) score += 5
      if (project.description?.toLowerCase().includes(searchText)) score += 4
    })
  }
  
  return score
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const mode = searchParams.get('mode') || 'smart' // smart, exact, semantic

    // Получаем всех разработчиков
    const developers = await prisma.user.findMany({
      where: { role: 'DEVELOPER' },
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
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
            demoUrl: true,
            repoUrl: true,
          }
        }
      }
    })

    // AI сортировка по релевантности
    let results = developers
    if (query) {
      results = developers
        .map(dev => ({
          ...dev,
          relevance: calculateRelevance(dev, query)
        }))
        .filter(dev => dev.relevance > 0)
        .sort((a, b) => b.relevance - a.relevance)
    }

    return NextResponse.json({ 
      developers: results,
      total: results.length,
      query,
      mode
    })
  } catch (error) {
    console.error('Error searching developers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}