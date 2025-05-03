import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { QRCodeSVG } from "qrcode.react"
import { ArrowLeft, CheckCircle, Copy, ExternalLink, File, Lock, Plus, Upload, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from '@/components/ui/checkbox'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from 'zod'
import { fileSchema } from '@/schema/file.schema'

export default function FileForm({name}:{name:string}) {
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    
    useEffect(() => {
        validateName()
    }, [name])

    const form = useForm<z.infer<typeof fileSchema>>({
        resolver: zodResolver(fileSchema),
        defaultValues: {
            name,
            file: undefined,
            isProtected: false,
            password: "",
            expiry: 0
        }
    })

    const isProtected = form.watch("isProtected");

    const validateName = async () => {
        const isValid = await form.trigger('name')
        if (!isValid) {
            const fieldError = form.getFieldState('name').error;
            setErrorMessage(fieldError?.message || '');
        }
    }

    const handleDialogOpen = async () => {
        const valid = await form.trigger('file')
        if (valid) {
            setOpenDialog(true)
        }
    }

    const onSubmit = async (data: z.infer<typeof fileSchema>) => {
        if (isSubmitting) return;
        setIsSubmitting(true)
        try {
            const fileName = data.file[0].name,
                  contentType = data.file[0].type,
                  contentLength = data.file[0].size
                  
            const urlResp = await axios.get(`/api/file/get-upload-url?fileName=${data.file[0].name}&contentLength=${contentLength}&contentType=${contentType}`)
            
            const s3Resp = await axios.put(urlResp.data.data.url, data.file[0], {
                headers: {
                    'Content-Type': contentType, 
                    'Content-Length': contentLength, 
                    'Host': 'dr0p.s3.ap-south-1.amazonaws.com'
                }
            })
            
            const resp = await axios.post('/api/file/set-file', {
                name: data.name,
                password: data.password,
                isProtected: data.isProtected,
                expiry: data.expiry,
                fileName,
                contentType,
                key: urlResp.data.data.key
            })
            
            toast.success("File has been uploaded")
            setShowQR(true)
            form.reset()
        } catch (error) {
            console.error(error)
            toast.error("File has not been uploaded")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Error Page
    if (errorMessage) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 pt-15">
                <div className="w-full max-w-md bg-background rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-destructive p-6 flex items-center justify-center">
                        <XCircle className="h-12 w-12 md:h-16 md:w-16 text-white" />
                    </div>
                    <div className="p-4 md:p-6 text-center">
                        <h2 className="text-xl md:text-2xl font-bold mb-2">Something went wrong</h2>
                        <p className="text-muted-foreground mb-4 md:mb-6">{errorMessage}</p>
                        <Button onClick={() => window.location.href = "/"} variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
  
    // QR Code Success Page
    if (showQR) {
        const fileUrl = `dr0p.live/file/${name}`;
        const fullUrl = `https://${fileUrl}`;
        
        const copyToClipboard = () => {
            navigator.clipboard.writeText(fullUrl);
            toast.success("URL copied to clipboard!");
        };
        
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 pt-15">
                <div className="w-full max-w-md bg-background rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-primary p-4 md:p-6 flex items-center justify-center">
                        <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-primary-foreground" />
                    </div>
                    <div className="p-4 md:p-6 text-center">
                        <h2 className="text-xl md:text-2xl font-bold mb-2">File Created Successfully!</h2>
                        <p className="text-muted-foreground mb-4 md:mb-6">
                            Your file is available at the URL below. Scan the QR code or share the link.
                        </p>
                        
                        <div className="mb-4 md:mb-6 flex justify-center">
                            <div className="p-3 md:p-4 bg-white rounded-lg shadow-sm">
                                <QRCodeSVG value={fullUrl} size={160} />
                            </div>
                        </div>
                        
                        <div className="flex items-center mb-4 md:mb-6 bg-muted rounded-md overflow-hidden">
                            <div className="truncate px-2 py-2 flex-1 font-mono text-xs md:text-sm">
                                {fullUrl}
                            </div>
                            <Button variant="ghost" onClick={copyToClipboard} className="rounded-l-none h-full">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full sm:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Another
                            </Button>
                            <Button onClick={() => window.location.href = fullUrl} className="w-full sm:w-auto mt-2 sm:mt-0">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View File
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-full pt-14">
            <div className="flex px-3 md:px-5 pt-3 justify-between items-center">
                <div className="text-red-500 text-xs md:text-sm">
                    {form.formState.errors?.file?.message as string || ""}
                </div>
                <Button type="button" onClick={handleDialogOpen} className="text-xs md:text-sm whitespace-nowrap">
                    <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Upload File
                </Button>
            </div>
            
            {/* Form */}
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
                                                    Select File
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

                    {/* File options dialog */}
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>File Options</DialogTitle>
                                <DialogDescription className="text-xs md:text-sm">
                                    Select how long you want your file to exist and if you want to protect it with a password
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-2 md:py-4">
                                <FormField
                                    control={form.control}
                                    name="expiry"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm md:text-base">Expiry</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger className="text-xs md:text-sm">
                                                        <SelectValue placeholder="Select expiration time" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="0">Burn after view</SelectItem>
                                                    <SelectItem value="600000">10 Minutes</SelectItem>
                                                    <SelectItem value="3600000">1 Hour</SelectItem>
                                                    <SelectItem value="21600000">6 Hours</SelectItem>
                                                    <SelectItem value="43200000">12 Hours</SelectItem>
                                                    <SelectItem value="86400000">24 Hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription className="text-xs">
                                                Your file will not be accessible after the expiry
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isProtected"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 md:p-4 shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm md:text-base">
                                                    Protect file with password
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                {isProtected && (
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm md:text-base">Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-2.5 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                                                        <Input placeholder="Enter password" className="pl-8 md:pl-10 text-xs md:text-sm" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Required for protected file
                                                </FormDescription>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <DialogFooter className="mt-2 sm:mt-0">
                                <Button 
                                    onClick={form.handleSubmit(onSubmit)} 
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto"
                                >
                                    {isSubmitting ? "Uploading..." : "Upload File"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </div>
    )
}