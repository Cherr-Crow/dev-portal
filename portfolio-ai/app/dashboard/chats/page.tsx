// app/dashboard/chats/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
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

const ChatButton = dynamic(() => import('@/app/components/Chat/ChatButton'), {
  ssr: false,
  loading: () => <button className={styles.contactButton}>Загрузка...</button>
})

interface User {
  id: string
  name: string | null
  email: string
  role: string
  profile?: {
    title?: string | null
    location?: string | null
  } | null
}

export default function ChatsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [hasAutoSelected, setHasAutoSelected] = useState(false)
  
  const chatId = searchParams.get('chatId')
  const userName = searchParams.get('userName')

  // Проверка на мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Автоматически выбираем первый чат (только один раз и если нет chatId)
  useEffect(() => {
    const autoSelectFirstChat = async () => {
      // Не запускаем если уже выбрали или есть chatId или нет сессии
      if (hasAutoSelected || chatId || !session?.user?.id) {
        return
      }
      
      try {
        const res = await fetch('/api/chat/list')
        if (res.ok) {
          const data = await res.json()
          if (data.chats && data.chats.length > 0) {
            const firstChat = data.chats[0]
            setHasAutoSelected(true)
            router.replace(
              `/dashboard/chats?chatId=${firstChat.id}&userName=${encodeURIComponent(firstChat.otherUser.name || firstChat.otherUser.email)}&userId=${firstChat.otherUser.id}`
            )
            return
          }
        }
        setHasAutoSelected(true)
      } catch (error) {
        console.error('Error auto-selecting chat:', error)
        setHasAutoSelected(true)
      }
    }
    
    autoSelectFirstChat()
  }, [session?.user?.id, chatId, router, hasAutoSelected])

  // Загружаем пользователей для начала диалога
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.user?.id || chatId || !hasAutoSelected) return
      
      setLoadingUsers(true)
      try {
        const role = session.user.role === 'DEVELOPER' ? 'EMPLOYER' : 'DEVELOPER'
        const res = await fetch(`/api/users?role=${role}`)
        if (res.ok) {
          const data = await res.json()
          setUsers(data.users)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoadingUsers(false)
      }
    }
    
    fetchUsers()
  }, [session?.user?.id, session?.user?.role, chatId, hasAutoSelected])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Функция возврата к списку чатов на мобильных - БЕЗ router.push
  const handleBackToList = useCallback(() => {
    // Просто убираем чат из URL используя replace, чтобы не создавать историю
    window.history.replaceState({}, '', '/dashboard/chats')
    // Принудительно обновляем состояние через dispatch события
    window.dispatchEvent(new PopStateEvent('popstate'))
  }, [])

  if (status === 'loading' || !hasAutoSelected) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (!session?.user) {
    return null
  }

  // Есть выбранный чат - показываем интерфейс с чатами
  if (chatId && userName) {
    return (
      <div className={styles.chatsPage}>
        {/* Список чатов */}
        <div className={`${styles.chatListPanel} ${isMobile ? styles.mobileChatList : ''}`}>
          <div className={styles.panelHeader}>
            <h2>Сообщения</h2>
            <div className={styles.headerButtons}>
              <button onClick={() => router.push('/dashboard')} className={styles.dashboardLink}>
                ← На дашборд
              </button>
            </div>
          </div>
          <ChatList 
            currentUserId={session.user.id} 
            selectedChatId={chatId || undefined}
          />
        </div>

        {/* Окно чата */}
        <div className={`${styles.chatPanel} ${isMobile ? styles.mobileChatOpen : ''}`}>
          <ChatWindow
            chatId={chatId}
            otherUserName={decodeURIComponent(userName)}
            currentUserId={session.user.id}
            onBack={isMobile ? handleBackToList : undefined}
          />
        </div>
      </div>
    )
  }

  // Нет выбранного чата - показываем список пользователей для начала диалога
  return (
    <div className={styles.startChatContainer}>
      <div className={styles.startChatHeader}>
        <h2>💬 Новое сообщение</h2>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          ← На дашборд
        </button>
      </div>
      
      <div className={styles.startChatContent}>
        <div className={styles.startChatInfo}>
          <div className={styles.startChatIcon}>✍️</div>
          <h3>Начните диалог</h3>
          <p>Выберите пользователя, чтобы написать сообщение</p>
        </div>

        <div className={styles.usersList}>
          {loadingUsers ? (
            <div className={styles.loadingUsers}>
              <div className={styles.spinner}></div>
              <p>Загрузка пользователей...</p>
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userAvatar}>
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name || user.email}</div>
                  <div className={styles.userRole}>
                    {user.role === 'DEVELOPER' ? '👨‍💻 Разработчик' : '🏢 Работодатель'}
                  </div>
                  {user.profile?.title && (
                    <div className={styles.userTitle}>{user.profile.title}</div>
                  )}
                </div>
                <ChatButton
                  developerId={user.id}
                  developerName={user.name || user.email}
                  currentUserId={session.user.id}
                />
              </div>
            ))
          ) : (
            <div className={styles.noUsers}>
              <div className={styles.noUsersIcon}>👥</div>
              <p>Нет пользователей для начала диалога</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}