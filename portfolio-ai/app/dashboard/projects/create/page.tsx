'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    bio: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    website: ''
  })

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Ошибка создания профиля')
      }
    } catch (error) {
      setError('Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link 
          href="/dashboard" 
          style={{ color: '#58a6ff', textDecoration: 'none', fontSize: '14px' }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          ← Назад
        </Link>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#c9d1d9', marginBottom: '8px' }}>
          Создать профиль
        </h1>
        <p style={{ fontSize: '16px', color: '#8b949e' }}>
          Расскажите о себе, чтобы работодатели могли вас найти
        </p>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: 'rgba(248,81,73,0.1)',
          border: '1px solid #f85149',
          borderRadius: '6px',
          marginBottom: '20px',
          color: '#f85149'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label htmlFor="title" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c9d1d9', marginBottom: '8px' }}>
                Должность
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Frontend-разработчик"
                style={{ width: '100%', padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#238636'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label htmlFor="location" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c9d1d9', marginBottom: '8px' }}>
                Локация
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Москва, Россия"
                style={{ width: '100%', padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#238636'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label htmlFor="bio" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c9d1d9', marginBottom: '8px' }}>
                О себе
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Расскажите о себе..."
                style={{ width: '100%', padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#238636'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label htmlFor="githubUrl" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c9d1d9', marginBottom: '8px' }}>
                GitHub
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
                style={{ width: '100%', padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#238636'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c9d1d9', marginBottom: '8px' }}>
                LinkedIn
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                style={{ width: '100%', padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#238636'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
              />
            </div>

            <div>
              <label htmlFor="website" style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#c9d1d9', marginBottom: '8px' }}>
                Личный сайт
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://myportfolio.com"
                style={{ width: '100%', padding: '8px 12px', background: '#0d1117', border: '1px solid #30363d', borderRadius: '6px', color: '#c9d1d9', fontSize: '14px', outline: 'none' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#238636'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
              />
            </div>
          </div>

          <div style={{
            padding: '16px 24px',
            background: '#0d1117',
            borderTop: '1px solid #30363d',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <Link
              href="/dashboard"
              style={{
                padding: '6px 16px',
                background: '#21262d',
                color: '#c9d1d9',
                border: '1px solid #30363d',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Отмена
            </Link>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '6px 16px',
                background: '#238636',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Создание...' : 'Создать профиль'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}