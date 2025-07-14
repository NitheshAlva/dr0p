'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { protectedSchema } from '@/schema/protected.schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import * as z from 'zod'
import { getFileAction } from '@/actions/file-actions'
import FileViewer from './FileViewer'

interface ProtectedNoteFormProps {
  name: string
}

interface fileData {
  name: string;
	id: string;
	file_key: string;
	original_filename: string;
	password_hash: string | null;
	expires_at: Date;
	created_at: Date;
	file_type: string;
}

export default function ProtectedNoteForm({ name }: ProtectedNoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isVerified, setIsVerified] = useState(false);
  const [file, setFile] = useState<{
    name: string;
    file: fileData;
    url: string;
    expiresAt: Date;
    isProtected: boolean;
  } | null>(null);

  const form = useForm<z.infer<typeof protectedSchema>>({
    resolver: zodResolver(protectedSchema),
    defaultValues: {
      name,
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof protectedSchema>) => {
    setIsSubmitting(true)
    try { 
      const resp = await getFileAction(data.name, data.password)

      if (!resp||!resp.success||!resp.file||!resp.url) {
          toast.error(resp.message || 'Invalid password')
          form.reset({ name, password: '' })
          return
      }
      setIsVerified(true)
      setFile({name: resp.file.name, file: resp.file,url:resp.url, expiresAt: resp.file.expires_at, isProtected: true})
      
    } catch (error) {
      console.error(error)
      toast.error('Unable to verify password')
    } finally {
      setIsSubmitting(false)
    }
  }
  if (isVerified && file) {
    return (
      <FileViewer
        name={file.name}
        file={file.file}
				url={file.url}
      />
    )
  }
  return (
    <div className="flex flex-col h-screen w-full pt-15">
      {/* Info bar */}
      <div className="bg-secondary/20 border-b flex items-center px-4 py-2 h-10">
        <h2 className="font-medium">{name}</h2>
        <Badge variant="outline" className="ml-4">Protected</Badge>
      </div>

      {/* Password form */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Protected File</CardTitle>
            <CardDescription>
              This file is password-protected. Enter the password to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            className="pl-10 pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting} className="w-full hover:cursor-pointer">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      View File
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}