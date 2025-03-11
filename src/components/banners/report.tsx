import { BadgeInfo, Info } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

export default function ReportBanner() {
  return (
    <Link href='https://discord.gg/ptPBMJFxCj' target='_blank'>
      <div className='flex flex-row rounded overflow-hidden border border-dashed items-center justify-start gap-x-4 w-full'>
        <div className='bg-red-600 w-[10px] h-full' />
        <Info className='w-12 h-12 inline-block fill-red-600 text-white' />
        <div className='flex flex-col items-start gap-1 py-6 lg:py-4'>
          <h5 className='text-red-600 font-bold'>Need help?</h5>
          <h5 className='hidden lg:block text-foreground text-xs'>Join our Discord — rewards inside!</h5>
        </div>
        {/* <Button size='sm' variant='report' className=' justify-self-end'>
        <BadgeInfo className='w-5 h-5 mr-2 inline-block fill-white text-red-600' />
        Report an issue
      </Button> */}
      </div>
    </Link>
  )
}