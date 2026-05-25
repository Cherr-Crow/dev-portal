// app/components/Chat/ChatList.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Chat.module.css'

interface ChatUser {
  id: string
  name: string | null
  email: string
  role: string
  profile?: {
    title?: string | null
    location?: string | null
  } | null
}

interface Chat {
  id: string
  otherUser: ChatUser
  lastMessage: string | null
  lastMessageAt: string | null
  unreadCount: number
}

interface ChatListProps {
  currentUserId: string
  selectedChatId?: string
}

export default function ChatList({ currentUserId, selectedChatId }: ChatListProps) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)

  const loadChats = async () => {
    try {
      const res = await fetch('/api/chat/list')
      if (!res.ok) throw new Error('Failed to load chats')
      const data = await res.json()
      setChats(data.chats)
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChats()
    const interval = setInterval(loadChats, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleSelectChat = (chatId: string, otherUser: ChatUser) => {
    router.push(`/dashboard/chats?chatId=${chatId}&userName=${encodeURIComponent(otherUser.name || otherUser.email)}&userId=${otherUser.id}`)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60 * 1000) return 'только что'
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} мин`
    if (diff < 24 * 60 * 60 * 1000) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
      return days[date.getDay()]
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
  }

  const getRoleIcon = (role: string) => {
    return role === 'DEVELOPER' ? '👨‍💻' : '🏢'
  }

  if (loading) {
    return (
      <div className={styles.chatListLoading}>
        <div className={styles.spinner}></div>
        <p>Загрузка чатов...</p>
      </div>
    )
  }

  if (chats.length === 0) {
    return (
      <div className={styles.chatListEmpty}>
        <div className={styles.emptyIcon}>💬</div>
        <p>У вас пока нет чатов</p>
        <span className={styles.emptyHint}>Начните диалог с разработчиком или работодателем</span>
      </div>
    )
  }

  return (
    <div className={styles.chatList}>
      <div className={styles.chatListHeader}>
        <h3>💬 Мои чаты</h3>
        <span className={styles.chatCount}>{chats.length}</span>
      </div>
      <div className={styles.chatItems}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`${styles.chatListItem} ${selectedChatId === chat.id ? styles.active : ''}`}
            onClick={() => handleSelectChat(chat.id, chat.otherUser)}
          >
            <div className={styles.chatAvatar}>
              {getRoleIcon(chat.otherUser.role)}
            </div>
            <div className={styles.chatItemContent}>
              <div className={styles.chatItemHeader}>
                <span className={styles.chatItemName}>
                  {chat.otherUser.name || chat.otherUser.email}
                </span>
                <span className={styles.chatItemTime}>
                  {formatDate(chat.lastMessageAt)}
                </span>
              </div>
              <div className={styles.chatItemPreview}>
                {chat.lastMessage || 'Нет сообщений'}
              </div>
              {chat.otherUser.profile?.title && (
                <div className={styles.chatItemSubtitle}>
                  {chat.otherUser.profile.title}
                </div>
              )}
            </div>
            {chat.unreadCount > 0 && (
              <div className={styles.unreadBadge}>
                {chat.unreadCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}