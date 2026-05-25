// app/components/Chat/ChatButton.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './Chat.module.css'

interface ChatButtonProps {
  developerId: string
  developerName: string
  currentUserId: string
}

export default function ChatButton({ developerId, developerName, currentUserId }: ChatButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const openChat = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/chat/get-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ developerId })
      })
      
      if (!res.ok) throw new Error('Failed to create chat')
      
      const data = await res.json()
      // Переходим на страницу чатов с выбранным чатом
      router.push(`/dashboard/chats?chatId=${data.chat.id}&userName=${encodeURIComponent(developerName)}&userId=${developerId}`)
    } catch (error) {
      console.error('Error opening chat:', error)
      alert('Не удалось открыть чат')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={openChat} disabled={loading} className={styles.contactButton}>
      {loading ? '' : ' Связаться'}
    </button>
  )
}