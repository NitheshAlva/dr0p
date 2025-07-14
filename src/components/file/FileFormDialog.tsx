'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

interface FileOptionsDialogProps {
  form: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  isSubmitting: boolean
}

export function FileOptionsDialog({ form, open, onOpenChange, onSubmit, isSubmitting }: FileOptionsDialogProps) {
  const isProtected = form.watch("isProtected")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  <FormLabel>
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
  )
}