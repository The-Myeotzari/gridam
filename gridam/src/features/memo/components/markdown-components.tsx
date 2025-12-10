import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
  h1: ({ node, ...props }) => <h1 className="mb-3 text-2xl font-bold text-foreground" {...props} />,
  h2: ({ node, ...props }) => (
    <h2 className="mb-2 mt-4 text-xl font-semibold text-foreground" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className="mb-2 mt-3 text-lg font-semibold text-foreground" {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-2 text-sm leading-relaxed text-foreground whitespace-pre-wrap" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-foreground" {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-foreground" {...props} />
  ),
  li: ({ node, ...props }) => <li className="text-sm leading-relaxed" {...props} />,
  strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
  em: ({ node, ...props }) => <em className="text-foreground" {...props} />,
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="mb-3 border-l-4 border-accent-soft pl-3 text-sm text-muted-foreground whitespace-pre-wrap"
      {...props}
    />
  ),
  code(props) {
    const { inline, className, children, ...rest } = props as {
      inline?: boolean
      className?: string
      children?: React.ReactNode
      [key: string]: unknown
    }

    if (inline) {
      return (
        <code
          className={'rounded bg-muted px-1.5 py-0.5 text-xs font-mono ' + (className ?? '')}
          {...rest}
        >
          {children}
        </code>
      )
    }

    return (
      <pre className="mb-3 overflow-x-auto rounded-md bg-muted p-3 text-xs text-foreground">
        <code className={className} {...rest}>
          {children}
        </code>
      </pre>
    )
  },
}
