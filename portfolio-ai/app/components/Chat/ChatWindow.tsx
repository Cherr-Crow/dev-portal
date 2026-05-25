// app/components/Chat/ChatWindow.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './Chat.module.css'

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: {
    id: string
    name: string
    email: string
  }
}

interface ChatWindowProps {
  chatId: string
  otherUserName: string
  currentUserId: string
  onBack?: () => void
}

export default function ChatWindow({ chatId, otherUserName, currentUserId, onBack }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages?chatId=${chatId}`)
      if (!res.ok) throw new Error('Failed to load messages')
      const data = await res.json()
      setMessages(data.messages)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()
    pollingIntervalRef.current = setInterval(loadMessages, 3000)
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
  }, [chatId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, content: messageContent })
      })
      
      if (!res.ok) throw new Error('Failed to send message')
      await loadMessages()
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageContent)
      alert('Не удалось отправить сообщение')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className={styles.chatWindowFull}>
      <div className={styles.chatHeader}>
        {onBack && (
          <button onClick={onBack} className={styles.backButton}>
            ←
          </button>
        )}
        <h3>Чат с {otherUserName}</h3>
      </div>
      
      <div className={styles.messagesArea}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : messages.length === 0 ? (
          <div className={styles.noMessages}>Напишите первое сообщение</div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.senderId === currentUserId ? styles.sent : styles.received}`}
              >
                <div className={styles.messageContent}>{msg.content}</div>
                <div className={styles.messageTime}>{formatTime(msg.createdAt)}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <form onSubmit={sendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className={styles.messageInput}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !newMessage.trim()} className={styles.sendButton}>
          {sending ? '...' : '→'}
        </button>
      </form>
    </div>
  )
}