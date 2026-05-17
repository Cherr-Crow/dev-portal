
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import ChatList from './ChatList'
import styles from './Chat.module.css'

const ChatWindow = dynamic(() => import('./ChatWindow'), {
  ssr: false,
  loading: () => <div className={styles.chatWindowLoading}>Загрузка...</div>
})

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

interface ChatSidebarProps {
  currentUserId: string
}

export default function ChatSidebar({ currentUserId }: ChatSidebarProps) {
  const [selectedChat, setSelectedChat] = useState<{ id: string; user: ChatUser } | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleSelectChat = (chatId: string, otherUser: ChatUser) => {
    setSelectedChat({ id: chatId, user: otherUser })
    setIsChatOpen(true)
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedChat(null)
  }

  return (
    <div className={styles.chatSidebar}>
      <ChatList
        currentUserId={currentUserId}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChat?.id}
      />
      
      {isChatOpen && selectedChat && (
        <ChatWindow
          chatId={selectedChat.id}
          otherUserName={selectedChat.user.name || selectedChat.user.email}
          currentUserId={currentUserId}
          onClose={handleCloseChat}
        />
      )}
    </div>
  )
}