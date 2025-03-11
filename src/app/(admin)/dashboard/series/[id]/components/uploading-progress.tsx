'use client'

import { Progress } from "@/components/ui/progress"
import { useAtom } from "jotai"
import { tabAtom, uploadProgressAtom } from "./ChapterManagement"
import { useEffect } from "react"
import { toast } from "sonner"

export default function UploadingProgress() {

  const [progress] = useAtom(uploadProgressAtom)
  const [tab, setTab] = useAtom(tabAtom)

  useEffect(() => {
    if (progress === 1) {
      toast.success('File successfully uploaded!')
      setTab('upload')
    }

  }, [progress])

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        <Progress value={Math.round(progress * 100)} max={100} />
        <span className="text-muted-foreground">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </>
  )
}