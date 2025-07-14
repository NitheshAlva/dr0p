'use client'
import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Clock, Download, File, Table, Archive } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'

interface FileData {
  name: string;
  id: string;
  file_key: string;
  original_filename: string;
  password_hash: string | null;
  expires_at: Date;
  created_at: Date;
  file_type: string;
  url?: string;
}

interface FileViewerProps {
  file: FileData
  name: string
  url: string
}

export default function FileViewer({ file, name, url }: FileViewerProps) {
  const [formattedExpiry, setFormattedExpiry] = useState('')
  
  useEffect(() => {
    const updateExpiryTime = () => {
      const expiryDate = new Date(file.expires_at)
      const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: true })
      setFormattedExpiry(timeLeft)
    }

    updateExpiryTime()
    const interval = setInterval(updateExpiryTime, 60000)
    return () => clearInterval(interval)
  }, [file.expires_at])

  const getFileTypeColor = (fileType?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!fileType) return "default"
    
    if (fileType.includes('image')) return "default"
    if (fileType.includes('pdf')) return "destructive"
    if (fileType.includes('doc') || fileType.includes('word')) return "secondary"
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return "outline"
    if (fileType.includes('zip') || fileType.includes('archive')) return "secondary"
    
    return "default"
  }

  const getFileTypeLabel = (fileType: string) => {
    if (!fileType) return "Unknown"
    
    if (fileType.startsWith('image/')) return "Image"
    if (fileType.startsWith('video/')) return "Video"
    if (fileType.startsWith('audio/')) return "Audio"
    if (fileType.includes('pdf')) return "PDF Document"
    if (fileType.includes('word') || fileType.includes('doc')) return "Word Document"
    if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xlsx')) return "Spreadsheet"
    if (fileType.includes('zip') || fileType.includes('archive')) return "Archive"
    
    return "Document"
  }

  const getFileIcon = (fileType: string) => {
    if (fileType?.includes('pdf')) {
      return <FileText className="h-16 w-16 text-primary" />
    }
    if (fileType?.includes('word') || fileType?.includes('doc')) {
      return <File className="h-16 w-16 text-blue-500" />
    }
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel') || fileType?.includes('xlsx')) {
      return <Table className="h-16 w-16 text-green-500" />
    }
    if (fileType?.includes('zip') || fileType?.includes('archive')) {
      return <Archive className="h-16 w-16 text-yellow-500" />
    }
    return <File className="h-16 w-16 text-muted-foreground" />
  }

  const renderPreview = () => {
    if (file?.file_type.startsWith('image/')) {
      return (
        <div className="relative w-full max-h-96 flex items-center justify-center">
          <Image
            src={url}
            alt={file.original_filename || "File preview"}
            className="object-contain max-h-96 max-w-full"
          />
        </div>
      )
    }
    
    if (file?.file_type.startsWith('video/')) {
      return (
        <video controls className="max-h-96 max-w-full" src={url}>
          Your browser does not support video playback.
        </video>
      )
    }
    
    if (file?.file_type.startsWith('audio/')) {
      return (
        <audio controls className="w-full" src={url}>
          Your browser does not support audio playback.
        </audio>
      )
    }
    
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <div className="bg-muted/50 p-8 rounded-full mb-4">
          {getFileIcon(file?.file_type)}
        </div>
        <p className="text-lg font-medium">{file?.original_filename}</p>
        <p className="text-sm text-muted-foreground">{file?.file_type}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full pt-15">
      {/* File Header */}
      <div className="bg-secondary/20 border-b flex items-center justify-between px-4 py-2 h-12">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
            <h2 className="font-medium">{file?.name || name}</h2>
          </div>
          <Badge variant="outline" className="h-6">
            {file?.password_hash ? "Protected" : "Public"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Expires {new Date(file?.expires_at) < new Date() ? ' after view' : formattedExpiry}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(url)}
          className="h-8"
        >
          <Download className="mr-2 h-3 w-3" />
          Download
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4 flex flex-col items-center justify-center">
        <div className="bg-background rounded-lg overflow-y-auto shadow-lg max-w-2xl w-full overflow-hidden">
          {/* File Preview */}
          <div className="border-b p-6 flex justify-center">
            {renderPreview()}
          </div>
          
          {/* File Details */}
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">File Information</h3>
              <Badge variant={getFileTypeColor(file?.file_type)}>
                {getFileTypeLabel(file?.file_type)}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original Name:</span>
                <span className="font-medium">{file?.original_filename}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">File Type:</span>
                <span className="font-medium">{file?.file_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expiry Date:</span>
                <span className="font-medium">{formattedExpiry}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">File ID:</span>
                <span className="font-mono text-xs">{file?.id}</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Button onClick={() => window.open(url)} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download File
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}