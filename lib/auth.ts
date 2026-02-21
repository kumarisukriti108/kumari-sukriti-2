import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'
import { query } from './db'

export interface User {
  id: number
  email: string
  created_at: Date
}

const SESSION_COOKIE_NAME = 'session_id'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string): Promise<User> {
  const passwordHash = await hashPassword(password)
  const users = await query<User>(
    'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
    [email, passwordHash]
  )
  return users[0]
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const users = await query<User & { password_hash: string }>(
    'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
    [email]
  )
  
  if (users.length === 0) {
    return null
  }
  
  const user = users[0]
  const isValid = await verifyPassword(password, user.password_hash)
  
  if (!isValid) {
    return null
  }
  
  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
  }
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  
  await query(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, $3)',
    [sessionId, userId, expiresAt]
  )
  
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  })
  
  return sessionId
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
    
    if (!sessionId) {
      return null
    }
    
    const sessions = await query<{ user_id: number }>(
      'SELECT user_id FROM sessions WHERE id = $1 AND expires_at > NOW()',
      [sessionId]
    )
    
    if (sessions.length === 0) {
      return null
    }
    
    const users = await query<User>(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [sessions[0].user_id]
    )
    
    if (users.length === 0) {
      return null
    }
    
    return { user: users[0] }
  } catch (error) {
    console.error('[v0] Session check failed:', error)
    return null
  }
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (sessionId) {
    await query('DELETE FROM sessions WHERE id = $1', [sessionId])
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME)
}
