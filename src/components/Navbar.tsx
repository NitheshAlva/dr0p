"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { FileText, Upload, Github } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useTheme} from "next-themes"
import { useEffect, useState } from "react"

export default function Navbar() {
  const {resolvedTheme}= useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted
    ? resolvedTheme === 'dark'
      ? '/logo-dark-bgrm.png'
      : '/logo-light-bgrm.png'
    : '/logo-light-bgrm.png'
  const name= pathname.split('/').length==3?pathname.split('/')[2]:null
  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logoSrc}
              alt="Logo"
              width={90}
              height={15}
              className="object-contain"
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLink href="/note" icon={<FileText className="mr-2 h-4 w-4" />} pathname={pathname}>
              Note
            </NavLink>
            <NavLink href="/file" icon={<Upload className="mr-2 h-4 w-4" />} pathname={pathname}>
              File
            </NavLink>
          </nav>
        </div>
        {name&&<div>
          {name.toUpperCase()}
        </div>}
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/NitheshAlva/dr0p"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            aria-label="GitHub repository"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only md:not-sr-only md:ml-2">GitHub</span>
          </Link>
          <ModeToggle />
        </div>
      </div>
      {/* Faded line effect at the bottom */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-200 to-transparent" />
    </header>
  )
}

// NavLink component for cleaner code
function NavLink({ href, icon, children, pathname }:{
  href: string;
  icon: React.ReactNode; 
  children: React.ReactNode; 
  pathname: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center text-sm font-medium transition-colors hover:text-primary relative py-2",
        pathname?.startsWith(href) 
          ? "text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']" 
          : "text-muted-foreground"
      )}
    >
      {icon}
      {children}
    </Link>
  )
}