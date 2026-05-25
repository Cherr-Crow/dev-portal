'use client'

import dynamic from 'next/dynamic'

const ChatButton = dynamic(() => import('./ChatButton'), {
  ssr: false,
  loading: () => <button className="contactButton"> Загрузка...</button>
})

interface ChatButtonWrapperProps {
  developerId: string
  developerName: string
  currentUserId: string
}

export default function ChatButtonWrapper({ 
  developerId, 
  developerName, 
  currentUserId 
}: ChatButtonWrapperProps) {
  return (
    <ChatButton 
      developerId={developerId}
      developerName={developerName}
      currentUserId={currentUserId}
    />
  )
}