
import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import DeveloperDashboard from "./components/DeveloperDashboard"
import EmployerDashboard from "./components/EmployerDashboard"
import styles from './page.module.css'


interface SessionUser {
  id: string
  name: string | null
  email: string
  role: 'DEVELOPER' | 'EMPLOYER'
}

interface Session {
  user?: SessionUser
}

export default async function DashboardPage() {
  const session = await auth() as Session | null

  if (!session?.user) {
    return (
      <div className={styles.section}>
        <div className={styles.profileContent}>
          <p>Вы не вошли в систему.</p>
        </div>
      </div>
    )
  }


  const userRole = session.user.role

  if (userRole === 'EMPLOYER') {
    const developers = await prisma.user.findMany({
      where: { role: 'DEVELOPER' },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            title: true,
            location: true,
            bio: true,
          }
        },
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
          }
        }
      }
    })

    // Минимальное изменение - добавляем as any
    return <EmployerDashboard user={session.user} initialDevelopers={developers as any} />
  }

  if (userRole === 'DEVELOPER') {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        projects: {
          select: {
            id: true,
            title: true,
            description: true,
            techStack: true,
            demoUrl: true,
            repoUrl: true,
          }
        }
      }
    })

    // Проверка что пользователь найден
    if (!user) {
      return (
        <div className={styles.section}>
          <div className={styles.profileContent}>
            <p>Пользователь не найден.</p>
          </div>
        </div>
      )
    }

    return <DeveloperDashboard user={user} />
  }

  // Если роль не распознана
  return (
    <div className={styles.section}>
      <div className={styles.profileContent}>
        <p>Роль не определена. Обратитесь к администратору.</p>
      </div>
    </div>
  )
}