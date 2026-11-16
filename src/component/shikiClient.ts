import { highlightCode } from '../lib/highlight'

export async function highlightAllCodeBlocks(root: ParentNode = document) {
  try {
    const nodes = root.querySelectorAll<HTMLElement>('pre > code')

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
        const html = await highlightCode(codeText.trim(), lang)

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
                btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                setTimeout(() => {
                  btn.title = '复制代码'
                  btn.setAttribute('aria-label', '复制代码')
                  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
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
