'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { SessionProvider } from 'next-auth/react'
import styles from './page.module.css'

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin')
  }, [status, router])

  // Закрывать мобильное меню при смене страницы
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.loadingScreen}>
          <p>Загрузка...</p>
        </div>
      </div>
    )
  }
  
  if (!session) return null

  const isDeveloper = session.user.role === 'DEVELOPER'

  const navItems = [
    { href: '/dashboard', icon: '', label: 'Обзор' },
    ...(isDeveloper ? [
      { href: '/dashboard/profile', icon: '', label: 'Профиль' },
      { href: '/dashboard/projects', icon: '', label: 'Проекты' },
    ] : [
      { href: '/dashboard/developers', icon: '', label: 'Разработчики' },
    ]),
    { href: '/dashboard/messages', icon: '', label: 'Сообщения' },
    { href: '/dashboard/settings', icon: '', label: 'Настройки' },
  ]

  return (
    <div className={styles.dashboardContainer}>
      {/* Мобильный хедер */}
      <header className={styles.mobileHeader}>
        <button 
          className={styles.burgerButton}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Меню"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <Link href="/dashboard" className={styles.mobileLogo}>DevPortal</Link>
        <div className={styles.mobileAvatar}>
          {session.user.name?.[0] || session.user.email?.[0] || '?'}
        </div>
      </header>

      {/* Оверлей */}
      {sidebarOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Сайдбар */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.sidebarLogo}>
             <svg height="32" viewBox="0 0 24 24" width="32" className={styles.logo}>
                <path fill="#c9d1d9" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                <path fill="#f97316" d="M11.5 3.5c-1.5 0-3 .5-4 1.5l-.5.5c-1 1-1.5 2.5-1.5 4v.5l1-1c.5-.5 1.5-1 2.5-1s2 .5 2.5 1l1 1v-.5c0-1.5-.5-3-1.5-4l-.5-.5c-1-1-2.5-1.5-4-1.5z"/>
                <circle fill="#c9d1d9" cx="9" cy="8" r="1"/>
                <circle fill="#c9d1d9" cx="14" cy="8" r="1"/>
                <path fill="none" stroke="#c9d1d9" strokeWidth="1.5" strokeLinecap="round" d="M8 12c0 0 1.5 2 4 2s4-2 4-2"/>
              </svg>
            <span>DevPortal</span>
          </Link>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
              >
                <span className={styles.sidebarIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarUserInfo}>
            <div className={styles.sidebarUserAvatar}>
              {session.user.name?.[0] || session.user.email?.[0] || '?'}
            </div>
            <div className={styles.sidebarUserDetails}>
              <div className={styles.sidebarUserName}>
                {session.user.name || session.user.email}
              </div>
              <div className={styles.sidebarUserRole}>
                {isDeveloper ? 'Разработчик' : 'Работодатель'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })} 
            className={styles.logoutButton}
          >
            Выйти
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SessionProvider>
  )
}