import { auth } from "@/auth"
import { prisma } from "@/app/lib/prisma"
import DeveloperDashboard from "./components/DeveloperDashboard"
import EmployerDashboard from "./components/EmployerDashboard"
import styles from './page.module.css'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className={styles.section}>
        <div className={styles.profileContent}>
          <p>Вы не вошли в систему.</p>
        </div>
      </div>
    )
  }


  if (session.user.role === 'EMPLOYER') {
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

    return <EmployerDashboard user={session.user} initialDevelopers={developers} />
  }

 
  if (session.user.role === 'DEVELOPER') {
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

    return <DeveloperDashboard user={user} />
  }

 
  return (
    <div className={styles.section}>
      <div className={styles.profileContent}>
        <p>Роль не определена.</p>
      </div>
    </div>
  )
}