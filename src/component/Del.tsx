import React from 'react'

export default function Del({ children }: { children: React.ReactNode }) {
  return <del className="md-del">{children}</del>
}
