'use client'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import styles from './page.module.css'
const ChatSidebar = dynamic(() => import('@/app/components/Chat/ChatSidebar'), { ssr: false })
export default function MessagesPage() {
  const { data: session } = useSession()
  if (!session) return null
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Сообщения</h2></div>
      <ChatSidebar currentUserId={session.user.id} />
    </div>
  )
}