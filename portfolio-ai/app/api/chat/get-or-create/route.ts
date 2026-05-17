import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { developerId } = await req.json()

    if (!developerId) {
      return NextResponse.json({ error: 'Developer ID is required' }, { status: 400 })
    }

  
    let chat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: session.user.id } } },
          { participants: { some: { userId: developerId } } }
        ]
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    })

   
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          participants: {
            create: [
              { userId: session.user.id },
              { userId: developerId }
            ]
          }
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true
                }
              }
            }
          }
        }
      })
    }

    return NextResponse.json({ chat })
  } catch (error) {
    console.error('Error creating/getting chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}