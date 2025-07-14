import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NavLink({ 
  href, 
  icon, 
  children, 
  pathname 
}: {
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