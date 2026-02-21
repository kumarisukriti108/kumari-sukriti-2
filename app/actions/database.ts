'use server'

import { getTableSchema, getKeyConstraints, getTableSummaries, executeQuery } from '@/lib/schema'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function getSchemaData() {
  const [schema, keys, summaries] = await Promise.all([
    getTableSchema(),
    getKeyConstraints(),
    getTableSummaries(),
  ])

  return { schema, keys, summaries }
}

export async function runQuery(sql: string) {
  try {
    const results = await executeQuery(sql)
    return { results, error: null }
  } catch (error: any) {
    return { results: null, error: error.message }
  }
}

export async function generateSQL(prompt: string, schema: string) {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    return { sql: null, error: 'GEMINI_API_KEY is not configured' }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const systemPrompt = `You are a SQL expert. Generate a PostgreSQL query based on the user's request.
Database Schema:
${schema}

Rules:
- Only return the SQL query, no explanation
- Use standard PostgreSQL syntax
- Make sure the query is safe and won't modify data unless explicitly requested
- If the request is unclear, generate a simple SELECT query`

    const result = await model.generateContent(`${systemPrompt}\n\nUser request: ${prompt}`)
    const response = result.response.text()
    
    // Extract SQL from response (remove markdown code blocks if present)
    let sql = response.trim()
    if (sql.startsWith('```sql')) {
      sql = sql.replace(/```sql\n?/g, '').replace(/```\n?/g, '')
    } else if (sql.startsWith('```')) {
      sql = sql.replace(/```\n?/g, '')
    }
    
    return { sql: sql.trim(), error: null }
  } catch (error: any) {
    return { sql: null, error: error.message }
  }
}
