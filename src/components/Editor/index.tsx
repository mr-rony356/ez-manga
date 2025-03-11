'use client'
import React, { useEffect, useState } from 'react'
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorContent,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
} from 'novel'
import { ImageResizer, handleCommandNavigation } from 'novel/extensions'
import { defaultExtensions } from './extensions'
import { NodeSelector } from './selectors/node-selector'
import { LinkSelector } from './selectors/link-selector'
import { ColorSelector } from './selectors/color-selector'
import { generateJSON } from '@tiptap/html'
import { TextButtons } from './selectors/text-buttons'
import { slashCommand, suggestionItems } from './slash-command'
import { handleImageDrop, handleImagePaste } from 'novel/plugins'
import { uploadFn } from './image-upload'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
const extensions = [...defaultExtensions, slashCommand]

interface EditorProp {
  initialValue?: JSONContent | string
  onChange: (value: string) => void
}
const Editor = ({ initialValue, onChange }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)

  return (
    <EditorRoot>
      <ScrollArea className="h-72 py-4 shadow-md p-2 rounded bg-foreground/20">
        <EditorContent
          className=""
          {...(initialValue && {
            initialContent:
              typeof initialValue === 'string'
                ? generateJSON(initialValue, extensions)
                : initialValue,
          })}
          {...(!initialValue && {
            initialContent: generateJSON('Insert text here...', extensions),
          })}
          onCreate={({ editor }) => {
            editor.view.dom.setAttribute('spellcheck', 'false')
            editor.view.dom.setAttribute('autocomplete', 'off')
            editor.view.dom.setAttribute('autocapitalize', 'off')
          }}
          extensions={extensions}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),

            transformPastedHTML: (html) => {
              return html
                .replaceAll(/(color:#+)(\w*)(;)+/g, '')
                .replaceAll(/(line-height:#+)(\w*)(;)+/g, '')
                .replaceAll(/(font-size:+)(\w*)(;)+/g, '')
                .replaceAll(/(font-family:"+)(\w*)(";)+/g, '')
                .replaceAll(/(font-family:"+)(\w*)(")+/g, '')
                .replaceAll(/(text-align:+)(\w*)(;)+/g, '')
                .replaceAll(/(text-align:+)(\w*)()+/g, '')
                .replaceAll(/(line-height:+)(\w*\.\w*)(;)+/g, '')
            },
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default text-muted-foreground focus:outline-none max-w-full`,
            },
          }}
          onUpdate={({ editor }) => {
            onChange(editor.getHTML())
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorBubble
            tippyOptions={{
              placement: 'top',
            }}
            className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl text-foreground"
          >
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </EditorBubble>
        </EditorContent>
      </ScrollArea>
    </EditorRoot>
  )
}

export default Editor
