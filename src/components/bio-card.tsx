import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bio } from '@/app/type'
import CopyButton from './copy-button'
import { cn } from '@/lib/utils'

type CardProps = React.ComponentProps<typeof Card> & {
  bio: Bio
  canCopy?: boolean
}

export default function BioCard({
  className,
  bio,
  canCopy,
  ...props
}: CardProps) {
  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="text-primary">{bio.title}</div>
          {canCopy && <CopyButton content={bio.content} />}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-12">
        <div className="whitespace-pre-line leading-relaxed">{bio.content}</div>
      </CardContent>
    </Card>
  )
}
