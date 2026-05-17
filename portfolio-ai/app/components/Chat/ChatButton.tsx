'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './Chat.module.css'

const ChatWindow = dynamic(() => import('./ChatWindow'), {
  loading: () => <div className={styles.loadingChat}>Загрузка...</div>,
  ssr: false
})

interface ChatButtonProps {
  developerId: string
  developerName: string
  currentUserId: string
}

interface ChatData {
  chat: {
    id: string
  }
}

export default function ChatButton({ developerId, developerName, currentUserId }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const openChat = async (): Promise<void> => {
    if (chatId) {
      setIsChatOpen(true)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/chat/get-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId })
      })
      
      if (!res.ok) {
        throw new Error('Failed to create chat')
      }
      
      const data: ChatData = await res.json()
      setChatId(data.chat.id)
      setIsChatOpen(true)
    } catch (error) {
      console.error('Error opening chat:', error)
      alert('Не удалось открыть чат')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={openChat} disabled={loading} className={styles.contactButton}>
        {loading ? '⏳' : 'Связаться'}
      </button>

      {isChatOpen && chatId && (
        <ChatWindow
          chatId={chatId}
          otherUserName={developerName}
          currentUserId={currentUserId}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  )
}