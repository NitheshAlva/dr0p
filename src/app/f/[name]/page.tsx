import { notFound } from 'next/navigation'
import FileForm from '@/components/file/FileForm'
import FileViewer from '@/components/file/FileViewer'
import ProtectedNoteForm from '@/components/note/ProtectedNoteForm'
import { getFileInfo } from '@/lib/file-service'

interface PageProps {
  params: Promise<{ name: string }>
}

export default async function NotePage({ params }: PageProps) {
  const { name } = await params
  
  try {
    const fileInfo = await getFileInfo(name)
    
    // If file is protected, show password form
    if (fileInfo.isProtected) {
      return <ProtectedNoteForm name={name} />
    }
    
    // If file doesn't exist, show creation form
    if (fileInfo.isAvailable|| !fileInfo.file) {
      return <FileForm name={name} />
    }
    
    // If note exists and is public, show the note
    return <FileViewer name={name} file={fileInfo.file} url={fileInfo.url} />
    
  } catch (error) {
    console.error('Error fetching note info:', error)
    notFound()
  }
}