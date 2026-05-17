

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId: session.user.id }
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
                role: true,
                profile: {
                  select: {
                    title: true,
                    location: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    })

    const formattedChats = chats.map((chat: any) => {
      const otherParticipant = chat.participants.find(
        (p: any) => p.user.id !== session.user?.id
      )
      return {
        id: chat.id,
        otherUser: otherParticipant?.user,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: 0
      }
    })

    return NextResponse.json({ chats: formattedChats })
  } catch (error) {
    console.error('Error getting chats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}