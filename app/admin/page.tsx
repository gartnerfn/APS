"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, Trash2, Edit3, Plus, UserPlus } from "lucide-react"

export default function AdminPage() {
  const { user, getAllUsers, updateUser, deleteUser, createUser } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [nameInput, setNameInput] = useState("")
  const [roleInput, setRoleInput] = useState<"usuario" | "escuderia" | "administrador">("usuario")
  
  // Estados para crear nuevo usuario
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState<"usuario" | "escuderia" | "administrador">("usuario")

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

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert("Por favor completa todos los campos")
      return
    }

    const success = createUser(newUserName.trim(), newUserEmail.trim(), newUserRole)
    
    if (success) {
      alert("Usuario creado exitosamente")
      setUsers(getAllUsers())
      // Limpiar formulario
      setNewUserName("")
      setNewUserEmail("")
      setNewUserRole("usuario")
      setShowCreateForm(false)
    } else {
      alert("El email ya está registrado")
    }
  }

  const cancelCreateUser = () => {
    setNewUserName("")
    setNewUserEmail("")
    setNewUserRole("usuario")
    setShowCreateForm(false)
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>Gestión de usuarios</CardTitle>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Crear Usuario
              </Button>
            </CardHeader>
            <CardContent>
              {/* Formulario para crear nuevo usuario */}
              {showCreateForm && (
                <div className="border rounded-lg p-4 mb-6 bg-muted/50">
                  <h3 className="text-lg font-semibold mb-3">Crear nuevo usuario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="newUserName">Nombre</Label>
                      <Input
                        id="newUserName"
                        placeholder="Nombre del usuario"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newUserEmail">Email</Label>
                      <Input
                        id="newUserEmail"
                        type="email"
                        placeholder="email@ejemplo.com"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newUserRole">Rol</Label>
                      <select 
                        id="newUserRole"
                        value={newUserRole} 
                        onChange={(e) => setNewUserRole(e.target.value as any)}
                        className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                      >
                        <option value="usuario">Usuario</option>
                        <option value="escuderia">Escudería</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button onClick={handleCreateUser} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Crear Usuario
                    </Button>
                    <Button variant="outline" onClick={cancelCreateUser}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

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
