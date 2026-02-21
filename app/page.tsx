import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { isDatabaseConfigured } from '@/lib/db'
import { AuthForm } from '@/components/auth-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function HomePage() {
  // Check if database is configured
  if (!isDatabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Database Analyst
            </h1>
            <p className="text-muted-foreground">
              Professional relational database analysis with AI-powered insights
            </p>
          </div>
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-yellow-500">Setup Required</CardTitle>
              <CardDescription>
                Please configure your environment variables to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
                <div className="space-y-2 font-mono text-sm bg-background/50 p-4 rounded-md">
                  <div>
                    <span className="text-primary">DATABASE_URL</span>
                    <span className="text-muted-foreground"> = postgresql://user:password@host:port/database</span>
                  </div>
                  <div>
                    <span className="text-primary">GEMINI_API_KEY</span>
                    <span className="text-muted-foreground"> = your_google_gemini_api_key</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Add the environment variables in the Vars section of the sidebar</li>
                  <li>Run the database setup script: <code className="text-xs bg-background px-1 py-0.5 rounded">scripts/setup-database.sql</code></li>
                  <li>Refresh this page to continue</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

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
