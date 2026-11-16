import { Children, isValidElement, useEffect, useRef, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'

function codeText(children: ReactNode): string {
  return Children.toArray(children).map(child => {
    if (typeof child === 'string' || typeof child === 'number') return String(child)
    if (isValidElement<{ children?: ReactNode }>(child)) return codeText(child.props.children)
    return ''
  }).join('')
}

const CodeBlock = ({ children, ...props }: ComponentProps<'pre'>) => {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(timer.current) }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codeText(children).replace(/\n$/, ''))
      if (!mounted.current) return
      setCopied(true)
      setFailed(false)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      if (mounted.current) setFailed(true)
    }
  }

  const label = failed ? '复制失败，请选择代码复制' : copied ? '已复制!' : '复制代码'
  return <div className="code-block">
    <button type="button" className="code-copy" onClick={copy} aria-label={label} title={label}>
      {copied ? '✓' : '复制'}
    </button>
    <pre {...props}>{children}</pre>
    <span className="sr-only" role="status">{copied ? '代码已复制' : failed ? label : ''}</span>
  </div>
}

export default CodeBlock
