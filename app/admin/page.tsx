"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Trash2, Edit3 } from "lucide-react"

export default function AdminPage() {
  const { user, getAllUsers, updateUser, deleteUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [roleInput, setRoleInput] = useState<"usuario" | "escuderia" | "administrador">("usuario")

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.user_role !== "administrador") {
      router.push("/")
      return
    }

    setUsers(getAllUsers())
  }, [user])

  const startEdit = (u: any) => {
    setEditingId(u.id)
    setNameInput(u.name)
    setRoleInput(u.user_role)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNameInput("")
  }

  const saveEdit = () => {
    if (!editingId) return
    updateUser(editingId, nameInput, roleInput)
    setUsers(getAllUsers())
    cancelEdit()
  }

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return
    deleteUser(id)
    setUsers(getAllUsers())
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

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Panel de administración</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.length === 0 && <p className="text-sm text-muted-foreground">No hay usuarios.</p>}

                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-4 border-b py-3">
                    <div className="flex-1">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email} — {u.user_role}</div>
                    </div>

                    {editingId === u.id ? (
                      <div className="flex items-center gap-2">
                        <Input value={nameInput} onChange={(e) => setNameInput(e.target.value)} className="w-40" />
                        <select value={roleInput} onChange={(e) => setRoleInput(e.target.value as any)} className="border rounded px-2 py-1 text-sm">
                          <option value="usuario">Usuario</option>
                          <option value="escuderia">Escudería</option>
                          <option value="administrador">Administrador</option>
                        </select>
                        <Button size="sm" onClick={saveEdit}>Guardar</Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancelar</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(u)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
