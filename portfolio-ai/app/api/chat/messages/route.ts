import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      return NextResponse.json({ error: 'Chat ID is required' }, { status: 400 })
    }

 
    const participant = await prisma.chatParticipant.findFirst({
      where: {
        chatId,
        userId: session.user.id
      }
    })

    if (!participant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    
    await prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: session.user.id },
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error getting messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}