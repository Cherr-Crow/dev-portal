// app/dashboard/components/EmployerDashboard.tsx
'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from '../page.module.css'

const ChatButton = dynamic(() => import('@/app/components/Chat/ChatButton'), {
  ssr: false,
  loading: () => <button className={styles.contactButton}>Загрузка...</button>
})

interface Developer {
  id: string
  name: string
  email: string
  relevance?: number
  profile?: {
    title?: string
    location?: string
    bio?: string
    githubUrl?: string
    linkedinUrl?: string
    website?: string
  } | null
  projects?: Array<{
    id: string
    title: string
    description: string
    techStack: string
    demoUrl?: string
    repoUrl?: string
  }>
}

interface EmployerDashboardProps {
  user: any
  initialDevelopers: Developer[]
  searchQuery?: string
}

export default function EmployerDashboard({ user, initialDevelopers, searchQuery }: EmployerDashboardProps) {
  const [developers, setDevelopers] = useState<Developer[]>(initialDevelopers)
  const [searchText, setSearchText] = useState(searchQuery || '')
  const [loading, setLoading] = useState(false)
  const [searchMode, setSearchMode] = useState<'smart' | 'exact'>('smart')
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])

  const aiSuggestionsList = [
    'React разработчик',
    'TypeScript специалист',
    'Full-stack разработчик',
    'Python бэкенд',
    'Node.js разработчик',
    'DevOps инженер',
    'Мобильный разработчик React Native',
    'Team Lead'
  ]

  // AI поиск через API
  useEffect(() => {
    const searchWithAI = async () => {
      if (!searchText.trim()) {
        setDevelopers(initialDevelopers)
        setAiSuggestions([])
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/developer/search?q=${encodeURIComponent(searchText)}&mode=${searchMode}`)
        if (res.ok) {
          const data = await res.json()
          setDevelopers(data.developers)
          
          // Если ничего не найдено, показываем подсказки
          if (data.developers.length === 0 && searchText) {
            setAiSuggestions(aiSuggestionsList.slice(0, 4))
          } else {
            setAiSuggestions([])
          }
        } else {
          // Если API ошибка, используем локальную фильтрацию
          const filtered = initialDevelopers.filter((dev) => {
            const search = searchText.toLowerCase()
            return (
              dev.name?.toLowerCase().includes(search) ||
              dev.profile?.title?.toLowerCase().includes(search) ||
              dev.profile?.location?.toLowerCase().includes(search) ||
              dev.profile?.bio?.toLowerCase().includes(search)
            )
          })
          setDevelopers(filtered)
        }
      } catch (error) {
        console.error('AI search error:', error)
        // Локальная фильтрация при ошибке
        const filtered = initialDevelopers.filter((dev) => {
          const search = searchText.toLowerCase()
          return (
            dev.name?.toLowerCase().includes(search) ||
            dev.profile?.title?.toLowerCase().includes(search) ||
            dev.profile?.location?.toLowerCase().includes(search) ||
            dev.profile?.bio?.toLowerCase().includes(search)
          )
        })
        setDevelopers(filtered)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchWithAI, 500)
    return () => clearTimeout(debounce)
  }, [searchText, searchMode, initialDevelopers])

  const getRelevanceLabel = (relevance?: number): string => {
    if (!relevance) return ''
    if (relevance > 20) return '🎯 Очень подходит'
    if (relevance > 15) return '👍 Хорошо подходит'
    if (relevance > 10) return '👌 Подходит'
    return ''
  }

  const clearSearch = () => {
    setSearchText('')
    setDevelopers(initialDevelopers)
  }

  return (
    <div>
     
      <div className={styles.chatNavButton}>
        <Link href="/dashboard/chats" className={styles.allChatsButton}>
         Все чаты
        </Link>
      </div>

      {/* AI Поиск */}
      <section className={styles.searchSection}>
        <div className={styles.searchHeader}>
          <h2 className={styles.sectionTitle}>
           Умный поиск разработчиков
            {searchMode === 'smart' && <span className={styles.aiBadge}>🤖 AI активен</span>}
          </h2>
          <div className={styles.searchModes}>
            <button 
              className={`${styles.modeBtn} ${searchMode === 'smart' ? styles.active : ''}`}
              onClick={() => setSearchMode('smart')}
            >
              🤖 Умный (AI)
            </button>
            <button 
              className={`${styles.modeBtn} ${searchMode === 'exact' ? styles.active : ''}`}
              onClick={() => setSearchMode('exact')}
            >
              📝 Точный
            </button>
          </div>
        </div>
        
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Поиск по имени, навыкам, технологиям (React, TypeScript, Python)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={styles.searchInput}
          />
          {loading && <div className={styles.searchSpinner}></div>}
          {searchText && !loading && (
            <button className={styles.clearSearch} onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>

        {/* AI подсказки */}
        {aiSuggestions.length > 0 && (
          <div className={styles.aiSuggestions}>
            <div className={styles.aiIcon}>🤖 AI советует:</div>
            <div className={styles.suggestionsList}>
              {aiSuggestions.map((suggestion, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSearchText(suggestion)}
                  className={styles.suggestionChip}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Статистика */}
        <div className={styles.searchStats}>
          {searchText ? (
            <>
              Найдено: <strong>{developers.length}</strong> разработчиков
              {searchMode === 'smart' && developers.length > 0 && (
                <span className={styles.aiInfo}>Отсортировано по релевантности</span>
              )}
            </>
          ) : (
            <>Всего разработчиков: <strong>{initialDevelopers.length}</strong></>
          )}
        </div>
      </section>

      {/* Результаты */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Разработчики ({developers.length})
        </h2>
        <div className={styles.developersGrid}>
          {loading ? (
            <div className={styles.loadingGrid}>
              <div className={styles.spinner}></div>
              <p>🤖 AI анализирует профили...</p>
            </div>
          ) : developers.length > 0 ? (
            developers.map((developer) => (
              <div key={developer.id} className={styles.developerCard}>
                <div className={styles.developerHeader}>
                  <div className={styles.developerAvatar}>
                    {developer.name?.charAt(0) || '?'}
                  </div>
                  <div className={styles.developerHeaderInfo}>
                    <div>
                      <h3 className={styles.developerName}>
                        {developer.name || 'Без имени'}
                      </h3>
                      <p className={styles.developerTitle}>
                        {developer.profile?.title || 'Должность не указана'}
                      </p>
                    </div>
                    {developer.relevance && searchMode === 'smart' && (
                      <div className={styles.relevanceBadge}>
                        {getRelevanceLabel(developer.relevance)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.developerInfo}>
                  <p className={styles.developerLocation}>
                   {developer.profile?.location || 'Локация не указана'}
                  </p>
                  {developer.profile?.bio && (
                    <p className={styles.developerBio}>{developer.profile.bio}</p>
                  )}
                </div>

                {/* Навыки из проектов */}
                {developer.projects && developer.projects.length > 0 && (
                  <div className={styles.skillsSection}>
                    <div className={styles.skillsTitle}>💻 Ключевые навыки:</div>
                    <div className={styles.skillsList}>
                      {(() => {
                        const allSkills = new Set<string>()
                        developer.projects.forEach(project => {
                          try {
                            const techStack = JSON.parse(project.techStack || '[]')
                            techStack.forEach((tech: string) => allSkills.add(tech))
                          } catch (e) {
                            if (project.techStack) {
                              allSkills.add(project.techStack)
                            }
                          }
                        })
                        return Array.from(allSkills).slice(0, 6).map(skill => (
                          <span key={skill} className={styles.skillBadge}>{skill}</span>
                        ))
                      })()}
                    </div>
                  </div>
                )}

                {developer.profile && (
                  <div className={styles.developerLinks}>
                    {developer.profile.githubUrl && (
                      <a href={developer.profile.githubUrl} target="_blank" className={styles.externalLink}>
                        GitHub
                      </a>
                    )}
                    {developer.profile.linkedinUrl && (
                      <a href={developer.profile.linkedinUrl} target="_blank" className={styles.externalLink}>
                        LinkedIn
                      </a>
                    )}
                    {developer.profile.website && (
                      <a href={developer.profile.website} target="_blank" className={styles.externalLink}>
                        Сайт
                      </a>
                    )}
                  </div>
                )}

                <div className={styles.developerActions}>
                  <ChatButton
                    developerId={developer.id}
                    developerName={developer.name || 'Без имени'}
                    currentUserId={user.id}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptySearch}>
              <div className={styles.emptyIcon}></div>
              <p>По вашему запросу ничего не найдено</p>
              <span className={styles.emptyHint}>
                Попробуйте другие ключевые слова или используйте AI подсказки
              </span>
              <div className={styles.exampleQueries}>
                <span>Попробуйте поискать:</span>
                {aiSuggestionsList.slice(0, 4).map((s, i) => (
                  <button key={i} onClick={() => setSearchText(s)} className={styles.exampleBtn}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}