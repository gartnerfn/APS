"use client"

import { User, Settings, LogOut, ChartArea, BookKey } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function ProfileDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleAdmin = () => {
    router.push("/admin")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Editar perfil</span>
        </DropdownMenuItem>
        {user?.user_role === "administrador" && (
          <Link href="/admin">
            <DropdownMenuItem>
              <BookKey className="mr-2 h-4 w-4" />
              <span>Administrar usuarios</span>
            </DropdownMenuItem>
          </Link>
        )}
        {user?.user_role === "escuderia" && (
          <Link href="/dashboard">
            <DropdownMenuItem>
              <ChartArea className="mr-2 h-4 w-4" />
              <span>Estadisticas</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
