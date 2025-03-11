'use client'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
import API from '@/services/api'
import axios from 'axios'
import useAuthentication from '@/hooks/useAuth'
import { User } from '@/types'

registerPlugin(
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop
)

export default function ProfilePictureSelector({ user }: { user: User }) {
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
          formData.append('profile_picture', file, file.name)
          const CancelToken = axios.CancelToken
          const source = CancelToken.source()
          const response = await API.put(`/users/${user.id}`, formData, {
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
        {
          source: user.profile_picture,
          options: {
            type: 'local',
          },
        },
      ]}
      maxFiles={1}
      imageResizeTargetHeight={300}
      imageResizeTargetWidth={300}
      imagePreviewHeight={150}
      stylePanelLayout={'circle'}
      allowImageCrop={true}
      imageCropAspectRatio="1:1"
      labelIdle='Drag & Drop your profile picture or <span class="filepond--label-action"> Browse </span>'
      className="h-[150px] w-[150px]"
    />
  )
}
