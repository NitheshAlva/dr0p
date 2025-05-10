import * as z from 'zod' 
import { noteSchema } from '@/schema/note.schema'
import React, { useEffect, useState } from 'react'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import axios from 'axios'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
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
import { QRCodeSVG } from "qrcode.react"
import { ArrowLeft, CheckCircle, Copy, ExternalLink, Lock, Plus, XCircle } from 'lucide-react'

export default function NoteForm({name}:{name:string}) {

    const [errorMessage,setErrorMessage]=useState('')
    const [isSubmitting,setIsSubmitting]= useState(false)
    const [showQR,setShowQR] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    
    const form = useForm<z.infer<typeof noteSchema>>({
        resolver:zodResolver(noteSchema),
        defaultValues:{
            name,
            content:"",
            isProtected:false,
            password:"",
            expiry:0
        }
    })
    
    useEffect(()=>{
        const validateName = async () => {
            const isValid = await form.trigger("name");
            if (!isValid) {
              const fieldError = form.getFieldState("name").error;
              setErrorMessage(fieldError?.message || "");
            }
          };
        validateName()
    },[form])

    
    const isProtected = form.watch("isProtected");

    const handleDialogOpen = async () => {
        const valid = await form.trigger('content')
        if (valid) {
            setOpenDialog(true)
        }
    }

    const onSubmit = async(data:z.infer<typeof noteSchema>)=>{
        if(isSubmitting)return;
        setIsSubmitting(true)
        try {
            await axios.post("/api/note/set-note",data)
            toast.success("Note has been created")
            setShowQR(true)
            form.reset()
        } catch (error) {
            console.log(error)
            toast.error("Note has not been created")
        }
        finally{
            setIsSubmitting(false)
        }
    }

    // Enhanced Error Page
    if (errorMessage.length) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 pt-15">
            <div className="max-w-md w-full bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="bg-destructive p-6 flex items-center justify-center">
                <XCircle className="h-16 w-16 text-white" />
              </div>
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">{errorMessage}</p>
                <Button onClick={() => window.location.href = "/"} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        );
    }
      
    // Enhanced QR Code Page
    if (showQR) {
        const fullUrl = `https://dr0p.live/n/${name}`;
        
        const copyToClipboard = () => {
          navigator.clipboard.writeText(fullUrl);
          toast.success("URL copied to clipboard!");
        };
        
        return (
          <div className="min-h-screen flex items-center justify-center p-4 pt-15">
            <div className="max-w-md w-full bg-background rounded-lg shadow-lg overflow-hidden">
              <div className="bg-primary p-6 flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-primary-foreground" />
              </div>
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Note Created Successfully!</h2>
                <p className="text-muted-foreground mb-6">
                  Your note is available at the URL below. Scan the QR code or share the link.
                </p>
                
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <QRCodeSVG value={fullUrl} size={180} />
                  </div>
                </div>
                
                <div className="flex items-center mb-6 bg-muted rounded-md overflow-hidden">
                  <div className="truncate px-3 py-2 flex-1 font-mono text-sm">
                    {fullUrl}
                  </div>
                  <Button variant="ghost" onClick={copyToClipboard} className="rounded-l-none h-full">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={() => window.location.href = "/n"}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Another
                  </Button>
                  <Button onClick={() => window.location.href = fullUrl}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }

    return (
        <div className="flex-col min-h-screen w-full pt-14">
            <div className="flex px-5 pt-3 justify-between items-center">
                <div className="text-red-500 text-sm">
                    {form.formState.errors?.content?.message||""}
                </div>
                <Button type="button" onClick={handleDialogOpen}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                </Button>
            </div>

            {/* Full screen content area with the form */}
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
                                    {/* <FormMessage className="mt-2" /> */}
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Note options dialog */}
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Note Options</DialogTitle>
                                <DialogDescription>
                                    Select how long you want your note to exist and if you want to protect it with a password
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="expiry"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expiry</FormLabel>
                                            <Select onValueChange={(val) => field.onChange(Number(val))} value={field.value.toString()}>
                                                <FormControl>
                                                    <SelectTrigger>
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
                                            <FormDescription>
                                                Your note will not be accessible after the expiry
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isProtected"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Protect note with password
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
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="Enter password" className="pl-10" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    Required for protected notes
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                            <DialogFooter>
                                <Button 
                                    onClick={form.handleSubmit(onSubmit)}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating..." : "Create Note"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </div>
    )
}