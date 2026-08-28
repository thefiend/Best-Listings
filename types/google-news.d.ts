import 'react'

declare module 'react' {
  interface HTMLAttributes<T> {
    'google-add-preferred-source-btn'?: boolean | ''
    'data-theme'?: string
    'data-lang'?: string
  }
}
