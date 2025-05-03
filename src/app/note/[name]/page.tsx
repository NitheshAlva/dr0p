"use client"
import NoteForm from "@/components/NoteForm"
import { protectedSchema } from "@/schema/protected.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {formatDistanceToNow} from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"
import  {Card,CardContent,CardHeader,CardDescription,CardTitle} from '@/components/ui/card'
import { Clock, Copy, Eye, EyeOff, FileText, Loader2, Lock } from "lucide-react"

function Page() {
  const { name } = useParams<{ name: string }>()
  const [isNameAvailable, setIsNameAvailable] = useState(true)
  const [isNoteProtected, setIsNoteProtected] = useState(false)
  const [note, setNote]= useState<any>()
  const [loading, setLoading] = useState(true)
  const [formattedExpiry,setFormattedExpiry]=useState('')
  
  // Form setup for protected notes
  const form = useForm<z.infer<typeof protectedSchema>>({
    resolver: zodResolver(protectedSchema),
    defaultValues: {
      name,
      password: ""
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword,setShowPassword]=useState(false)

  // Fetch note info on component mount
  useEffect(() => {
    const getInfo = async () => {
      try {
        const resp = await axios.get(`/api/note/get-info?name=${name}`)
        // console.log(resp)
        setIsNameAvailable(resp.data.data.isAvailable)
        setIsNoteProtected(resp.data.data.isProtected)
        
        // If note exists and is not protected, fetch content immediately
        if (!resp.data.data.isAvailable && !resp.data.data.isProtected) {
          fetchNoteContent()
        }
      } catch (error) {
        console.log(error)
        toast.error("Unable to fetch the note info")
      } finally {
        setLoading(false)
      }
    }
    
    getInfo()
  }, [])

 // Update expiry time display
 useEffect(() => {
  if (note?.expires_at) {
    const updateExpiryTime = () => {
      const expiryDate = new Date(note.expires_at)
      const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: true })
      setFormattedExpiry(timeLeft)
    }

    updateExpiryTime()
    const interval = setInterval(updateExpiryTime, 60000) // Update every minute

    return () => clearInterval(interval) //cleanup so that there wont be multiple intervals running
  }
}, [note])

  // Function to fetch unprotected note content
  const fetchNoteContent = async () => {
    try {
      const resp = await axios.post(`/api/note/get-note`, { name })
      if (resp.data?.note) {
        setNote(resp.data.note)
      } else {
        toast.error("Note content not found")
      }
    } catch (error) {
      console.log(error)
      toast.error("Unable to retrieve the content")
    }
  }

  // Copy note content to clipboard
  const copyToClipboard = () => {
    if (note?.content) {
      navigator.clipboard
        .writeText(note.content)
        .then(() => toast.success("Content copied to clipboard"))
        .catch(() => toast.error("Failed to copy content"))
    }
  }

  // Handle password submission
  const onSubmit = async (data: z.infer<typeof protectedSchema>) => {
    setIsSubmitting(true)
    try {
      const resp = await axios.post(`/api/note/get-note`, data)
      if (!resp.data?.note) {
        toast.error(resp.data.message || "Invalid password")
        form.reset({ name, password: "" })
        return
      }
      setNote(resp.data.note)
      setIsNoteProtected(false)
    } catch (error) {
      console.log(error)
      toast.error("Unable to verify password")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
if (loading) {
  return (
    <div className="pt-16 flex flex-col h-screen w-full">
      {/* Skeleton for the top info bar */}
      <div className="bg-secondary/20 border-b px-4 py-2 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>

      {/* Skeleton for the content area */}
      <div className="flex-1 p-4 bg-muted/30">
        <div className="space-y-4 max-w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}

  // Show note form if name is available (note doesn't exist yet)
  if (isNameAvailable) {
    return <NoteForm name={name} />
  }

// Show password form if note is protected
if (isNoteProtected) {
  return (
    <div className="flex flex-col h-screen w-full pt-15">
      {/* Small info bar at the top */}
      <div className="bg-secondary/20 border-b flex items-center px-4 py-2 h-10">
        <h2 className="font-medium">{name}</h2>
        <Badge variant="outline" className="ml-4">Protected</Badge>
      </div>

      {/* Centered password form */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Protected Note</CardTitle>
            <CardDescription>This note is password-protected. Enter the password to view it.</CardDescription>
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
                          <Input type={showPassword?'text':"password"} placeholder="Enter password" className="pl-10 pr-10" {...field} />
                          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-3 top-2.5 text-muted-foreground focus:outline-none">
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
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      View Note
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

  // Show note content if note exists and is not protected (or password was verified)
  return(
    <div className="flex flex-col h-screen w-full pt-16">
      {/* Small info bar at the top */}
      <div className="bg-secondary/20 border-b flex items-center justify-between px-4  h-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
              <h2 className="font-medium ">{name || "Create New Note"}</h2>
          </div>
          <Badge variant="outline" className="h-6">
            {note?.password_hash ? "Protected" : "Public"}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            Expires {Date.now()>new Date(note?.expires_at).getMilliseconds()?' after view':formattedExpiry}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
          <Copy className="mr-2 h-3 w-3" />
          Copy
        </Button>
      </div>
    
      {/* Full screen content area */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <pre className="font-mono text-sm p-4 h-full whitespace-pre-wrap break-words">
          {note?.content || "Loading content..."}
        </pre>
      </div>
    </div>
  )
}

export default Page