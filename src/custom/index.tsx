'use client'
import parse, { Element, Text } from 'html-react-parser'
import Script from 'next/script'

export default function CustomHeaders({ headers }: { headers: string }) {
  return (
    <>
      {parse(headers, {
        replace: (domNode) => {
          if (
            domNode instanceof Element &&
            domNode.attribs &&
            domNode.name === 'script'
          ) {
            return (
              <Script {...domNode.attribs}>
                {(domNode.children[0] as Text).data}
              </Script>
            )
          }
        },
      })}
    </>
  )
}
