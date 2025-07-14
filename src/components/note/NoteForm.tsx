'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Plus } from 'lucide-react'
import { useNoteForm } from '@/hooks/use-note-form'
import { ErrorPage } from '../ErrorPage'
import { SuccessPage } from '@/components/SuccessPage'
import { NoteFormDialog } from './NoteFormDialog'

interface NoteFormProps {
  name: string
}

export default function NoteForm({ name }: NoteFormProps) {
  const {
    form,
    isSubmitting,
    errorMessage,
    showQR,
    openDialog,
    setOpenDialog,
    handleDialogOpen,
    onSubmit
  } = useNoteForm(name)

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />
  }

  if (showQR) {
    return <SuccessPage name={name} isNote={true}/>
  }

  return (
    <div className="flex-col min-h-screen w-full pt-14">
      <div className="flex px-5 pt-3 justify-between items-center">
        <div className="text-red-500 text-sm">
          {form.formState.errors?.content?.message || ''}
        </div>
        <Button type="button" onClick={handleDialogOpen}>
          <Plus className="mr-2 h-4 w-4" />
          Create Note
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col flex-1">
          <div className="flex-1 bg-muted/30 p-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormControl>
                    <Textarea
                      placeholder="Type or paste your content here..."
                      className="resize-none min-h-[calc(100vh-120px)] h-full font-mono text-sm p-2 w-full focus-visible:ring-1"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <NoteFormDialog
            form={form}
            open={openDialog}
            onOpenChange={setOpenDialog}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  )
}