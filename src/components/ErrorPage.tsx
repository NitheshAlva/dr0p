import { Button } from '@/components/ui/button'
import { ArrowLeft, XCircle } from 'lucide-react'

interface ErrorPageProps {
  message: string
}

export function ErrorPage({ message }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-15">
      <div className="max-w-md w-full bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="bg-destructive p-6 flex items-center justify-center">
          <XCircle className="h-16 w-16 text-white" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}