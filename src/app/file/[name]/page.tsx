"use client"
import FileForm from "@/components/FileForm"
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
import { Archive, Clock, Download, Eye, EyeOff, File, FileText, Loader2, Lock, Table } from "lucide-react"
import Image from "next/image"

function Page() {
  const { name } = useParams<{ name: string }>()
  const [isNameAvailable, setIsNameAvailable] = useState(true)
  const [isFileProtected, setIsFileProtected] = useState(false)
  const [file, setFile]= useState<any>()
  const [loading, setLoading] = useState(true)
  const [formattedExpiry,setFormattedExpiry]=useState('')
  
  // Form setup for protected file
  const form = useForm<z.infer<typeof protectedSchema>>({
    resolver: zodResolver(protectedSchema),
    defaultValues: {
      name,
      password: ""
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword,setShowPassword]=useState(false)

  // Fetch file info on component mount
  useEffect(() => {
    const getInfo = async () => {
      try {
        const resp = await axios.get(`/api/file/get-info?name=${name}`)
        // console.log(resp)
        setIsNameAvailable(resp.data.data.isAvailable)
        setIsFileProtected(resp.data.data.isProtected)
        
        // If file exists and is not protected, fetch content immediately
        if (!resp.data.data.isAvailable && !resp.data.data.isProtected) {
          fetchFileContent()
        }
      } catch (error) {
        console.log(error)
        toast.error("Unable to fetch the file info")
      } finally {
        setLoading(false)
      }
    }
    
    getInfo()
  },[name])

 // Update expiry time display
 useEffect(() => {
  if (file?.expires_at) {
    const updateExpiryTime = () => {
      const expiryDate = new Date(file.expires_at)
      const timeLeft = formatDistanceToNow(expiryDate, { addSuffix: true })
      setFormattedExpiry(timeLeft)
    }

    updateExpiryTime()
    const interval = setInterval(updateExpiryTime, 60000) // Update every minute

    return () => clearInterval(interval) //cleanup so that there wont be multiple intervals running
  }
}, [file?.expires_at])

  // Function to fetch unprotected file content
  const fetchFileContent = async () => {
    try {
      const resp = await axios.post(`/api/file/get-file`, { name })
      if (resp.data?.file) {
        resp.data.file.url=resp.data.url
        setFile(resp.data.file)
      } else {
        toast.error("File content not found")
      }
    } catch (error) {
      console.log(error)
      toast.error("Unable to retrieve the file")
    }
  }

  

  // Handle password submission
  const onSubmit = async (data: z.infer<typeof protectedSchema>) => {
    setIsSubmitting(true)
    try {
      const resp = await axios.post(`/api/file/get-file`, data)
      if (!resp.data?.file) {
        toast.error(resp.data.message || "Invalid password")
        form.reset({ name, password: "" })
        return
      }
      resp.data.file.url=resp.data.url
      setFile(resp.data.file)
      setIsFileProtected(false)
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
    <div className="flex flex-col h-screen w-full pt-15">
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
    return <FileForm name={name} />
  }

// Show password form if note is protected
if (isFileProtected) {
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
            <CardTitle>Protected File</CardTitle>
            <CardDescription>This file is password-protected. Enter the password to view it.</CardDescription>
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

    // Update your getFileTypeColor function to return valid variant types
    function getFileTypeColor(fileType?: string): "default" | "secondary" | "destructive" | "outline" {
        if (!fileType) return "default";
        
        if (fileType.includes('image')) return "default";
        if (fileType.includes('pdf')) return "destructive";
        if (fileType.includes('doc') || fileType.includes('word')) return "secondary";
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return "outline";
        if (fileType.includes('zip') || fileType.includes('archive')) return "secondary";
        
        return "default"; // default fallback
    }
  
    function getFileTypeLabel(fileType:string) {
        if (!fileType) return "Unknown";
        
        if (fileType.startsWith('image/')) return "Image";
        if (fileType.startsWith('video/')) return "Video";
        if (fileType.startsWith('audio/')) return "Audio";
        if (fileType.includes('pdf')) return "PDF Document";
        if (fileType.includes('word') || fileType.includes('doc')) return "Word Document";
        if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xlsx')) return "Spreadsheet";
        if (fileType.includes('zip') || fileType.includes('archive')) return "Archive";
        
        return "Document";
    }

    // Show file information and download link
    return (
        <div className="flex flex-col h-screen w-full pt-15">
        {/* Small info bar at the top */}
        <div className="bg-secondary/20 border-b flex items-center justify-between px-4 py-2 h-12">
            
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                <h2 className="font-medium">{file?.name || "File"}</h2>
            </div>
            <Badge variant="outline" className="h-6">
                {file?.password_hash ? "Protected" : "Public"}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Expires {new Date(file?.expires_at) < new Date()?' after view':formattedExpiry}
            </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => window.open(file?.url)} className="h-8">
              <Download className="mr-2 h-3 w-3" />
              Download
            </Button>
        </div>
    
        {/* File preview and information area */}
        <div className="flex-1 overflow-auto bg-muted/30 p-4 flex flex-col items-center justify-center ">
            <div className="bg-background rounded-lg overflow-y-auto shadow-lg max-w-2xl w-full overflow-hidden">
            {/* File preview section */}
            <div className="border-b p-6 flex justify-center">
                {file?.file_type.startsWith('image/') ? (
                <div className="relative w-full max-h-96 flex items-center justify-center">
                    <Image
                    src={file?.url}
                    alt={file?.original_filename || "File preview"}
                    className="object-contain max-h-96"
                    width={400}
                    height={300}
                    />
                </div>
                ) : file?.file_type.startsWith('video/') ? (
                <video 
                    controls 
                    className="max-h-96 max-w-full" 
                    src={file?.url}
                >
                    Your browser does not support video playback.
                </video>
                ) : file?.file_type.startsWith('audio/') ? (
                <audio 
                    controls 
                    className="w-full" 
                    src={file?.url}
                >
                    Your browser does not support audio playback.
                </audio>
                ) : (
                <div className="flex flex-col items-center justify-center p-10">
                    <div className="bg-muted/50 p-8 rounded-full mb-4">
                    {file?.file_type.includes('pdf') ? (
                        <FileText className="h-16 w-16 text-primary" />
                    ) : file?.file_type.includes('word') || file?.file_type.includes('doc') ? (
                        <File className="h-16 w-16 text-blue-500" />
                    ) : file?.file_type.includes('spreadsheet') || file?.file_type.includes('excel') || file?.file_type.includes('xlsx') ? (
                        <Table className="h-16 w-16 text-green-500" />
                    ) : file?.file_type.includes('zip') || file?.file_type.includes('archive') ? (
                        <Archive className="h-16 w-16 text-yellow-500" />
                    ) : (
                        <File className="h-16 w-16 text-muted-foreground" />
                    )}
                    </div>
                    <p className="text-lg font-medium">{file?.original_filename}</p>
                    <p className="text-sm text-muted-foreground">
                    {file?.file_type}
                    </p>
                </div>
                )}
            </div>
    
            {/* File details section */}
            <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                <h3 className="font-semibold">File Information</h3>
                <Badge variant={getFileTypeColor(file?.file_type)||""}>
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
                <Button onClick={() => window.open(file?.url)} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download File
                </Button>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export default Page