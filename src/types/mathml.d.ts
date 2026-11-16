import type { DetailedHTMLProps, HTMLAttributes } from 'react'

// React 19's installed types omit these native MathML elements used by Infinite.
type MathMLProps = DetailedHTMLProps<HTMLAttributes<MathMLElement>, MathMLElement>

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      math: MathMLProps
      mfrac: MathMLProps
      mn: MathMLProps
    }
  }
}
