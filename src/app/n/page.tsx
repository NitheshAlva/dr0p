'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { nameValidation } from '@/schema/name.schema'
import { SlideButton } from '@/components/ui/get-started-button'

export default function CreateNotePage() {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  const onSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a note name')
      return
    }

    setIsSubmitting(true)
    
    try {
      const slug = name.trim().replaceAll(' ', '-').toLowerCase()
      const valid = nameValidation.safeParse(slug)
      
      if (valid.success) {
        router.push(`/n/${slug}`)
      } else {
        toast.error(valid.error.errors[0]?.message || 'Invalid note name')
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
            Create or Access a Note
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Type a name and click &quot;Go to Note&quot; to create or access it
          </p>
          
          <div className="mt-8 w-full max-w-md">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-1">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  type="text"
                  placeholder="Enter note name..."
                  className="w-full px-4 py-3 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  aria-label="Note name"
                />
              </div>
              <div className="flex-shrink-0">
                <SlideButton 
                  onClick={onSubmit}
                  text="Go to Note"
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
                <li>• If you name your note <span className="font-medium">&quot;shopping list&quot;</span></li>
                <li>• It will be accessible at <span className="font-medium">drop.live/n/shopping-list</span></li>
                <li>• Share this URL with others to access</li>
                <li>• Your note will be available until its expiration date</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
              <h3 className="text-xl font-semibold mb-3">
                Tips
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Use simple, memorable names like <span className="font-medium">&quot;shopping-list&quot;</span></li>
                <li>• Protect sensitive notes with a password</li>
                <li>• Set an expiration date for temporary notes</li>
                <li>• Special characters are not allowed and spaces will be converted to hyphens</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}