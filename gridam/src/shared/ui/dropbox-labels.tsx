export type DropBoxTone = 'default' | 'secondary' | 'destructive'

export type DropBoxItem<TArg> = {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  tone?: DropBoxTone
  disabled?: boolean
  onSelect?: (arg: TArg) => Promise<void> | void
}

const toneClass: Record<DropBoxTone, string> = {
  default: 'text-foreground hover:bg-accent',
  secondary: 'text-foreground hover:bg-accent',
  destructive: 'text-destructive hover:bg-destructive/10',
}

export default function DropBoxLabels<TArg>({
  items,
  onPick,
  className = '',
}: {
  items: DropBoxItem<TArg>[]
  onPick: (item: DropBoxItem<TArg>) => void
  className?: string
}) {
  return (
    <div
      role="menu"
      aria-orientation="vertical"
      className={`min-w-32 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md ${className}`}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={() => !item.disabled && onPick(item)}
          className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm
                      ${toneClass[item.tone ?? 'default']}
                      ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  )
}
