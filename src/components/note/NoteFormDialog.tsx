import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lock } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import { noteSchema } from '@/schema/note.schema'

interface NoteFormDialogProps {
  form: UseFormReturn<z.infer<typeof noteSchema>>
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: z.infer<typeof noteSchema>) => void
  isSubmitting: boolean
}

export function NoteFormDialog({ form, open, onOpenChange, onSubmit, isSubmitting }: NoteFormDialogProps) {
  const isProtected = form.watch('isProtected')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {isSubmitting ? 'Creating...' : 'Create Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}