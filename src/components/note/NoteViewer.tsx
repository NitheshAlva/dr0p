'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Copy, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface NoteViewerProps {
  name: string
  content: string
  expiresAt: Date
  isProtected: boolean
}

export default function NoteViewer({ name, content, expiresAt, isProtected }: NoteViewerProps) {
  const [formattedExpiry, setFormattedExpiry] = useState('')

  useEffect(() => {
    const updateExpiryTime = () => {
      const expiryDate = new Date(expiresAt)
      const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: true })
      setFormattedExpiry(timeLeft)
    }

    updateExpiryTime()
    const interval = setInterval(updateExpiryTime, 60000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(content)
      .then(() => toast.success('Content copied to clipboard'))
      .catch(() => toast.error('Failed to copy content'))
  }

  return (
    <div className="flex flex-col h-screen w-full pt-16">
      {/* Info bar */}
      <div className="bg-secondary/20 border-b flex items-center justify-between px-4 h-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
            <h2 className="font-medium">{name}</h2>
          </div>
          <Badge variant="outline" className="h-6">
            {isProtected ? 'Protected' : 'Public'}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Expires {new Date(expiresAt) < new Date() ? 'after view' : formattedExpiry}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
          <Copy className="mr-2 h-3 w-3" />
          Copy
        </Button>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <pre className="font-mono text-sm p-4 h-full whitespace-pre-wrap break-words">
          {content}
        </pre>
      </div>
    </div>
  )
}