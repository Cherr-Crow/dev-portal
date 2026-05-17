'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../page.module.css'

export default function NewProject() {
  const router = useRouter()
  const [techStack, setTechStack] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addTech = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return
    e.preventDefault()
    const tech = techInput.trim()
    if (tech && !techStack.includes(tech)) {
      setTechStack([...techStack, tech])
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter(t => t !== tech))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const fd = new FormData(e.target as HTMLFormElement)
    const data = {
      title: fd.get('title'),
      description: fd.get('description'),
      repoUrl: fd.get('repoUrl'),
      demoUrl: fd.get('demoUrl'),
      techStack
    }

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Ошибка при создании')
      }

      // Сначала обновляем кеш, потом переходим
      router.refresh()
      // Небольшая задержка чтобы refresh успел сработать
      setTimeout(() => {
        router.push('/dashboard/projects')
      }, 100)
      
    } catch (err: any) {
      setError(err.message || 'Ошибка соединения')
      setLoading(false)
    }
  }

  return (
    <div className={styles.section}>
      {/* Заголовок */}
      <div className={styles.sectionHeader}>
        <div className={styles.sectionHeaderLeft}>
          <Link href="/dashboard/projects" className={styles.backButton}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path fillRule="evenodd" d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"/>
            </svg>
            Назад
          </Link>
          <h2 className={styles.sectionTitle}>Новый проект</h2>
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} className={styles.errorClose}>×</button>
        </div>
      )}

      {/* Сообщение об успехе */}
      {loading && (
        <div className={styles.successBanner}>
          <span className={styles.spinnerSmall}></span>
          Создаём проект...
        </div>
      )}

      <form onSubmit={submit} className={styles.formContainer}>
        {/* Название проекта */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Название проекта <span className={styles.required}>*</span>
          </label>
          <input
            name="title"
            type="text"
            placeholder="Введите название проекта"
            required
            className={styles.formInput}
            autoFocus
            disabled={loading}
          />
          <span className={styles.formHint}>
            Хорошее название — короткое и запоминающееся
          </span>
        </div>

        {/* Описание */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Описание</label>
          <textarea
            name="description"
            rows={5}
            placeholder="Опишите ваш проект, его функциональность и особенности"
            className={styles.formTextarea}
            disabled={loading}
          />
        </div>

        {/* Технологии */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Технологии</label>
          <div className={styles.techInputWrapper}>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={addTech}
              placeholder="React, TypeScript, Node.js..."
              className={styles.formInput}
              disabled={loading}
            />
            <button
              type="button"
              onClick={addTech}
              className={styles.techAddButton}
              disabled={loading}
            >
              + Добавить
            </button>
          </div>
          
          {techStack.length > 0 && (
            <div className={styles.techStackForm}>
              {techStack.map(tech => (
                <span key={tech} className={styles.techBadgeForm}>
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className={styles.techRemoveButton}
                    aria-label={`Удалить ${tech}`}
                    disabled={loading}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 4.94L2.53 1.47a.75.75 0 00-1.06 1.06L4.94 6 1.47 9.47a.75.75 0 001.06 1.06L6 7.06l3.47 3.47a.75.75 0 001.06-1.06L7.06 6l3.47-3.47a.75.75 0 00-1.06-1.06L6 4.94z"/>
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Ссылки */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Репозиторий
            </label>
            <div className={styles.inputWithIcon}>
              <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="#8b949e">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 .88.01 1.52.01 1.72 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <input
                name="repoUrl"
                type="url"
                placeholder="https://github.com/username/repo"
                className={styles.formInput}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Демо
            </label>
            <div className={styles.inputWithIcon}>
              <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 16 16" fill="#8b949e">
                <path fillRule="evenodd" d="M1.5 2.75a.25.25 0 01.25-.25h12.5a.25.25 0 01.25.25v8.5a.25.25 0 01-.25.25H1.75a.25.25 0 01-.25-.25v-8.5zM1.75 1A1.75 1.75 0 000 2.75v8.5C0 12.216.784 13 1.75 13h12.5A1.75 1.75 0 0016 11.25v-8.5A1.75 1.75 0 0014.25 1H1.75zM13 5.5a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5zm-8.5 3a.75.75 0 00-1.5 0v2a.75.75 0 001.5 0v-2zm4.5-2a.75.75 0 00-1.5 0v4a.75.75 0 001.5 0v-4z"/>
              </svg>
              <input
                name="demoUrl"
                type="url"
                placeholder="https://your-project.vercel.app"
                className={styles.formInput}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className={styles.formActions}>
          <Link href="/dashboard/projects" className={styles.cancelButton}>
            Отмена
          </Link>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                Создание...
              </>
            ) : (
              'Создать проект'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}