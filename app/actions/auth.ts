'use server'

import { redirect } from 'next/navigation'
import { createUser, authenticateUser, createSession, deleteSession } from '@/lib/auth'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    const user = await createUser(email, password)
    await createSession(user.id)
  } catch (error: any) {
    if (error.code === '23505') {
      return { error: 'Email already exists' }
    }
    return { error: 'Failed to create account' }
  }

  redirect('/dashboard')
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const user = await authenticateUser(email, password)

  if (!user) {
    return { error: 'Invalid email or password' }
  }

  await createSession(user.id)
  redirect('/dashboard')
}

export async function signOut() {
  await deleteSession()
  redirect('/')
}
