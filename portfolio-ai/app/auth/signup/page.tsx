'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('DEVELOPER')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })

    const data = await res.json()

    if (res.ok) {
      router.push('/auth/signin?registered=true')
    } else {
      setError(data.error || 'Ошибка регистрации')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d1117',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '0.25rem' }}>Регистрация</h1>
          <p style={{ fontSize: '0.875rem', color: '#8b949e' }}>Создайте новый аккаунт</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Петров"
              style={{
                padding: '0.5rem 0.75rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#c9d1d9',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ivan@example.com"
              required
              style={{
                padding: '0.5rem 0.75rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#c9d1d9',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                padding: '0.5rem 0.75rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#c9d1d9',
                fontSize: '0.875rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#58a6ff'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#30363d'}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Я хочу</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: '#c9d1d9',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <option value="DEVELOPER">👨‍💻 Создавать портфолио (Разработчик)</option>
              <option value="EMPLOYER">🏢 Искать разработчиков (Работодатель)</option>
            </select>
          </div>

          {error && (
            <div style={{
              background: 'rgba(248,81,73,0.1)',
              border: '1px solid #f85149',
              borderRadius: '6px',
              padding: '0.5rem',
              fontSize: '0.875rem',
              color: '#f85149',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#238636',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#2ea043' }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#238636' }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8b949e', marginTop: '1.5rem' }}>
          Уже есть аккаунт?{' '}
          <Link href="/auth/signin" style={{ color: '#58a6ff' }}>Войти</Link>
        </p>
      </div>
    </div>
  )
}