'use client'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { useLocalStorage } from 'usehooks-ts'

const TEXT_SIZES = ['extra-small', 'small', 'medium', 'large', 'extra-large']
const TEXT_COLORS = ['primary', 'red', 'orange', 'blue', 'green']
const TEXT_ALIGNMENTS = ['left', 'right', 'center', 'justify']

export default function NovelsPopover() {
  const [align, setAlign] = useLocalStorage('align', 'left')
  const [color, setColor] = useLocalStorage('color', 'primary')
  const [size, setSize] = useLocalStorage('size', 'medium')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-[22px] text-foreground cursor-pointer">
          <MixerHorizontalIcon />{' '}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium text-xs leading-none">
              Reader settings
            </h4>
            <p className="text-xs text-muted-foreground">
              Style the text the way you want.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="align" className="text-xs">
                Text alignment
              </Label>
              <Select value={align} onValueChange={(value) => setAlign(value)}>
                <SelectTrigger className="col-span-2 w-full text-xs">
                  <SelectValue placeholder="Select text alignment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Styles</SelectLabel>
                    {TEXT_ALIGNMENTS.map((align) => (
                      <SelectItem key={align} value={align}>
                        {align}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="color" className="text-xs">
                Text color
              </Label>
              <Select value={color} onValueChange={(value) => setColor(value)}>
                <SelectTrigger className="col-span-2 w-full text-xs">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Colors</SelectLabel>
                    {TEXT_COLORS.map((align) => (
                      <SelectItem key={align} value={align}>
                        {align}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="size" className="text-xs">
                Text size
              </Label>
              <Select value={size} onValueChange={(value) => setSize(value)}>
                <SelectTrigger className="col-span-2 w-full text-xs">
                  <SelectValue placeholder="Select text size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sizes</SelectLabel>
                    {TEXT_SIZES.map((align) => (
                      <SelectItem key={align} value={align}>
                        {align}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
