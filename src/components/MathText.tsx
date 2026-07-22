import katex from 'katex'
import type { ReactNode } from 'react'

export function MathText({ children }: { children: string }) {
  const parts = children.split(/(\$[^$]+\$)/g)
  return <>{parts.map((part, index): ReactNode => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const html = katex.renderToString(part.slice(1, -1), { throwOnError: false, output: 'html' })
      return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />
    }
    return part
  })}</>
}
