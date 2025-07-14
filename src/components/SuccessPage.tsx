import { Button } from '@/components/ui/button'
import { CheckCircle, Copy, ExternalLink, Plus } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'

interface SuccessPageProps {
  name: string;
  isNote: boolean;
}

export function SuccessPage({ name,isNote }: SuccessPageProps) {
  const fullUrl = `https://dr0p.live/${isNote?'n':'f'}/${name}`
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl)
    toast.success('URL copied to clipboard!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-15">
      <div className="max-w-md w-full bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary p-6 flex items-center justify-center">
          <CheckCircle className="h-16 w-16 text-primary-foreground" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">{isNote?'Note':'File'} Created Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Your {isNote?'note':'file'} is available at the URL below. Scan the QR code or share the link.
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
            <Button variant="outline" onClick={() => window.location.href = '/n'}>
              <Plus className="h-4 w-4 mr-2" />
              Create Another
            </Button>
            <Button onClick={() => window.location.href = fullUrl}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View {isNote?'Note':'File'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}