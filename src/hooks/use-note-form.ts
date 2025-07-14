import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { noteSchema } from '@/schema/note.schema'
import * as z from 'zod'
import { createNoteAction } from '@/actions/note-actions'

export function useNoteForm(name: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      name,
      content: '',
      isProtected: false,
      password: '',
      expiry: 0
    }
  })

  
  useEffect(() => {
    let isMounted = true
    
    const validateName = async () => {
      const isValid = await form.trigger('name')
      if (!isValid && isMounted) {
        const fieldError = form.getFieldState('name').error
        setErrorMessage(fieldError?.message || '')
      }
    }
    
    validateName()
    
    return () => {
      isMounted = false
    }
  }, [form, name])

  const handleDialogOpen = async () => {
    const valid = await form.trigger('content')
    if (valid) {
      setOpenDialog(true)
    }
  }

  const onSubmit = async (data: z.infer<typeof noteSchema>) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    const result = await createNoteAction(data)
      
    if (result.success) {
      toast.success('Note has been created')
      setShowQR(true)
      form.reset()
    } else {
      toast.error(result.error || 'Failed to create note')
    }
    setIsSubmitting(false)
    setOpenDialog(false)
  }

  return {
    form,
    isSubmitting,
    errorMessage,
    showQR,
    openDialog,
    setOpenDialog,
    handleDialogOpen,
    onSubmit
  }
}