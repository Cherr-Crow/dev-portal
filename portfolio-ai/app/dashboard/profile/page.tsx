'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'

interface Profile {
  title: string
  bio: string
  location: string
  githubUrl: string
  linkedinUrl: string
  website: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<Profile>({ 
    title: '', 
    bio: '', 
    location: '', 
    githubUrl: '', 
    linkedinUrl: '', 
    website: '' 
  })
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => { 
        if (data) setProfile(data); 
        setLoading(false) 
      })
  }, [])
  
  // Добавляем тип для параметра e
  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch('/api/profile', { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(profile) 
    })
    alert('Сохранено')
  }
  
  // Добавляем тип для onChange событий
  const handleInputChange = (field: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({...profile, [field]: e.target.value})
  }
  
  if (loading) return <div className={styles.section}>Загрузка...</div>
  
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Профиль</h2>
      </div>
      <form onSubmit={update} className={styles.profileContent}>
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>Должность:</span>
          <input 
            className={styles.searchInput} 
            value={profile.title || ''} 
            onChange={handleInputChange('title')} 
          />
        </div>
        
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>Локация:</span>
          <input 
            className={styles.searchInput} 
            value={profile.location || ''} 
            onChange={handleInputChange('location')} 
          />
        </div>
        
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>О себе:</span>
          <textarea 
            rows={3} 
            className={styles.searchInput} 
            value={profile.bio || ''} 
            onChange={handleInputChange('bio')} 
          />
        </div>
        
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>GitHub:</span>
          <input 
            className={styles.searchInput} 
            value={profile.githubUrl || ''} 
            onChange={handleInputChange('githubUrl')} 
          />
        </div>
        
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>LinkedIn:</span>
          <input 
            className={styles.searchInput} 
            value={profile.linkedinUrl || ''} 
            onChange={handleInputChange('linkedinUrl')} 
          />
        </div>
        
        <div className={styles.profileField}>
          <span className={styles.profileLabel}>Сайт:</span>
          <input 
            className={styles.searchInput} 
            value={profile.website || ''} 
            onChange={handleInputChange('website')} 
          />
        </div>
        
        <button type="submit" className={styles.createButton}>
          Сохранить
        </button>
      </form>
    </div>
  )
}