'use client'

import dynamic from 'next/dynamic'

const DeveloperDashboard = dynamic(() => import('./components/DeveloperDashboard'), { ssr: false })
const EmployerDashboard = dynamic(() => import('./components/EmployerDashboard'), { ssr: false })

interface DashboardClientProps {
  user: any
  developers?: any[]
  searchQuery?: string
  isDeveloper: boolean
}

export default function DashboardClient({ user, developers, searchQuery, isDeveloper }: DashboardClientProps) {
  return (
    <>
      {isDeveloper ? (
        <DeveloperDashboard user={user} />
      ) : (
        <EmployerDashboard user={user} initialDevelopers={developers || []} searchQuery={searchQuery} />
      )}
    </>
  )
}