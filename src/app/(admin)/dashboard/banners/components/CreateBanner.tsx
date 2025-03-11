'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import API from '@/services/api'
import { useRouter } from 'next/navigation'
import { use, useState } from 'react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  SelectScrollDownButton,
  SelectScrollUpButton,
} from '@radix-ui/react-select'

export default function CreateBanner({
  series,
}: {
  series: {
    title: string
    id: number
  }[]
}) {
  const [index, setIndex] = useState<number>(0)
  const [background, setBackground] = useState<string>('#000000')
  const [id, setId] = useState<string>('')

  const router = useRouter()

  async function create_banner() {
    toast.promise(
      API.post('/banner/create', { series_id: id, index, background }),
      {
        loading: 'Loading...',
        success: () => {
          setTimeout(() => router.refresh(), 1000)
          return 'Banner created successfully! Refreshing...'
        },
      }
    )
  }

  return (
    <div className="bg-background p-4 rounded shadow-md">
      <div className="flex flex-col gap-2">
        <Select onValueChange={(e) => setId(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a series" />
          </SelectTrigger>
          <SelectContent>
            <SelectScrollUpButton />
            <SelectGroup>
              <SelectLabel>Series</SelectLabel>
              {series &&
                series.length > 0 &&
                series.map((series) => (
                  <SelectItem
                    key={series.id}
                    className="line-clamp-1"
                    value={series.id.toString()}
                  >
                    {series.title}
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectScrollDownButton />
          </SelectContent>
        </Select>
        <div className="flex flex-row gap-4 items-center">
          <Label className="shrink-0 text-muted-foreground">Banner index</Label>
          <Input
            placeholder={'Banner index'}
            value={index.toString()}
            onChange={(e) => setIndex(parseFloat(e.currentTarget.value))}
          />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Label className="shrink-0 text-muted-foreground">
            Background color (blur)
          </Label>
          <Input
            placeholder={'Banner background'}
            value={background}
            type="color"
            onChange={(e) => setBackground(e.currentTarget.value)}
          />
        </div>
        <Button onClick={create_banner} className="btn btn-primary">
          Create banner
        </Button>
      </div>
    </div>
  )
}
