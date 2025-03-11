'use client'
import { useEffect, useState } from 'react'
import { get_file_url } from '@functions'
import { env } from '@/env'
import chunk from 'lodash.chunk'

type ChapterImagesProps = {
  data: string[]
}

const ChapterImages = ({ data }: ChapterImagesProps) => {
  const data_groups = chunk(data, Math.ceil(data.length / 10))
  useEffect(() => {
    function lazy() {
      var lazyloadImages
      if ('IntersectionObserver' in window) {
        lazyloadImages = document.querySelectorAll('.lazy')
        var imageObserver = new IntersectionObserver(function (
          entries,
          observer
        ) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var image = entry.target
              //@ts-expect-error
              image.src = image.dataset.src
              image.classList.remove('lazy')
              imageObserver.unobserve(image)
            }
          })
        })

        lazyloadImages.forEach(function (image) {
          imageObserver.observe(image)
        })
      }
    }

    setTimeout(lazy, 2000)
  }, [])

  return (
    <>
      {data_groups.length > 0 &&
        data_groups.map((group, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center"
            >
              {group.map((image, i) => {
                const url = get_file_url(image)
                return (
                  <img
                    className={`${index <= 1 ? '' : 'lazy'}`}
                    key={`${index}-${i}`}
                    src={`${index <= 1 ? url : ''}`}
                    data-src={`${index > 1 ? url : ''}`}
                  />
                )
              })}
            </div>
          )
        })}
    </>
  )
}

export default ChapterImages
