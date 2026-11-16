import React, { useEffect, useState, useCallback } from 'react'
import { highlightCode } from '../lib/highlight'

interface Props {
  className?: string
  children: React.ReactNode
}

const ShikiCode: React.FC<Props> = ({ className = '', children }) => {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Robust language extraction: support language-*, lang-*, and common extensions
  const language = (
    (className.match(/language-([^\s]+)/)?.[1]) ||
    (className.match(/lang-([^\s]+)/)?.[1]) ||
    ''
  )

  const code =
    typeof children === 'string'
      ? children
      : Array.isArray(children)
      ? children.join('')
      : String(children || '')

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        const highlighted = await highlightCode(code.trim(), language)
        if (!mounted) return
        setHtml(highlighted)
      } catch (e) {
        console.error('[ShikiCode] shiki load/highlight failed:', e)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [code, language])

  const CopyButton = (
    <button
      onClick={handleCopy}
      className="shiki-copy-btn"
      title={copied ? '已复制!' : '复制代码'}
      aria-label={copied ? '已复制!' : '复制代码'}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      )}
    </button>
  )

  if (!html) {
    return (
      <div className="shiki-container">
        <div className="shiki-wrapper-outer">
          {CopyButton}
          <pre className={`${className} shiki-loading`} data-shiki="loading">
            <code className={className}>{children}</code>
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="shiki-container">
      <div className="shiki-wrapper-outer">
        {CopyButton}
        <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

export default ShikiCode
