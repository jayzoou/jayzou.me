import React, { useEffect, useState } from 'react'

// Module loaded

interface Props {
  className?: string
  children: React.ReactNode
}

const ShikiCode: React.FC<Props> = ({ className = '', children }) => {
  const [html, setHtml] = useState<string | null>(null)

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

  if (!html) {
    return (
      <pre className={`${className} shiki-loading`} data-shiki="loading">
        <code className={className}>{children}</code>
      </pre>
    )
  }

  return <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: html }} />
}

export default ShikiCode
