import { query } from './db'

export interface TableInfo {
  table_name: string
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

export interface KeyInfo {
  table_name: string
  column_name: string
  constraint_type: string
  foreign_table_name: string | null
  foreign_column_name: string | null
}

export interface TableSummary {
  table_name: string
  row_count: number
}

export async function getTableSchema(): Promise<TableInfo[]> {
  const sql = `
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable,
      column_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `
  return query<TableInfo>(sql)
}

export async function getKeyConstraints(): Promise<KeyInfo[]> {
  const sql = `
    SELECT 
      tc.table_name,
      kcu.column_name,
      tc.constraint_type,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
      AND tc.table_schema = ccu.table_schema
    WHERE tc.table_schema = 'public'
      AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY')
    ORDER BY tc.table_name, kcu.column_name
  `
  return query<KeyInfo>(sql)
}

export async function getTableSummaries(): Promise<TableSummary[]> {
  const tables = await query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
  )
  
  const summaries: TableSummary[] = []
  for (const table of tables) {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) as count FROM ${table.table_name}`
    )
    summaries.push({
      table_name: table.table_name,
      row_count: parseInt(result[0].count, 10),
    })
  }
  
  return summaries
}

export async function executeQuery(sql: string): Promise<any[]> {
  return query(sql)
}
