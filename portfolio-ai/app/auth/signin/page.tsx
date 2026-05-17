'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Неверный email или пароль')
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '0.25rem' }}>Вход в аккаунт</h1>
          <p style={{ fontSize: '0.875rem', color: '#8b949e' }}>Добро пожаловать обратно!</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            />
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
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8b949e', marginTop: '1.5rem' }}>
          Нет аккаунта?{' '}
          <Link href="/auth/signup" style={{ color: '#58a6ff' }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}