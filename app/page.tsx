import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'

export default async function HomePage() {
  const session = await getSession()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Database Analyst
          </h1>
          <p className="text-muted-foreground">
            Professional relational database analysis with AI-powered insights
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
