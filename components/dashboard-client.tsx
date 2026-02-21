'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataPreview } from '@/components/data-preview'
import { KeyAnalysis } from '@/components/key-analysis'
import { RelationshipMap } from '@/components/relationship-map'
import { AISQLGenerator } from '@/components/ai-sql-generator'
import type { TableInfo, KeyInfo, TableSummary } from '@/lib/schema'

interface DashboardClientProps {
  initialData: {
    schema: TableInfo[]
    keys: KeyInfo[]
    summaries: TableSummary[]
  }
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState('preview')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4 lg:w-auto">
        <TabsTrigger value="preview">Data Preview</TabsTrigger>
        <TabsTrigger value="keys">Key Analysis</TabsTrigger>
        <TabsTrigger value="relationships">Relationships</TabsTrigger>
        <TabsTrigger value="ai">AI SQL</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="mt-6">
        <DataPreview summaries={initialData.summaries} />
      </TabsContent>

      <TabsContent value="keys" className="mt-6">
        <KeyAnalysis schema={initialData.schema} keys={initialData.keys} />
      </TabsContent>

      <TabsContent value="relationships" className="mt-6">
        <RelationshipMap keys={initialData.keys} schema={initialData.schema} />
      </TabsContent>

      <TabsContent value="ai" className="mt-6">
        <AISQLGenerator schema={initialData.schema} />
      </TabsContent>
    </Tabs>
  )
}
