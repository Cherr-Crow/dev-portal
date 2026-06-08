'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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

  const floatingIcons = [
    { icon: '⚛️', top: '10%', left: '8%', delay: 0, size: 2 },
    { icon: '🟦', top: '75%', left: '85%', delay: 1.5, size: 1.8 },
    { icon: '🔷', top: '85%', left: '10%', delay: 0.8, size: 2.2 },
    { icon: '🟩', top: '15%', left: '90%', delay: 2.2, size: 1.5 },
    { icon: '🟨', top: '80%', left: '70%', delay: 3, size: 2 },
    { icon: '🔶', top: '20%', left: '5%', delay: 1, size: 1.7 },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d1117',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Фоновое свечение */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(63, 185, 80, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 90, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Парящие иконки */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {floatingIcons.map((item, i) => (
          <motion.span
            key={i}
            style={{
              position: 'absolute',
              top: item.top,
              left: item.left,
              fontSize: `${item.size}rem`,
              opacity: 0.2,
              filter: 'blur(1px)',
              userSelect: 'none',
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, 15, -15, 0],
              rotate: [0, 25, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: item.delay,
              ease: 'easeInOut',
            }}
          >
            {item.icon}
          </motion.span>
        ))}
      </div>

      {/* Карточка */}
      <motion.div
        style={{
          maxWidth: '440px',
          width: '100%',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          position: 'relative',
          zIndex: 1,
        }}
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Иконка */}
        <motion.div
          style={{ textAlign: 'center', marginBottom: '1.5rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            style={{ display: 'inline-flex', marginBottom: '0.75rem' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#3fb950" strokeWidth="1.5">
              <motion.path
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.circle
                cx="9" cy="7" r="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
              <motion.line
                x1="19" y1="8" x2="19" y2="14"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              />
              <motion.line
                x1="22" y1="11" x2="16" y2="11"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              />
            </svg>
          </motion.div>
          <motion.h1
            style={{ fontSize: '1.5rem', fontWeight: 600, color: '#c9d1d9', marginBottom: '0.25rem' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Регистрация
          </motion.h1>
          <motion.p
            style={{ fontSize: '0.875rem', color: '#8b949e' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Создайте новый аккаунт
          </motion.p>
        </motion.div>

        {/* Форма */}
        <motion.form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Имя</label>
            <motion.input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Иван Петров"
              style={{
                padding: '0.65rem 0.85rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#c9d1d9',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              whileFocus={{ borderColor: '#58a6ff', boxShadow: '0 0 0 3px rgba(88,166,255,0.1)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Email</label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ivan@example.com"
              required
              style={{
                padding: '0.65rem 0.85rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#c9d1d9',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              whileFocus={{ borderColor: '#58a6ff', boxShadow: '0 0 0 3px rgba(88,166,255,0.1)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Пароль</label>
            <motion.input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                padding: '0.65rem 0.85rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#c9d1d9',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              whileFocus={{ borderColor: '#58a6ff', boxShadow: '0 0 0 3px rgba(88,166,255,0.1)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#c9d1d9' }}>Я хочу</label>
            <motion.select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: '0.65rem 0.85rem',
                background: '#0d1117',
                border: '1px solid #30363d',
                borderRadius: '8px',
                color: '#c9d1d9',
                fontSize: '0.9rem',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                fontFamily: 'inherit',
              }}
              whileFocus={{ borderColor: '#58a6ff', boxShadow: '0 0 0 3px rgba(88,166,255,0.1)' }}
            >
              <option value="DEVELOPER">Создавать портфолио (Разработчик)</option>
              <option value="EMPLOYER">Искать разработчиков (Работодатель)</option>
            </motion.select>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                style={{
                  background: 'rgba(248,81,73,0.1)',
                  border: '1px solid #f85149',
                  borderRadius: '8px',
                  padding: '0.65rem',
                  fontSize: '0.85rem',
                  color: '#f85149',
                  textAlign: 'center',
                }}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#1f6feb' : '#238636',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              fontWeight: 500,
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '0.25rem',
            }}
            whileHover={!loading ? { scale: 1.02, y: -2, background: '#2ea043' } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
          >
            {loading ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Регистрация...
              </motion.span>
            ) : (
              'Зарегистрироваться'
            )}
          </motion.button>
        </motion.form>

        <motion.p
          style={{ textAlign: 'center', fontSize: '0.875rem', color: '#8b949e', marginTop: '1.5rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Уже есть аккаунт?{' '}
          <Link href="/auth/signin" style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: 500 }}>
            Войти
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}