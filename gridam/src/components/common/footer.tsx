import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 py-6 text-center border-t border-border shrink-0">
      <p className="font-handwritten text-muted-foreground">그리담 © 묫자리팀</p>
      <Link
        href="https://github.com/The-Myeotzari/gridam"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        https://github.com/The-Myeotzari/gridam
      </Link>
    </footer>
  )
}
