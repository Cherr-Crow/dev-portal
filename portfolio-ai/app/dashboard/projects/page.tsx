'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

interface Project {
  id: string
  title: string
  description: string
  techStack: string
  demoUrl?: string
  repoUrl?: string
  createdAt?: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      
      const res = await fetch('/api/projects', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || data.message || 'Ошибка загрузки')
      }
      
      const data = await res.json()
      const projectList = Array.isArray(data) ? data : []
      
      // Форматируем проекты для компонента
      const formattedProjects = projectList.map((project: any) => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        techStack: Array.isArray(project.techStack) 
          ? JSON.stringify(project.techStack) 
          : (project.techStack || '[]'),
        demoUrl: project.demoUrl || '',
        repoUrl: project.repoUrl || '',
        createdAt: project.createdAt
      }))
      
      setProjects(formattedProjects)
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message || 'Не удалось загрузить проекты')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProjects()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [fetchProjects])

  const deleteProject = async (id: string, title: string) => {
    if (!confirm(`Вы уверены, что хотите удалить проект "${title}"? Это действие нельзя отменить.`)) {
      return
    }
    
    try {
      const res = await fetch(`/api/projects/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setProjects(prevProjects => prevProjects.filter(p => p.id !== id))
        alert('Проект успешно удален!')
      } else {
        alert(data.error || data.message || 'Ошибка при удалении')
      }
    } catch (err) {
      console.error('Delete error:', err)
      alert('Ошибка при удалении. Попробуйте еще раз.')
    }
  }

  const parseTechStack = (techStack: string): string[] => {
    try {
      return JSON.parse(techStack)
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonLine} style={{ width: '60%', height: '24px', marginBottom: '12px' }}></div>
              <div className={styles.skeletonLine} style={{ width: '100%', height: '16px', marginBottom: '8px' }}></div>
              <div className={styles.skeletonLine} style={{ width: '80%', height: '16px', marginBottom: '16px' }}></div>
              <div className={styles.skeletonTags}>
                <div className={styles.skeletonTag}></div>
                <div className={styles.skeletonTag}></div>
                <div className={styles.skeletonTag}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className={styles.errorTitle}>Не удалось загрузить проекты</h3>
          <p className={styles.errorText}>{error}</p>
          <button onClick={fetchProjects} className={styles.retryButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l.591.591A7.004 7.004 0 018 1c3.145 0 5.842 2.078 6.702 4.94a.75.75 0 01-1.44.406C12.649 4.02 10.474 2.5 8 2.5zM1.018 10.06a.75.75 0 011.44-.406C3.351 11.98 5.526 13.5 8 13.5a5.487 5.487 0 004.131-1.869l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-.591-.591A7.004 7.004 0 018 15c-3.145 0-5.842-2.078-6.702-4.94z"/>
            </svg>
            Повторить загрузку
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div>
          <h2 className={styles.sectionTitle}>
            Проекты
            <span className={styles.countBadge}>{projects.length}</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Управляйте своими проектами и портфолио
          </p>
        </div>
        <div className={styles.headerActions}>
          <button onClick={fetchProjects} className={styles.iconButton} title="Обновить список">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M8 2.5a5.487 5.487 0 00-4.131 1.869l1.204 1.204A.25.25 0 014.896 6H1.25A.25.25 0 011 5.75V2.104a.25.25 0 01.427-.177l.591.591A7.004 7.004 0 018 1c3.145 0 5.842 2.078 6.702 4.94a.75.75 0 01-1.44.406C12.649 4.02 10.474 2.5 8 2.5zM1.018 10.06a.75.75 0 011.44-.406C3.351 11.98 5.526 13.5 8 13.5a5.487 5.487 0 004.131-1.869l-1.204-1.204a.25.25 0 01.177-.427h3.646a.25.25 0 01.25.25v3.646a.25.25 0 01-.427.177l-.591-.591A7.004 7.004 0 018 15c-3.145 0-5.842-2.078-6.702-4.94z"/>
            </svg>
          </button>
          <Link href="/dashboard/projects/new" className={styles.createButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/>
            </svg>
            Новый проект
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}>
            <div className={styles.emptyFolderIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                <line x1="12" y1="11" x2="12" y2="17"></line>
                <line x1="9" y1="14" x2="15" y2="14"></line>
              </svg>
            </div>
          </div>
          <h3 className={styles.emptyTitle}>Пока нет проектов</h3>
          <p className={styles.emptyDescription}>
            Создайте свой первый проект, чтобы продемонстрировать навыки и привлечь внимание работодателей
          </p>
          <Link href="/dashboard/projects/new" className={styles.emptyCreateButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2a.75.75 0 01.75.75v4.5h4.5a.75.75 0 010 1.5h-4.5v4.5a.75.75 0 01-1.5 0v-4.5h-4.5a.75.75 0 010-1.5h4.5v-4.5A.75.75 0 018 2z"/>
            </svg>
            Создать первый проект
          </Link>
        </div>
      ) : (
        <div className={styles.projectsGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectCardAccent}></div>
              
              <div className={styles.projectCardBody}>
                <div className={styles.projectCardHeader}>
                  <div className={styles.projectIcon}>
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                    </svg>
                  </div>
                  <div className={styles.projectTitleBlock}>
                    <h3 className={styles.projectCardTitle}>{project.title}</h3>
                  </div>
                </div>
                
                <p className={styles.projectCardDescription}>
                  {project.description || 'Описание отсутствует'}
                </p>

                {project.techStack && parseTechStack(project.techStack).length > 0 && (
                  <div className={styles.techStackWrapper}>
                    {parseTechStack(project.techStack).map((tech: string) => (
                      <span key={tech} className={styles.techBadge}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className={styles.projectCardFooter}>
                  <div className={styles.projectLinks}>
                    {project.repoUrl && (
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 .88.01 1.52.01 1.72 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        <span>Код</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.projectLink}
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M10.5 1a.5.5 0 01.5.5V2h1.5a2 2 0 012 2v9a2 2 0 01-2 2h-9a2 2 0 01-2-2V4a2 2 0 012-2H5v-.5a.5.5 0 011 0V2h4v-.5a.5.5 0 01.5-.5zM4 3.5a.5.5 0 00-1 0V4h-.5a1 1 0 00-1 1v.5h13V5a1 1 0 00-1-1H13v-.5a.5.5 0 00-1 0V4H4v-.5zm9 3H3v6.5a1 1 0 001 1h8a1 1 0 001-1V6.5z"/>
                        </svg>
                        <span>Демо</span>
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => deleteProject(project.id, project.title)}
                    className={styles.deleteButton}
                    title="Удалить проект"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                      <path fillRule="evenodd" d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5h-.75l-.94 9.4a1.5 1.5 0 01-1.49 1.35H5.82a1.5 1.5 0 01-1.49-1.35l-.94-9.4H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.35 4.5h7.3l-.9 9h-5.5l-.9-9z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}