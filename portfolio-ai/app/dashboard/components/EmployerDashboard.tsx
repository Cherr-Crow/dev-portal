'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import styles from '../page.module.css'

const ChatButton = dynamic(() => import('@/app/components/Chat/ChatButton'), {
  ssr: false,
  loading: () => <button className={styles.contactButton}>Загрузка...</button>
})

interface Developer {
  id: string
  name: string
  email: string
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
  const [developers] = useState<Developer[]>(initialDevelopers)
  const [searchText, setSearchText] = useState(searchQuery || '')

  const filteredDevelopers = developers.filter((dev) => {
    if (!searchText) return true
    const search = searchText.toLowerCase()
    return (
      dev.name?.toLowerCase().includes(search) ||
      dev.profile?.title?.toLowerCase().includes(search) ||
      dev.profile?.location?.toLowerCase().includes(search) ||
      dev.profile?.bio?.toLowerCase().includes(search)
    )
  })

  return (
    <div>
      <section className={styles.searchSection}>
        <h2 className={styles.sectionTitle}>Поиск разработчиков</h2>
        <input
          type="text"
          placeholder="Поиск по имени, должности, локации..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={styles.searchInput}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Разработчики ({filteredDevelopers.length})
        </h2>
        <div className={styles.developersGrid}>
          {filteredDevelopers.length > 0 ? (
            filteredDevelopers.map((developer) => (
              <div key={developer.id} className={styles.developerCard}>
                <div className={styles.developerHeader}>
                  <div className={styles.developerAvatar}>
                    {developer.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className={styles.developerName}>
                      {developer.name || 'Без имени'}
                    </h3>
                    <p className={styles.developerTitle}>
                      {developer.profile?.title || 'Должность не указана'}
                    </p>
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

                {developer.projects && developer.projects.length > 0 && (
                  <div className={styles.developerProjects}>
                    <h4 className={styles.projectsTitle}>
                      Проекты ({developer.projects.length})
                    </h4>
                    <div className={styles.projectsList}>
                      {developer.projects.map((project) => (
                        <div key={project.id} className={styles.projectItem}>
                          <h5 className={styles.projectName}>{project.title}</h5>
                          <p className={styles.projectDescription}>{project.description}</p>
                          {project.techStack && (
                            <div className={styles.techStack}>
                              {(() => {
                                try {
                                  return JSON.parse(project.techStack).map((tech: string) => (
                                    <span key={tech} className={styles.techBadge}>{tech}</span>
                                  ))
                                } catch {
                                  return null
                                }
                              })()}
                            </div>
                          )}
                          <div className={styles.projectLinks}>
                            {project.demoUrl && (
                              <a href={project.demoUrl} target="_blank" className={styles.projectLink}>Демо</a>
                            )}
                            {project.repoUrl && (
                              <a href={project.repoUrl} target="_blank" className={styles.projectLink}>Репозиторий</a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
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
            <div className={styles.profileContent}>
              <p>Разработчики не найдены.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}