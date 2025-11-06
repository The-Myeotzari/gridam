'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavLinkProps = {
  href: string
  label: string
  activeColor: 'primary' | 'accent' // 명시적으로 지정
}

export default function NavLink({ href, label, activeColor }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  // 색상 매핑
  const colorMap = {
    primary: {
      active: 'bg-primary text-primary-foreground',
      hover: 'hover:bg-primary text-foreground',
    },
    accent: {
      active: 'bg-accent text-accent-foreground',
      hover: 'hover:bg-accent text-foreground',
    },
  }

  const color = colorMap[activeColor]

  return (
    <Link
      href={href}
      className={`text-lg px-4 py-2 rounded-full transition-all ${
        isActive ? color.active : color.hover
      }`}
    >
      {label}
    </Link>
  )
}
