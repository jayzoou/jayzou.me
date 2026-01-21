import React, { useEffect, useState, useCallback } from 'react'

// Module loaded

interface Props {
  className?: string
  children: React.ReactNode
}

const ShikiCode: React.FC<Props> = ({ className = '', children }) => {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // immediate mount log
  useEffect(() => {
    // component mounted
  }, [className])

  // Robust language extraction: support language-*, lang-*, and common extensions
  const language = (
    (className.match(/language-([^\s]+)/)?.[1]) ||
    (className.match(/lang-([^\s]+)/)?.[1]) ||
    ''
  )

  // map common short aliases to shiki language ids
  const langMap: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    jsx: 'jsx',
    tsx: 'tsx',
    py: 'python',
    sh: 'bash',
  }
  const shikiLang = langMap[language] || language

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
    const THEME = 'github-dark'

    const run = async () => {
      try {
        console.debug('[ShikiCode] importing shiki...')
        const mod: any = await import('shiki')

        // Prefer ready-made createHighlighter (bundled builds expose this)
        const createHighlighter = mod.createHighlighter || mod.default?.createHighlighter
        const createBundledFactory = mod.createBundledHighlighter || mod.default?.createBundledHighlighter
        const getHighlighter = mod.getHighlighter || mod.default?.getHighlighter

        let highlighter: any | null = null

        if (createHighlighter) {
          highlighter = await createHighlighter({ theme: 'github-dark', langs: shikiLang ? [shikiLang] : [] })
        } else if (createBundledFactory) {
          const creator = createBundledFactory({})
          if (typeof creator === 'function') {
            highlighter = await creator({ theme: 'github-dark', langs: shikiLang ? [shikiLang] : [] })
          }
        } else if (getHighlighter) {
          highlighter = await getHighlighter({ theme: 'github-dark', langs: shikiLang ? [shikiLang] : [] })
        } else {
          throw new Error('No compatible shiki factory found')
        }

        // If the created object doesn't expose codeToHtml, try using module-level codeToHtml
        if (highlighter && typeof highlighter.codeToHtml !== 'function' && typeof mod.codeToHtml === 'function') {
          console.warn('[ShikiCode] created highlighter has no codeToHtml; falling back to module.codeToHtml')
          const maybe = mod.codeToHtml(code.trim(), { lang: shikiLang || 'text', theme: 'github-dark' })
          const highlighted = await Promise.resolve(maybe)
          if (!mounted) return
          setHtml(highlighted)
          return
        }

        if (!mounted || !highlighter) return
        // Ensure theme is loaded for the highlighter
        try {
          if (highlighter.loadTheme) {
            if (mod.bundledThemes && mod.bundledThemes[THEME]) {
              // loading theme from bundledThemes
              const themeMod = await mod.bundledThemes[THEME]()
              await highlighter.loadTheme(themeMod)
            } else {
                // importing theme package
              const themePkg = await import('@shikijs/themes/github-dark')
              await highlighter.loadTheme(themePkg)
            }
          }
        } catch (e) {
          console.warn('[ShikiCode] theme load failed, will try module-level fallback', e)
        }

        console.debug('[ShikiCode] running codeToHtml')
        const maybe = highlighter.codeToHtml(code.trim(), { lang: shikiLang || 'text', theme: THEME })
        const highlighted = await Promise.resolve(maybe)
        if (!mounted) return
        setHtml(highlighted)
      } catch (e: any) {
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
        {CopyButton}
        <pre className={`${className} shiki-loading`} data-shiki="loading">
          <code className={className}>{children}</code>
        </pre>
      </div>
    )
  }

  return (
    <div className="shiki-container">
      {CopyButton}
      <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export default ShikiCode
