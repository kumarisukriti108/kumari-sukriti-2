'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TableSummary } from '@/lib/schema'
import { Table } from 'lucide-react'

interface DataPreviewProps {
  summaries: TableSummary[]
}

export function DataPreview({ summaries }: DataPreviewProps) {
  const totalRows = summaries.reduce((sum, table) => sum + table.row_count, 0)
  const totalTables = summaries.length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTables}</div>
            <p className="text-xs text-muted-foreground">
              Across entire database
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rows</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRows.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All records combined
            </p>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average per Table</CardTitle>
            <Table className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalTables > 0 ? Math.round(totalRows / totalTables).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Records per table
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Row Count by Table</CardTitle>
          <CardDescription>
            Distribution of records across database tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          {summaries.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No tables found in database
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summaries}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="table_name" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="row_count" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Table Details</CardTitle>
          <CardDescription>
            Complete list of tables and row counts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Table Name</th>
                  <th className="text-right py-3 px-4 font-medium">Row Count</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((table) => (
                  <tr key={table.table_name} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-mono text-sm">{table.table_name}</td>
                    <td className="py-3 px-4 text-right">{table.row_count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
