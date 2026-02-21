'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { generateSQL, runQuery } from '@/app/actions/database'
import type { TableInfo } from '@/lib/schema'
import { Sparkles, Play, Copy, Check } from 'lucide-react'

interface AISQLGeneratorProps {
  schema: TableInfo[]
}

export function AISQLGenerator({ schema }: AISQLGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [sql, setSql] = useState('')
  const [results, setResults] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  // Format schema for AI
  const schemaText = schema.reduce((acc, col) => {
    const lastTable = acc[acc.length - 1]
    if (!lastTable || lastTable.table !== col.table_name) {
      acc.push({
        table: col.table_name,
        columns: [col.column_name],
      })
    } else {
      lastTable.columns.push(col.column_name)
    }
    return acc
  }, [] as Array<{ table: string; columns: string[] }>)
    .map(t => `${t.table}: ${t.columns.join(', ')}`)
    .join('\n')

  async function handleGenerate() {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setResults(null)

    const result = await generateSQL(prompt, schemaText)

    if (result.error) {
      setError(result.error)
      setSql('')
    } else {
      setSql(result.sql || '')
    }

    setLoading(false)
  }

  async function handleRun() {
    if (!sql.trim()) return

    setRunning(true)
    setError(null)
    setResults(null)

    const result = await runQuery(sql)

    if (result.error) {
      setError(result.error)
    } else {
      setResults(result.results || [])
    }

    setRunning(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI SQL Generator
          </CardTitle>
          <CardDescription>
            Describe what data you want in plain English, and AI will generate the SQL query
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="E.g., 'Show me all users created in the last 7 days'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              disabled={loading}
            />
            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>

          {sql && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Generated SQL</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={copied}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleRun}
                    disabled={running}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    {running ? 'Running...' : 'Run Query'}
                  </Button>
                </div>
              </div>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {sql}
              </pre>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Query Results</CardTitle>
            <CardDescription>
              {results.length} {results.length === 1 ? 'row' : 'rows'} returned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No results found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="text-left py-2 px-4 font-medium">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-muted/50">
                        {Object.values(row).map((value: any, cellIdx) => (
                          <td key={cellIdx} className="py-2 px-4">
                            {value === null ? (
                              <span className="text-muted-foreground italic">null</span>
                            ) : typeof value === 'object' ? (
                              JSON.stringify(value)
                            ) : (
                              String(value)
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
