// Keep URL generation shared between the application and content validation.
export function pagePathToRoute(filename: string): string {
  return '/' + filename
    .replace(/^\.\.\/pages\//, '')
    .replace(/^\/?pages\//, '')
    .replace(/\.mdx$/, '')
    .replace(/(^|\/)Index$/, '$1')
}

export function normalizeRoute(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/'
}
