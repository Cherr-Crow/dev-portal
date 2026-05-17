'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import styles from './page.module.css'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const deleteAccount = async () => {
    setLoading(true)
    await fetch('/api/user/delete', { method: 'DELETE' })
    signOut({ callbackUrl: '/' })
  }
  
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Настройки</h2>
      </div>
      
      <div className={styles.profileContent}>
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>Email</span>
          <span>{session?.user?.email}</span>
        </div>
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>Роль</span>
          <span>{session?.user?.role === 'DEVELOPER' ? 'Разработчик' : 'Работодатель'}</span>
        </div>
      </div>
      
      <div className={styles.dangerZone}>
        <h3 className={styles.dangerTitle}>Опасная зона</h3>
        
        {!confirm ? (
          <button onClick={() => setConfirm(true)} className={styles.dangerButton}>
            Удалить аккаунт
          </button>
        ) : (
          <div>
            <p className={styles.confirmText}>Вы уверены? Действие необратимо.</p>
            <div className={styles.confirmActions}>
              <button onClick={() => setConfirm(false)} className={styles.cancelButton}>
                Отмена
              </button>
              <button onClick={deleteAccount} disabled={loading} className={styles.deleteButton}>
                {loading ? 'Удаление...' : 'Да, удалить'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}