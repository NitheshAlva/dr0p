"use client"

import React from "react"
import Link from "next/link"
import { Github, FileText, Upload } from "lucide-react"
import { TextHoverEffect } from '@/components/ui/text-hover-effect'

export default function Footer() {
  return (
    <footer className="w-full relative py-16 overflow-hidden">
      
      {/* Content layer */}
      <div className="container relative mx-auto px-6 z-10">
        {/* Top gradient line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-200 to-transparent mb-12" />
        
        
        {/* Simple footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Essential links */}
          <div className="flex items-center space-x-8 mb-6 md:mb-0">
            <Link 
              href="/note" 
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Note</span>
            </Link>
            <Link 
              href="/file" 
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <Upload className="h-5 w-5" />
              <span>File</span>
            </Link>
            <Link 
              href="https://github.com/NitheshAlva/dr0p" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </Link>
          </div>
          
          {/* Copyright */}
          <div className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} dr0p
          </div>
        </div>
        <div className=" flex items-center justify-center">
            <TextHoverEffect text="dr0p" />
        </div>
      </div>
    </footer>
  )
}