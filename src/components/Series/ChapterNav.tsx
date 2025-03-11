'use client'
import { createRef, useEffect, useState } from 'react'
import ChaptersSwiper from './ChaptersSwiper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faArrowUp,
  faComments,
} from '@fortawesome/free-solid-svg-icons'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import NovelsPopover from './NovelsPopover'
import { Chapter } from '@/types'

const ChapterNav = ({ chapter_type }: { chapter_type: 'Novel' | 'Comic' }) => {
  const [open, setOpen] = useState<boolean>(false)

  const navRef = createRef<HTMLElement>()

  function handleClick() {
    setOpen(true)
  }

  const goToBottom = (event: any) => {
    event.preventDefault()
    let bottom = document.getElementById('disqus_thread')
    if (bottom) {
      bottom.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    let scrollPos = 0
    const nav = navRef.current
    function checkPosition() {
      let windowY = window.scrollY
      if (windowY < scrollPos) {
        nav && nav.classList.remove('translate-y-[400px]')
      } else {
        nav && nav.classList.add('translate-y-[400px]')
      }
      scrollPos = windowY
    }
    window.addEventListener('scroll', checkPosition)
    return () => window.removeEventListener('scroll', checkPosition)
  }, [])

  return (
    <>
      <ChaptersSwiper />
      <div className="flex justify-center items-center w-full h-full">
        <nav
          ref={navRef}
          className="fixed text-foreground shadow-md w-[321px] border-none bg-background  transition-all ease-in-out duration-2000 backdrop-blur-[10px] rounded-[15px] bottom-[20px] h-[52px]"
        >
          <div className="w-full h-full">
            <ul className="flex justify-center items-center m-0 p-0 w-full h-full flex-row">
              <li className="h-full flex text-center relative justify-center items-center border-l-[1px] border-l-gray-400 border-r-gray-400 hover:bg-gray-700 transition-all">
                <button
                  className="p-[22px] text-foreground cursor-pointer"
                  onClick={() => handleClick()}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </li>
              <li className="hover:bg-gray-700 transition-all h-full flex text-center relative justify-center items-center border-l-[1px] border-l-gray-400 border-r-gray-400">
                <button
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                  className="p-[22px] text-foreground cursor-pointer"
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
              </li>
              <li className="hover:bg-gray-700 transition-all h-full flex text-center relative justify-center items-center border-l-[1px] border-r-[1px] border-l-gray-400 border-r-gray-400">
                <button
                  onClick={goToBottom}
                  className="p-[22px] text-foreground cursor-pointer"
                >
                  <FontAwesomeIcon icon={faComments} />
                </button>
              </li>

              <li className="hover:bg-gray-700 transition-all h-full flex text-center relative justify-center items-center border-l-[1px] border-r-[1px] border-l-gray-400 border-r-gray-400">
                <NovelsPopover />
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  )
}

export default ChapterNav
