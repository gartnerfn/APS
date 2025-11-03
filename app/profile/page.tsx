"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Flag, Trash2, ArrowLeft, Crown, Users, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { PerRacePointsSection } from "@/components/per-race-points-section"

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(name, email)
      alert("Perfil actualizado correctamente")
    } catch (error) {
      console.error("Error actualizando perfil:", error)
      alert("Error al actualizar el perfil")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAccount()
      router.push("/")
    } catch (error) {
      console.error("Error eliminando cuenta:", error)
      alert("Error al eliminar la cuenta")
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Flag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
          </div>
          
          {/* Etiqueta de rol */}
          <div className="flex items-center gap-2">
            {user.user_role === "administrador" && (
              <Badge variant="outline" className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Administrador
              </Badge>
            )}
            {user.user_role === "escuderia" && (
              <Badge variant="secondary" className="flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-200">
                <Users className="h-4 w-4" />
                Escudería
              </Badge>
            )}
            {user.user_role === "usuario" && (
              <Badge variant="outline" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Usuario
              </Badge>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Actualiza tus datos personales</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit">Guardar cambios</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de peligro</CardTitle>
              <CardDescription>Acciones irreversibles en tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDeleteConfirm ? (
                <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar cuenta
                </Button>
              ) : (
                <Alert variant="destructive">
                  <AlertDescription className="space-y-4">
                    <p className="font-semibold">¿Estás seguro que deseas eliminar tu cuenta?</p>
                    <p className="text-sm">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleDelete} size="sm">
                        Sí, eliminar mi cuenta
                      </Button>
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} size="sm">
                        Cancelar
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Puntos por carrera (sección de usuario) */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Competencia</h2>
            <PerRacePointsSection />
          </div>
        </div>
      </div>
    </div>
  )
}
