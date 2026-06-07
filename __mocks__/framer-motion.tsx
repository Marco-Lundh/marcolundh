import React from 'react'

type Props = { children?: React.ReactNode; [key: string]: unknown }

const make = (tag: string) =>
  ({
    children,
    initial,
    animate,
    exit,
    transition,
    whileInView,
    viewport,
    ...rest
  }: Props) =>
    React.createElement(tag, rest as React.HTMLAttributes<HTMLElement>, children)

export const motion = {
  div: make('div'),
  p: make('p'),
  h1: make('h1'),
  h2: make('h2'),
  h3: make('h3'),
  nav: make('nav'),
  footer: make('footer'),
  span: make('span'),
  article: make('article'),
}

export const AnimatePresence = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children)
