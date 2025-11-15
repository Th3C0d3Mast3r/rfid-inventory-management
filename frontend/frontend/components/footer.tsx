"use client"

import Link from "next/link"

export function Footer(){
  const year=new Date().getFullYear()

  return(
    <footer className="w-full border-t border-border bg-background text-foreground mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          © {year} <span className="font-semibold">RFID Inventory System</span>. All rights reserved.
        </p>

        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-primary transition-colors">v1.0.1</Link>
          <Link href="https://github.com/Th3C0d3Mast3r/rfid-inventory-management/" className="hover:text-primary transition-colors">base repo</Link>
        </div>
      </div>
    </footer>
  )
}
