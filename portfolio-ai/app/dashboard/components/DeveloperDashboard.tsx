'use client'

import Link from 'next/link'
import styles from '../page.module.css'

interface DeveloperDashboardProps {
  user: any
}

export default function DeveloperDashboard({ user }: DeveloperDashboardProps) {
  return (
    <div>
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
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
                <div className={styles.projectLinks}>
                  {project.demoUrl && <a href={project.demoUrl} target="_blank" className={styles.projectLink}>Демо</a>}
                  {project.repoUrl && <a href={project.repoUrl} target="_blank" className={styles.projectLink}>Репозиторий</a>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyProjects}>
            <p className={styles.emptyText}>У вас пока нет проектов</p>
          </div>
        )}
      </section>

      {/* Чаты */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Чаты</h2>
        </div>
        <div className={styles.profileContent}>
          <p>Загрузка чатов...</p>
        </div>
      </section>
    </div>
  )
}