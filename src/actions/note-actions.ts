'use server'

import { noteSchema } from '@/schema/note.schema'
import { createNote, getNote } from '@/lib/note-service'
import * as z from 'zod'

export async function createNoteAction(data: z.infer<typeof noteSchema>) {
  try {
    const validatedData = noteSchema.parse(data)
    await createNote(validatedData)
    return { success: true }
  } catch (error) {
    console.error('Failed to create note:', error)
    return { success: false, error: 'Failed to create note' }
  }
}

export async function getNoteAction(name: string, password: string) {
  try {
    const resp = await getNote(name, password)
    if (!resp || !resp.note || !resp.ok) {
      return { success: false, message: resp.message || 'Invalid note or password' }
    }
    return { success: true, note: resp.note }
  } catch (error) {
    console.error('Error fetching note:', error)
    return { success: false, message: 'Error fetching note' }
  }
  
}