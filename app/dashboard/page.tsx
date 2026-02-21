import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getSchemaData } from '@/app/actions/database'
import { DashboardClient } from '@/components/dashboard-client'
import { DashboardHeader } from '@/components/dashboard-header'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/')
  }

  const data = await getSchemaData()

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Database Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into your relational database structure
          </p>
        </div>
        <DashboardClient initialData={data} />
      </main>
    </div>
  )
}
