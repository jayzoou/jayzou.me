const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export function enrichHead(html, metadata) {
  return html.replace(/<head>([\s\S]*?)<\/head>/, (_, original) => {
    const head = original.replace(/<meta name="(?:description|robots)"[^>]*>\s*/g, '').replace(/<link rel="canonical"[^>]*>\s*/g, '')
    const tags = `<title>${escape(metadata.title)}</title>\n    <meta name="description" content="${escape(metadata.description)}">\n    <link rel="canonical" href="${escape(metadata.canonical)}">${metadata.noindex ? '\n    <meta name="robots" content="noindex">' : ''}`
    return `<head>${head.replace(/<title>[\s\S]*?<\/title>/, tags)}</head>`
  })
}
