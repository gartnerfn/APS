"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 border-b border-border bg-card z-99">
      <div className="container flex justify-between mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/f1.png" alt="F1 Logo" width={48} height={48} />
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm font-medium">
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
    </header>
  )
}
