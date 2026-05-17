'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    const data = {
      title: formData.get('title') as string,
      bio: formData.get('bio') as string,
      location: formData.get('location') as string,
      githubUrl: formData.get('githubUrl') as string,
      linkedinUrl: formData.get('linkedinUrl') as string,
      website: formData.get('website') as string,
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const error = await res.json()
        setError(error.error || "Ошибка создания профиля")
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            ← Назад в дашборд
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Создать профиль разработчика</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Должность
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Frontend-разработчик, Full-stack разработчик..."
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Локация
              </label>
              <input
                id="location"
                name="location"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Москва, Россия • Удалённо"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-1">
                О себе
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Расскажите о себе, своём опыте и навыках..."
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">
                GitHub
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label htmlFor="linkedinUrl" className="block text-sm font-medium mb-1">
                LinkedIn
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Личный сайт / Портфолио
              </label>
              <input
                id="website"
                name="website"
                type="url"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://myportfolio.com"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loading ? 'Создание...' : 'Создать профиль'}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}