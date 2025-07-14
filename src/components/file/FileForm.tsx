'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form'
import { File, Plus, Upload } from 'lucide-react'
import { useFileForm } from '@/hooks/use-file-form'
import { ErrorPage } from '../ErrorPage'
import { SuccessPage } from '../SuccessPage'
import { FileOptionsDialog } from './FileFormDialog'
import { Input } from '../ui/input'

interface NoteFormProps {
  name: string
}

export default function FileForm({ name }: NoteFormProps) {
  const {
    form,
    isSubmitting,
    errorMessage,
    showQR,
    openDialog,
    setOpenDialog,
    handleDialogOpen,
    onSubmit
  } = useFileForm(name)

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />
  }

  if (showQR) {
    return <SuccessPage name={name} isNote={false}/>
  }

  return (
    <div className="flex-col min-h-screen w-full pt-14">
      <div className="flex px-3 md:px-5 pt-3 justify-between items-center">
        <div className="text-red-500 text-xs md:text-sm">
            {form.formState.errors?.file?.message as string || ""}
        </div>
        <Button type="button" onClick={handleDialogOpen} className="text-xs md:text-sm whitespace-nowrap">
            <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            Upload File
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col flex-1">
          <div className="flex-1 bg-muted/30 p-2 md:p-3">
            <FormField
                control={form.control}
                name="file"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className="h-full">
                        <FormControl>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4 md:p-6 bg-background">
                                <div className="flex flex-col items-center justify-center text-center space-y-3 md:space-y-4">
                                    <div className="bg-muted/50 p-3 md:p-4 rounded-full">
                                        <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1 md:space-y-2">
                                        <h3 className="font-medium text-base md:text-lg">Drop your file here or click to browse</h3>
                                        <p className="text-xs md:text-sm text-muted-foreground">
                                            Support for documents, images, videos, and other file types
                                        </p>
                                        {value?.length && (
                                            <div className="bg-muted p-2 rounded flex items-center gap-2 max-w-xs md:max-w-md mx-auto">
                                                <File className="h-3 w-3 md:h-4 md:w-4" />
                                                <span className="text-xs md:text-sm truncate">{value[0].name}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files;
                                            if (file) {
                                                onChange(file);
                                            }
                                        }}
                                        {...fieldProps}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className="text-xs md:text-sm"
                                    >
                                        {value?.length ? "Change" : "Select"} File
                                    </Button>
                                </div>
                            </div>
                        </FormControl>
                        <FormDescription className="text-xs md:text-sm mt-1">
                            Upload your file. Maximum file size: 10MB.
                        </FormDescription>
                    </FormItem>
                )}
            />
          </div>


          <FileOptionsDialog
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