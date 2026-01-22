import type { ParentNode } from 'domhandler'

export async function highlightAllCodeBlocks(root: ParentNode = document) {
  try {
    const mod: any = await import('shiki')

    const THEME = 'github-dark'

    // Prefer ready-made createHighlighter (bundled build exposes this)
    const createHighlighter = mod.createHighlighter || mod.default?.createHighlighter
    const createBundledFactory = mod.createBundledHighlighter || mod.default?.createBundledHighlighter
    const getHighlighter = mod.getHighlighter || mod.default?.getHighlighter

    // Collect code block languages before creating highlighter so we can
    // request them during creation (bundles may preload grammars).
    const nodes = Array.from((root as ParentNode).querySelectorAll('pre > code')) as HTMLElement[]

    // language alias mapping
    const langMap: Record<string, string> = {
      ts: 'typescript',
      js: 'javascript',
      jsx: 'jsx',
      tsx: 'tsx',
      py: 'python',
      sh: 'bash',
    }

    const langsNeeded = new Set<string>()
    for (const codeEl of nodes) {
      const cls = codeEl.className || ''
      const langMatch = cls.match(/language-([^\s]+)/) || cls.match(/lang-([^\s]+)/)
      const raw = (langMatch && langMatch[1]) || 'text'
      const mapped = langMap[raw] || raw
      if (mapped && mapped !== 'text') langsNeeded.add(mapped)
    }

    let highlighter: any | null = null

    if (createHighlighter) {
      highlighter = await createHighlighter({ theme: THEME, langs: Array.from(langsNeeded) })
    } else if (createBundledFactory) {
      // createBundledHighlighter returns a factory; call it to get a creator, then create the highlighter
      const creator = createBundledFactory({})
      if (typeof creator === 'function') {
        highlighter = await creator({ theme: THEME, langs: Array.from(langsNeeded) })
      }
    } else if (getHighlighter) {
      highlighter = await getHighlighter({ theme: THEME, langs: Array.from(langsNeeded) })
    } else {
      throw new Error('No compatible shiki factory found (createBundledHighlighter/createHighlighter/getHighlighter)')
    }

    if (!highlighter) throw new Error('Failed to create shiki highlighter')

    // Ensure theme is loaded for the highlighter
    try {
      if (highlighter.loadTheme) {
        if (mod.bundledThemes && mod.bundledThemes[THEME]) {
          const themeMod = await mod.bundledThemes[THEME]()
          await highlighter.loadTheme(themeMod)
        } else {
          const themePkg = await import('@shikijs/themes/github-dark')
          await highlighter.loadTheme(themePkg)
        }
      }
    } catch (e) {
      console.warn('[shikiClient] theme load failed, continuing and relying on module-level fallback', e)
    }

    // Ensure requested languages are loaded (best-effort)
    try {
      if (highlighter && typeof highlighter.loadLanguage === 'function') {
        for (const lang of langsNeeded) {
          try {
            if (mod.bundledLanguages && mod.bundledLanguages[lang]) {
              const langMod = await mod.bundledLanguages[lang]()
              await highlighter.loadLanguage(langMod)
            } else {
              // try importing package (ignore Vite static analysis for dynamic var)
              const pkg = await import(/* @vite-ignore */ `@shikijs/langs/${lang}`)
              await highlighter.loadLanguage(pkg)
            }
          } catch (e) {
            console.warn('[shikiClient] failed to load language', lang, e)
          }
        }
      }
    } catch (e) {
      console.warn('[shikiClient] language pre-load failed', e)
    }

    // Mark nodes as loading to apply minimal styling and avoid FOUC
    for (const codeEl of nodes) {
      const pre = codeEl.parentElement as HTMLElement | null
      if (pre) {
        pre.classList.add('shiki-loading')
        // reserve vertical space to reduce layout shift
        if (!pre.style.minHeight) pre.style.minHeight = pre.offsetHeight ? `${pre.offsetHeight}px` : '3rem'
      }
    }

    for (const codeEl of nodes) {
      const pre = codeEl.parentElement as HTMLElement | null
      if (!pre) continue

      const cls = codeEl.className || ''
      const langMatch = cls.match(/language-([^\s]+)/) || cls.match(/lang-([^\s]+)/)
      const lang = (langMatch && langMatch[1]) || 'text'
      const codeText = codeEl.textContent || ''

      try {
        let html: string
        try {
          const maybe = highlighter.codeToHtml(codeText.trim(), { lang, theme: THEME })
          html = await Promise.resolve(maybe)
        } catch (innerErr) {
          console.warn('[shikiClient] highlighter.codeToHtml failed, will try module.codeToHtml fallback', innerErr)
          if (typeof mod.codeToHtml === 'function') {
            // module-level API requires theme in options
            const maybe2 = mod.codeToHtml(codeText.trim(), { lang, theme: THEME })
            html = await Promise.resolve(maybe2)
          } else {
            throw innerErr
          }
        }

        // Insert highlighted HTML into the existing <pre> to avoid
        // replacing DOM nodes that React may manage (prevents removeChild errors).
        // The highlighter returns a full <pre>...</pre> string; strip the outer
        // <pre> so we can inject inner content into the existing element.
        const inner = html.replace(/^<pre[^>]*>/i, '').replace(/<\/pre>$/i, '')
        pre.innerHTML = inner
        pre.classList.remove('shiki-loading')
        pre.classList.add('shiki-wrapper', 'shiki-done')
        pre.style.minHeight = ''

        // Insert a copy button into the pre so users can copy highlighted code
        try {
          // Avoid inserting multiple buttons
          if (!pre.querySelector('.shiki-copy-btn')) {
            const btn = document.createElement('button')
            btn.className = 'shiki-copy-btn'
            btn.type = 'button'
            btn.title = '复制代码'
            btn.setAttribute('aria-label', '复制代码')
            // initial copy icon
            btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`

            // copy handler (uses the code element's text)
            btn.addEventListener('click', async (ev) => {
              ev.preventDefault()
              const text = (codeEl.textContent || '').trim()
              try {
                await navigator.clipboard.writeText(text)
                btn.title = '已复制!'
                btn.setAttribute('aria-label', '已复制!')
                btn.innerHTML = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"></polyline></svg>`
                setTimeout(() => {
                  btn.title = '复制代码'
                  btn.setAttribute('aria-label', '复制代码')
                  btn.innerHTML = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path></svg>`
                }, 2000)
              } catch (err) {
                console.warn('[shikiClient] copy failed', err)
              }
            })

            // Ensure pre can be a positioning context
            const existingPos = window.getComputedStyle(pre).position
            if (!existingPos || existingPos === 'static') {
              pre.style.position = 'relative'
            }

            // Position the button absolute inside the pre
            btn.style.position = 'absolute'
            btn.style.top = '4px'
            btn.style.right = '4px'
            btn.style.display = 'flex'

            // insert button as first child so it floats over the top-right
            pre.insertBefore(btn, pre.firstChild)
          }
        } catch (e) {
          console.warn('[shikiClient] failed to add copy button', e)
        }
      } catch (e) {
        console.error('[shikiClient] highlight failed for', lang, e)
      }
    }
  } catch (e) {
    console.error('[shikiClient] shiki import/create failed', e)
  }
}

export default highlightAllCodeBlocks
