'use client'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function CopyButton({ content }: { content: string }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast('复制成功 🎉')
  }

  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>复制</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
