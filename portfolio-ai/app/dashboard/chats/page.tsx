// app/dashboard/chats/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './ChatsPage.module.css'

const ChatList = dynamic(() => import('@/app/components/Chat/ChatList'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Загрузка чатов...</div>
})

const ChatWindow = dynamic(() => import('@/app/components/Chat/ChatWindow'), {
  ssr: false,
  loading: () => <div className={styles.loading}>Загрузка чата...</div>
})

export default function ChatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [chatsLoaded, setChatsLoaded] = useState(false)
  
  const chatId = searchParams.get('chatId')
  const userName = searchParams.get('userName')

  // Автоматически выбираем первый чат, если нет выбранного
  useEffect(() => {
    const autoSelectFirstChat = async () => {
      if (!session?.user?.id || chatId || chatsLoaded) return
      
      try {
        const res = await fetch('/api/chat/list')
        if (res.ok) {
          const data = await res.json()
          if (data.chats && data.chats.length > 0) {
            const firstChat = data.chats[0]
            router.replace(
              `/dashboard/chats?chatId=${firstChat.id}&userName=${encodeURIComponent(firstChat.otherUser.name || firstChat.otherUser.email)}&userId=${firstChat.otherUser.id}`
            )
          }
        }
      } catch (error) {
        console.error('Error auto-selecting chat:', error)
      } finally {
        setChatsLoaded(true)
      }
    }
    
    autoSelectFirstChat()
  }, [session?.user?.id, chatId, router, chatsLoaded])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className={styles.chatsPage}>
      {/* Левая панель - список чатов */}
      <div className={styles.chatListPanel}>
        <div className={styles.panelHeader}>
          <h2>Сообщения</h2>
          <button onClick={() => router.push('/dashboard')} className={styles.dashboardLink}>
            ← На дашборд
          </button>
        </div>
        <ChatList 
          currentUserId={session.user.id} 
          selectedChatId={chatId || undefined}
        />
      </div>

      {/* Правая панель - активный чат */}
      <div className={styles.chatPanel}>
        {chatId && userName ? (
          <ChatWindow
            chatId={chatId}
            otherUserName={decodeURIComponent(userName)}
            currentUserId={session.user.id}
            onBack={() => router.push('/dashboard/chats')}
          />
        ) : (
          // Показываем только если действительно нет чатов
          <div className={styles.noChatsMessage}>
            <div className={styles.noChatIcon}>💬</div>
            <h3>Нет чатов</h3>
            <p>Начните диалог с разработчиком или работодателем</p>
          </div>
        )}
      </div>
    </div>
  )
}