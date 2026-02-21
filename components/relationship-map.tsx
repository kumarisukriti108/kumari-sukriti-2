'use client'

import { useMemo } from 'react'
import ReactFlow, { 
  Node, 
  Edge, 
  Background, 
  Controls, 
  MiniMap,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { KeyInfo, TableInfo } from '@/lib/schema'

interface RelationshipMapProps {
  keys: KeyInfo[]
  schema: TableInfo[]
}

export function RelationshipMap({ keys, schema }: RelationshipMapProps) {
  const { nodes, edges } = useMemo(() => {
    // Get unique table names
    const tableNames = Array.from(new Set(schema.map(s => s.table_name)))
    
    // Create nodes for each table
    const nodes: Node[] = tableNames.map((tableName, index) => {
      const columns = schema.filter(s => s.table_name === tableName)
      const primaryKeys = keys.filter(
        k => k.table_name === tableName && k.constraint_type === 'PRIMARY KEY'
      )
      
      return {
        id: tableName,
        type: 'default',
        data: { 
          label: (
            <div className="p-2 min-w-[200px]">
              <div className="font-bold text-sm mb-2 border-b pb-1">{tableName}</div>
              <div className="text-xs space-y-0.5">
                {columns.slice(0, 5).map((col, idx) => {
                  const isPK = primaryKeys.some(pk => pk.column_name === col.column_name)
                  return (
                    <div key={idx} className={isPK ? 'font-semibold' : ''}>
                      {isPK && '🔑 '}
                      {col.column_name}
                    </div>
                  )
                })}
                {columns.length > 5 && (
                  <div className="text-muted-foreground">
                    +{columns.length - 5} more...
                  </div>
                )}
              </div>
            </div>
          )
        },
        position: { 
          x: (index % 3) * 300 + 50, 
          y: Math.floor(index / 3) * 200 + 50 
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: 'hsl(var(--card))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '8px',
          fontSize: '12px',
        },
      }
    })
    
    // Create edges for foreign key relationships
    const edges: Edge[] = keys
      .filter(k => k.constraint_type === 'FOREIGN KEY' && k.foreign_table_name)
      .map((key, index) => ({
        id: `e${index}`,
        source: key.table_name,
        target: key.foreign_table_name!,
        label: key.column_name,
        type: 'smoothstep',
        animated: true,
        style: { stroke: 'hsl(var(--primary))' },
        labelStyle: { 
          fill: 'hsl(var(--foreground))', 
          fontSize: 10,
          background: 'hsl(var(--background))',
        },
      }))
    
    return { nodes, edges }
  }, [keys, schema])

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Entity Relationship Diagram</CardTitle>
        <CardDescription>
          Visual representation of table relationships through foreign keys
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height: '600px', width: '100%' }}>
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No tables found in database
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              fitView
              attributionPosition="bottom-left"
            >
              <Background />
              <Controls />
              <MiniMap 
                nodeColor="hsl(var(--primary))"
                maskColor="hsl(var(--muted))"
              />
            </ReactFlow>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
