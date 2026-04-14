"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Home, Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { WalletButton } from "@txnlab/use-wallet-ui-react"


export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/faucet", label: "Faucet" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
  ]


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo-sakhilend.png" 
            alt="SakhiLend Logo" 
            width={150} 
            height={40} 
            className="h-10 w-auto"
            priority
          />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.icon && <link.icon className="h-4 w-4" />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="wui-custom-trigger">
            <WalletButton />
          </div>
          <Button asChild size="sm" className="rounded-full px-6">
            <Link href="/app">Launch App</Link>
          </Button>
        </div>


        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              About
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              Contact
            </Link>

            <div className="mt-4 flex flex-col gap-3">
              <div className="wui-custom-trigger">
                <WalletButton />
              </div>
              <Button asChild className="w-full rounded-full">
                <Link href="/app" onClick={() => setMobileMenuOpen(false)}>Launch App</Link>
              </Button>
            </div>

          </nav>
        </div>
      )}
    </header>
  )
}
