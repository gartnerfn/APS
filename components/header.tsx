"use client"

import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"
import Link from "next/link"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flag className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tighter text-foreground">FÓRMULA 1</h1>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="font-semibold bg-primary hover:bg-primary/90">Registrarse</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="mt-6 flex gap-6 text-sm font-medium">
          <a href="#calendario" className="text-foreground hover:text-primary transition-colors">
            CALENDARIO
          </a>
          <a href="#pilotos" className="text-foreground hover:text-primary transition-colors">
            PILOTOS
          </a>
          <a href="#puntajes" className="text-foreground hover:text-primary transition-colors">
            PUNTAJES
          </a>
          <a href="#sanciones" className="text-foreground hover:text-primary transition-colors">
            SANCIONES
          </a>
        </nav>
      </div>
    </header>
  )
}
