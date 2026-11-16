const languageAliases: Record<string, string> = {
  ts: 'typescript',
  js: 'javascript',
  py: 'python',
  sh: 'bash',
}

// Use the installed Shiki v3 API and its shared, lazily loaded highlighter.
export async function highlightCode(code: string, language: string) {
  const { codeToHtml, bundledLanguages } = await import('shiki')
  const mapped = languageAliases[language] || language || 'text'
  const lang = Object.prototype.hasOwnProperty.call(bundledLanguages, mapped)
    || mapped === 'ansi' ? mapped : 'text'
  return codeToHtml(code, { lang, theme: 'github-dark' })
}
