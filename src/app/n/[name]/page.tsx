import { notFound } from 'next/navigation'
import NoteForm from '@/components/note/NoteForm'
import NoteViewer from '@/components/note/NoteViewer'
import ProtectedNoteForm from '@/components/note/ProtectedNoteForm'
import { getNoteInfo } from '@/lib/note-service'

interface PageProps {
  params: Promise<{ name: string }>
}

export default async function NotePage({ params }: PageProps) {
  const { name } = await params
  
  try {
    const noteInfo = await getNoteInfo(name)
    
    // If note is protected, show password form
    if (noteInfo.isProtected) {
      return <ProtectedNoteForm name={name} />
    }
    
    // If note doesn't exist, show creation form
    if (noteInfo.isAvailable|| !noteInfo.note) {
      return <NoteForm name={name} />
    }
    
    // If note exists and is public, show the note
    return <NoteViewer name={name} content={noteInfo.note?.content} expiresAt={noteInfo.note.expires_at} isProtected={false} />
    
  } catch (error) {
    console.error('Error fetching note info:', error)
    notFound()
  }
}