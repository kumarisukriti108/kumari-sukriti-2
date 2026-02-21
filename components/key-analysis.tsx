'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TableInfo, KeyInfo } from '@/lib/schema'
import { Key, Link2 } from 'lucide-react'

interface KeyAnalysisProps {
  schema: TableInfo[]
  keys: KeyInfo[]
}

export function KeyAnalysis({ schema, keys }: KeyAnalysisProps) {
  // Group keys by table
  const keysByTable = keys.reduce((acc, key) => {
    if (!acc[key.table_name]) {
      acc[key.table_name] = []
    }
    acc[key.table_name].push(key)
    return acc
  }, {} as Record<string, KeyInfo[]>)

  // Get unique table names from schema
  const tables = Array.from(new Set(schema.map(s => s.table_name))).sort()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Keys</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {keys.filter(k => k.constraint_type === 'PRIMARY KEY').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all tables
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Foreign Keys</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {keys.filter(k => k.constraint_type === 'FOREIGN KEY').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Relationships defined
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Constraints by Table</CardTitle>
          <CardDescription>
            Primary and foreign key relationships in your database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {tables.map(tableName => {
              const tableKeys = keysByTable[tableName] || []
              const primaryKeys = tableKeys.filter(k => k.constraint_type === 'PRIMARY KEY')
              const foreignKeys = tableKeys.filter(k => k.constraint_type === 'FOREIGN KEY')
              
              return (
                <div key={tableName} className="border rounded-lg p-4 space-y-3">
                  <h3 className="font-mono font-semibold text-lg">{tableName}</h3>
                  
                  {primaryKeys.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Key className="h-4 w-4 text-primary" />
                        Primary Keys
                      </div>
                      <div className="flex flex-wrap gap-2 ml-6">
                        {primaryKeys.map((key, idx) => (
                          <Badge key={idx} variant="default">
                            {key.column_name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {foreignKeys.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Link2 className="h-4 w-4 text-accent" />
                        Foreign Keys
                      </div>
                      <div className="space-y-1 ml-6">
                        {foreignKeys.map((key, idx) => (
                          <div key={idx} className="text-sm">
                            <Badge variant="outline" className="font-mono">
                              {key.column_name}
                            </Badge>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span className="font-mono text-muted-foreground">
                              {key.foreign_table_name}.{key.foreign_column_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {primaryKeys.length === 0 && foreignKeys.length === 0 && (
                    <p className="text-sm text-muted-foreground">No key constraints defined</p>
                  )}
                </div>
              )
            })}
            
            {tables.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tables found in database
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
