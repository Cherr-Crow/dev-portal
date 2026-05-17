import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chatId, content } = await req.json()

    if (!chatId || !content?.trim()) {
      return NextResponse.json({ error: 'Chat ID and message content are required' }, { status: 400 })
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

    // Создаем сообщение
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        chatId,
        senderId: session.user.id
      },
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

   
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: content.trim(),
        lastMessageAt: new Date()
      }
    })

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}