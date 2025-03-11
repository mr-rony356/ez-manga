'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Series } from '@/types'
import { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import API from '@/services/api'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'

registerPlugin(
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop
)

export default function BannerItem({
  banner,
}: {
  banner: {
    id: number
    series: Series
    protagonist: string
    background: string
    banner: string
    index: number
  }
}) {
  const [index, setIndex] = useState<number>(banner.index)
  const [background, setBackground] = useState<string>(banner.background)
  const router = useRouter()
  async function onUpdate() {
    toast.promise(
      API.put(`/banner/${banner.id}`, {
        index,
        background,
      }),
      {
        loading: 'Updating banner...',
        success: 'Banner updated!',
        error: 'Failed to update banner',
      }
    )
  }

  async function onDelete() {
    toast.promise(API.delete(`/banner/${banner.id}`), {
      loading: 'Deleting banner...',
      success: () => {
        setTimeout(() => router.refresh(), 1000)
        return 'Banner deleted!'
      },
      error: 'Failed to delete banner',
    })
  }

  return (
    <div className="p-4 bg-background rounded shadow-md flex flex-col gap-4">
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-muted-foreground">
            Banner (background image)
          </Label>
          <FilePond
            server={{
              process: async (
                fieldName,
                file,
                metadata,
                load,
                error,
                progress,
                abort,
                transfer,
                options
              ) => {
                const formData = new FormData()
                formData.append('banner', file, file.name)
                const CancelToken = axios.CancelToken
                const source = CancelToken.source()

                const response = await API.put(
                  `/banner/${banner.id}`,
                  formData,
                  {
                    cancelToken: source.token,
                    onUploadProgress: async (progressEvent) => {
                      progressEvent.total &&
                        progress(
                          true,
                          progressEvent.loaded,
                          progressEvent.total
                        )
                    },
                  }
                )

                load(response.statusText)

                return {
                  abort: () => {
                    source.cancel()
                    abort()
                  },
                }
              },
              load: async (source, load, error, progress, abort, headers) => {
                try {
                  const file = await axios.get<Blob>(source, {
                    responseType: 'blob',
                    headers: {
                      Accept:
                        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    },
                    onDownloadProgress: (progressEvent) => {
                      if (progressEvent.total)
                        progress(
                          true,
                          progressEvent.loaded,
                          progressEvent.total
                        )
                    },
                  })
                  load(file.data)
                  return {
                    abort: () => {
                      abort()
                    },
                  }
                } catch (error) {
                  console.log(error)
                  abort()
                }
              },
            }}
            files={[
              banner.banner && {
                source: banner.banner,
                options: {
                  type: 'local',
                },
              },
            ]}
            allowMultiple={false}
            stylePanelLayout={'integrated'}
            imageTransformOutputMimeType={'image/webp'}
            imageTransformOutputQuality={85}
            instantUpload={false}
            labelIdle='Drag & Drop your profile picture or <span class="filepond--label-action"> Browse </span>'
          />
        </div>
        <div>
          <Label className="text-muted-foreground">Protagonist</Label>
          <FilePond
            server={{
              process: async (
                fieldName,
                file,
                metadata,
                load,
                error,
                progress,
                abort,
                transfer,
                options
              ) => {
                const formData = new FormData()
                formData.append('protagonist', file, file.name)
                const CancelToken = axios.CancelToken
                const source = CancelToken.source()

                const response = await API.put(
                  `/banner/${banner.id}`,
                  formData,
                  {
                    cancelToken: source.token,
                    onUploadProgress: async (progressEvent) => {
                      progressEvent.total &&
                        progress(
                          true,
                          progressEvent.loaded,
                          progressEvent.total
                        )
                    },
                  }
                )

                load(response.statusText)

                return {
                  abort: () => {
                    source.cancel()
                    abort()
                  },
                }
              },
              load: async (source, load, error, progress, abort, headers) => {
                try {
                  const file = await axios.get<Blob>(source, {
                    responseType: 'blob',
                    headers: {
                      Accept:
                        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    },
                    onDownloadProgress: (progressEvent) => {
                      if (progressEvent.total)
                        progress(
                          true,
                          progressEvent.loaded,
                          progressEvent.total
                        )
                    },
                  })
                  load(file.data)
                  return {
                    abort: () => {
                      abort()
                    },
                  }
                } catch (error) {
                  console.log(error)
                  abort()
                }
              },
            }}
            files={[
              banner.protagonist && {
                source: banner.protagonist,
                options: {
                  type: 'local',
                },
              },
            ]}
            allowMultiple={false}
            stylePanelLayout={'integrated'}
            imageTransformOutputMimeType={'image/webp'}
            imageTransformOutputQuality={85}
            instantUpload={false}
            labelIdle='Drag & Drop your profile picture or <span class="filepond--label-action"> Browse </span>'
          />
        </div>
      </div>
      <Button onClick={onUpdate}>Update banner</Button>
      <Button onClick={onDelete}>Delete banner</Button>
    </div>
  )
}
