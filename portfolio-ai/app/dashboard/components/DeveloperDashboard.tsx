// app/dashboard/components/DeveloperDashboard.tsx
'use client'

import Link from 'next/link'
import styles from '../page.module.css'

interface DeveloperDashboardProps {
  user: any
}

export default function DeveloperDashboard({ user }: DeveloperDashboardProps) {
  return (
    <div>
      {/* Кнопка перехода в чаты - ТАКАЯ ЖЕ КАК У РАБОТОДАТЕЛЯ */}
      <div className={styles.chatNavButton}>
        <Link href="/dashboard/chats" className={styles.allChatsButton}>
          💬 Все чаты
        </Link>
      </div>

      {/* Профиль */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Профиль разработчика</h2>
          <Link href="/dashboard/profile" className={styles.editLink}>
            Редактировать
          </Link>
        </div>

        {user?.profile ? (
          <div className={styles.profileContent}>
            <div className={styles.profileField}>
              <span className={styles.profileLabel}>Должность:</span>
              <span className={styles.profileValue}>{user.profile.title || 'Не указана'}</span>
            </div>
            <div className={styles.profileField}>
              <span className={styles.profileLabel}>Локация:</span>
              <span className={styles.profileValue}>{user.profile.location || 'Не указана'}</span>
            </div>
            <div className={styles.profileField}>
              <span className={styles.profileLabel}>О себе:</span>
              <span className={styles.profileValue}>{user.profile.bio || 'Не указано'}</span>
            </div>
            <div className={styles.profileLinks}>
              {user.profile.githubUrl && (
                <a href={user.profile.githubUrl} target="_blank" className={styles.externalLink}>GitHub</a>
              )}
              {user.profile.linkedinUrl && (
                <a href={user.profile.linkedinUrl} target="_blank" className={styles.externalLink}>LinkedIn</a>
              )}
              {user.profile.website && (
                <a href={user.profile.website} target="_blank" className={styles.externalLink}>Сайт</a>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.emptyProfile}>
            <p className={styles.emptyText}>У вас ещё нет профиля разработчика</p>
            <Link href="/dashboard/profile" className={styles.createButton}>
              Создать профиль
            </Link>
          </div>
        )}
      </section>

      {/* Проекты */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Мои проекты ({user?.projects?.length || 0})</h2>
          <Link href="/dashboard/projects/new" className={styles.createButton}>
            + Добавить проект
          </Link>
        </div>

        {user?.projects?.length > 0 ? (
          <div className={styles.projectsGrid}>
            {user.projects.map((project: any) => (
              <div key={project.id} className={styles.projectCard}>
                <div className={styles.projectCardHeader}>
                  <div className={styles.projectIcon}>📁</div>
                  <h3 className={styles.projectCardTitle}>{project.title}</h3>
                </div>
                <p className={styles.projectCardDescription}>{project.description}</p>
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
                <div className={styles.projectCardFooter}>
                  <div className={styles.projectLinks}>
                    {project.demoUrl && <a href={project.demoUrl} target="_blank" className={styles.projectLink}>Демо</a>}
                    {project.repoUrl && <a href={project.repoUrl} target="_blank" className={styles.projectLink}>Репозиторий</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyProjects}>
            <div className={styles.emptyIcon}>📁</div>
            <p className={styles.emptyText}>У вас пока нет проектов</p>
          </div>
        )}
      </section>
    </div>
  )
}