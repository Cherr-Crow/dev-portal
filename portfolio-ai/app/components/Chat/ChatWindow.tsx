// app/components/Chat/ChatWindow.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { IoSend, IoSparkles, IoHappy, IoBulb, IoClose } from 'react-icons/io5'
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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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

  // Получение AI подсказок
  const getAiSuggestions = async (text: string) => {
    if (text.length < 3) {
      setAiSuggestions([])
      return
    }
    
    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, action: 'suggest' })
      })
      if (res.ok) {
        const data = await res.json()
        setAiSuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
    }
  }

  // Генерация умного ответа
  const generateSmartReply = async () => {
    if (!newMessage.trim()) return
    
    setAiThinking(true)
    try {
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage, action: 'smartReply' })
      })
      if (res.ok) {
        const data = await res.json()
        setNewMessage(data.reply)
        inputRef.current?.focus()
      }
    } catch (error) {
      console.error('Error generating reply:', error)
    } finally {
      setAiThinking(false)
      setShowAiPanel(false)
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

  // AI подсказки при вводе
  useEffect(() => {
    const debounce = setTimeout(() => {
      getAiSuggestions(newMessage)
    }, 500)
    return () => clearTimeout(debounce)
  }, [newMessage])

  // Авто-фокус
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        if (window.innerWidth < 768) {
          inputRef.current.click()
        }
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [chatId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')
    setAiSuggestions([])

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, content: messageContent })
      })
      
      if (!res.ok) throw new Error('Failed to send message')
      await loadMessages()
      
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
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
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            {otherUserName.charAt(0).toUpperCase()}
          </div>
          <h3>{otherUserName}</h3>
        </div>
        <button 
          className={styles.aiButton}
          onClick={() => setShowAiPanel(!showAiPanel)}
          title="AI помощник"
        >
          <IoSparkles />
        </button>
      </div>
      
      {/* AI панель */}
      {showAiPanel && (
        <div className={styles.aiPanel}>
          <div className={styles.aiPanelHeader}>
            <span><IoSparkles /> AI Ассистент</span>
            <button onClick={() => setShowAiPanel(false)}>
              <IoClose />
            </button>
          </div>
          <div className={styles.aiPanelContent}>
            <p>✨ Я помогу вам с ответами!</p>
            <button 
              className={styles.aiActionBtn}
              onClick={generateSmartReply}
              disabled={aiThinking || !newMessage.trim()}
            >
              {aiThinking ? 'Думаю...' : '✨ Умный ответ'}
            </button>
            <button 
              className={styles.aiActionBtn}
              onClick={() => {
                setNewMessage('Спасибо за ответ! Буду рад сотрудничеству.')
              }}
            >
              💼 Шаблон: Благодарность
            </button>
            <button 
              className={styles.aiActionBtn}
              onClick={() => {
                setNewMessage('Расскажите подробнее о вашем проекте?')
              }}
            >
              📝 Шаблон: Уточнение
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.messagesArea}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : messages.length === 0 ? (
          <div className={styles.welcomeMessage}>
            <div className={styles.welcomeIcon}>💬</div>
            <p>Напишите первое сообщение</p>
            <span className={styles.welcomeHint}>Используйте AI помощника для умных ответов</span>
          </div>
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
      
      {/* AI подсказки при вводе */}
      {aiSuggestions.length > 0 && (
        <div className={styles.aiSuggestionsBar}>
          <IoBulb className={styles.suggestionsIcon} />
          <div className={styles.suggestionsList}>
            {aiSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className={styles.suggestionChip}
                onClick={() => {
                  setNewMessage(suggestion)
                  inputRef.current?.focus()
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={sendMessage} className={styles.messageForm}>
        <button 
          type="button" 
          className={styles.emojiButton}
          onClick={() => setShowAiPanel(!showAiPanel)}
          title="AI помощник"
        >
          <IoSparkles />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение... (AI поможет)"
          className={styles.messageInput}
          disabled={sending}
          autoFocus
        />
        <button type="submit" disabled={sending || !newMessage.trim()} className={styles.sendButton}>
          {sending ? '...' : <IoSend />}
        </button>
      </form>
    </div>
  )
}