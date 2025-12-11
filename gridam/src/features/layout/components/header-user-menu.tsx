import { UserAvatarServer } from '@/shared/ui/user-avatar.server'
import HeaderUserMenuClient from './header-user-menu.client'

interface HeaderUserMenuProps {
  userName: string
}

export default async function HeaderUserMenu({ userName }: HeaderUserMenuProps) {
  const avatar = <UserAvatarServer size={35} className="text-lg" />
  return <HeaderUserMenuClient userName={userName} avatar={avatar} />
}
