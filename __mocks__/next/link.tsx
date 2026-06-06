import React from 'react'

export default function Link({
  children,
  href,
  ...props
}: {
  children: React.ReactNode
  href: string
  [key: string]: unknown
}) {
  return React.createElement('a', { href, ...props }, children)
}
