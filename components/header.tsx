"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/auth-context"
import { ProfileDropdown } from "@/components/profile-dropdown"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useIsMobile } from "../hooks/use-mobile"

export function Header() {
  const { user } = useAuth()
  const isMobile = useIsMobile()

  const navLinks = [
    { href: "/#calendario", label: "CALENDARIO" },
    { href: "/#pilotos", label: "PILOTOS" },
    { href: "/#puntajes", label: "PUNTAJES" },
    { href: "/#sanciones", label: "SANCIONES" },
    { href: "/#noticias", label: "NOTICIAS" },
  ]

  return (
    <header className="sticky top-0 border-b border-border bg-card z-50">
      <div className=" grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] mx-auto px-4 py-2">
        <Link href="/#calendario" className="flex items-center gap-3">
          <Image src="/f1.png" alt="F1 Logo" width={48} height={48} />
        </Link>

        {!isMobile && (
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3 place-self-end">
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-4 w-[250px]">
                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="border-t border-border my-2" />
                  {user ? (
                    <ProfileDropdown />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link href="/login">
                        <Button variant="ghost" className="w-full font-semibold">
                          Iniciar sesión
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full font-semibold bg-primary hover:bg-primary/90">
                          Registrarse
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          ) : user ? (
            <ProfileDropdown />
          ) : (
            <div className="flex gap-2 place-self-end">
              <Link href="/login">
                <Button variant="ghost" className="font-semibold">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
