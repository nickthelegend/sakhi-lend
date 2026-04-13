"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Wallet,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/app/lender/dashboard" },
  { name: "My Portfolio", icon: Wallet, href: "/app/lender/portfolio" },
  { name: "Browse Beneficiaries", icon: Users, href: "/app/lender/browse" },
  { name: "Returns", icon: TrendingUp, href: "/app/lender/returns" },
  { name: "Settings", icon: Settings, href: "/app/lender/settings" },
]

export function LenderSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-6">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Sakhi<span className="text-primary">lend</span>
          </span>
        </Link>
        <Badge className="mt-2 bg-chart-2 text-card">Lender Portal</Badge>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r border-border bg-card lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r border-border bg-card lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}
