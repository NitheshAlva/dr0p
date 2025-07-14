"use client"

import NavLink from "./NavLink"
import Link from "next/link"
import { FileText, Upload, Github } from "lucide-react"
import { usePathname } from "next/navigation"
import Image from "next/image"

export default function Navbar() {
  const pathname = usePathname()
  const name = pathname.split('/').length === 3 ? pathname.split('/')[2] : null
  
  return (
    <header className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-10">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo-bgrm.png"
              alt="Logo"
              width={90}
              height={15}
              className="object-contain"
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavLink href="/n" icon={<FileText className="mr-2 h-4 w-4" />} pathname={pathname}>
              Note
            </NavLink>
            <NavLink href="/f" icon={<Upload className="mr-2 h-4 w-4" />} pathname={pathname}>
              File
            </NavLink>
          </nav>
        </div>
        
        {name && (
          <div className="text-sm font-medium text-foreground">
            {name.toUpperCase()}
          </div>
        )}
        
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
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  )
}