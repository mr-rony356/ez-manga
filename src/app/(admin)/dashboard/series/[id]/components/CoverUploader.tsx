'use client'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import { SingleSeriesContext } from './Context'
import { useContext } from 'react'
import API from '@/services/api'
import { toast } from 'sonner'
import axios from 'axios'

registerPlugin(
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop
)

export default function CoverUploader() {
  const { series } = useContext(SingleSeriesContext)

  return (
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
          formData.append('thumbnail', file, file.name)
          const CancelToken = axios.CancelToken
          const source = CancelToken.source()

          formData.append('id', series.id)

          const response = await API.put(`/series/update`, formData, {
            cancelToken: source.token,
            onUploadProgress: async (progressEvent) => {
              progressEvent.total &&
                progress(true, progressEvent.loaded, progressEvent.total)
            },
          })

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
                  progress(true, progressEvent.loaded, progressEvent.total)
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
        series.thumbnail && {
          source: series.thumbnail,
          options: {
            type: 'local',
          },
        },
      ]}
      allowMultiple={false}
      stylePanelLayout={'integrated'}
      imageTransformOutputMimeType={'image/webp'}
      imageTransformOutputQuality={85}
      instantUpload={true}
      imagePreviewMaxHeight={640}
      labelIdle='Drag & Drop your profile picture or <span class="filepond--label-action"> Browse </span>'
      className={'w-full h-full rounded overflow-hidden'}
    />
  )
}
