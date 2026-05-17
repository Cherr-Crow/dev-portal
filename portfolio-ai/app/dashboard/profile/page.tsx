'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState({ title: '', bio: '', location: '', githubUrl: '', linkedinUrl: '', website: '' })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch('/api/profile').then(res => res.json()).then(data => { if (data) setProfile(data); setLoading(false) })
  }, [])
  const update = async (e) => {
    e.preventDefault()
    await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
    alert('Сохранено')
  }
  if (loading) return <div className={styles.section}>Загрузка...</div>
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}><h2 className={styles.sectionTitle}>Профиль</h2></div>
      <form onSubmit={update} className={styles.profileContent}>
        <div className={styles.profileField}><span className={styles.profileLabel}>Должность:</span><input className={styles.searchInput} value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} /></div>
        <div className={styles.profileField}><span className={styles.profileLabel}>Локация:</span><input className={styles.searchInput} value={profile.location || ''} onChange={e => setProfile({...profile, location: e.target.value})} /></div>
        <div className={styles.profileField}><span className={styles.profileLabel}>О себе:</span><textarea rows={3} className={styles.searchInput} value={profile.bio || ''} onChange={e => setProfile({...profile, bio: e.target.value})} /></div>
        <div className={styles.profileField}><span className={styles.profileLabel}>GitHub:</span><input className={styles.searchInput} value={profile.githubUrl || ''} onChange={e => setProfile({...profile, githubUrl: e.target.value})} /></div>
        <div className={styles.profileField}><span className={styles.profileLabel}>LinkedIn:</span><input className={styles.searchInput} value={profile.linkedinUrl || ''} onChange={e => setProfile({...profile, linkedinUrl: e.target.value})} /></div>
        <div className={styles.profileField}><span className={styles.profileLabel}>Сайт:</span><input className={styles.searchInput} value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} /></div>
        <button type="submit" className={styles.createButton}>Сохранить</button>
      </form>
    </div>
  )
}