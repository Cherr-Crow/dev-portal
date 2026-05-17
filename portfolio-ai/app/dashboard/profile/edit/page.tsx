'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function EditProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    bio: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    website: "",
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setFormData({
              title: data.title || "",
              bio: data.bio || "",
              location: data.location || "",
              githubUrl: data.githubUrl || "",
              linkedinUrl: data.linkedinUrl || "",
              website: data.website || "",
            })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetchLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      })

      if (res.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        const error = await res.json()
        setError(error.error || "Ошибка обновления профиля")
      }
    } catch (err) {
      setError("Произошла ошибка")
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return (
      <main className="min-h-screen p-8 bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Загрузка...</p>
      </main>
    )
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
          <h1 className="text-3xl font-bold mb-6">Редактировать профиль</h1>
          
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
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Frontend-разработчик"
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
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Москва, Россия"
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
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Расскажите о себе..."
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
                value={formData.githubUrl}
                onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
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
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium mb-1">
                Личный сайт
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
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
                {loading ? 'Сохранение...' : 'Сохранить'}
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