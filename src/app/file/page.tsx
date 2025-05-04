'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { nameValidation } from '@/schema/name.schema'
import { SlideButton } from '@/components/ui/get-started-button'

export default function CreateFilePage() {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }
  
  const onSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a file name')
      return
    }

    setIsSubmitting(true)
    
    try {
      const slug = name.trim().replaceAll(' ', '-').toLowerCase()
      const valid = nameValidation.safeParse(slug)
      
      if (valid.success) {
        router.push(`/file/${slug}`)
      } else {
        toast.error(valid.error.errors[0]?.message || 'Invalid file name')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen flex flex-col pt-15">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Upload or Access a File
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Type a name to upload or retrieve a file
          </p>
          
          <div className="mt-8 w-full max-w-md">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-1">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Enter file name..."
                  className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="File name"
                />
              </div>
              <div className="flex-shrink-0">
                <SlideButton 
                  onClick={onSubmit}
                  text="Go to File"
                  disabled={isSubmitting || !name.trim()}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Example Use
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• If you name your file <span className="font-medium">&quot;resume&quot;</span></li>
                <li>• It will be accessible at <span className="font-medium">drop.live/file/resume</span></li>
                <li>• Share this URL with others to access</li>
                <li>• Your file will be available until its expiration date</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Tips
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Maximum file size: <span className="font-medium">10MB</span></li>
                <li>• Protect sensitive files with a password</li>
                <li>• Set an expiration date for temporary files</li>
                <li>• Special characters are not allowed and spaces will be converted to hyphens</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}